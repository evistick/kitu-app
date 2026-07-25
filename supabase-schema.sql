-- ========================================================
-- SUPABASE SCHEMA FOR KITU
-- Ejecuta este script en el editor SQL de Supabase
-- ========================================================

-- Habilitar extensión UUID si no está habilitada
create extension if not exists "uuid-ossp";

-- 1. TABLA DE PERFILES (profiles)
-- Sincronizada con auth.users de Supabase
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    email text unique not null,
    phone text,
    role text not null check (role in ('client', 'provider', 'admin')),
    address text,
    avatar_url text,
    country_code text default 'MX' check (char_length(country_code) = 2),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en profiles
alter table public.profiles enable row level security;

-- Políticas para profiles
create policy "Los perfiles son públicos para usuarios autenticados"
    on public.profiles for select
    using (auth.role() = 'authenticated');

create policy "Los usuarios pueden actualizar su propio perfil"
    on public.profiles for update
    using (auth.uid() = id);

-- 2. TABLA DE DETALLES DE PROFESIONALES (providers_details)
create table public.providers_details (
    id uuid references public.profiles on delete cascade primary key,
    professions text[] default '{}'::text[] not null,
    rate_per_hour numeric default 0 not null,
    description text,
    rating numeric(3,2) default 5.0 check (rating >= 1.0 and rating <= 5.0),
    total_jobs integer default 0 not null,
    earnings numeric default 0 not null,
    is_available boolean default true not null,
    latitude double precision,
    longitude double precision
);

-- Habilitar RLS en providers_details
alter table public.providers_details enable row level security;

-- Políticas para providers_details
create policy "Detalles de proveedores son públicos"
    on public.providers_details for select
    using (auth.role() = 'authenticated');

create policy "Proveedores pueden editar sus detalles"
    on public.providers_details for update
    using (auth.uid() = id);

-- 3. TABLA DE SOLICITUDES DE SERVICIO (service_requests)
create table public.service_requests (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.profiles(id) on delete cascade not null,
    provider_id uuid references public.profiles(id) on delete set null,
    service_id text not null, -- ej. 'plumbing', 'electrician'
    service_title text not null,
    description text not null,
    photo_url text,
    urgency text not null check (urgency in ('low', 'normal', 'urgent')),
    address text not null,
    status text default 'pending' not null check (status in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
    price numeric,
    rating numeric(2,1) check (rating >= 1.0 and rating <= 5.0),
    review text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en service_requests
alter table public.service_requests enable row level security;

-- Políticas para service_requests
create policy "Clientes pueden ver sus propias solicitudes"
    on public.service_requests for select
    using (auth.uid() = client_id);

create policy "Proveedores pueden ver solicitudes asignadas o pendientes de su profesión"
    on public.service_requests for select
    using (auth.uid() = provider_id or status = 'pending');

create policy "Clientes pueden crear solicitudes"
    on public.service_requests for insert
    with check (auth.uid() = client_id);

create policy "Clientes y proveedores asignados pueden actualizar la solicitud"
    on public.service_requests for update
    using (auth.uid() = client_id or auth.uid() = provider_id);

-- 4. TABLA DE CHAT (chat_messages)
create table public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    request_id uuid references public.service_requests(id) on delete cascade not null,
    sender_id uuid references public.profiles(id) on delete cascade not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en chat_messages
alter table public.chat_messages enable row level security;

-- Políticas para chat_messages
create policy "Participantes de la solicitud pueden leer los mensajes"
    on public.chat_messages for select
    using (
        exists (
            select 1 from public.service_requests r
            where r.id = request_id and (r.client_id = auth.uid() or r.provider_id = auth.uid())
        )
    );

create policy "Participantes de la solicitud pueden enviar mensajes"
    on public.chat_messages for insert
    with check (
        auth.uid() = sender_id and
        exists (
            select 1 from public.service_requests r
            where r.id = request_id and (r.client_id = auth.uid() or r.provider_id = auth.uid())
        )
    );

-- ========================================================
-- FUNCIONES Y TRIGGERS AUTOMÁTICOS
-- ========================================================

-- Trigger para crear perfil público automáticamente al registrarse en Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, phone, country_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Usuario Kitu'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'country_code', 'MX')
  );
  
  -- Si el rol es proveedor, crear también su detalle inicial
  if coalesce(new.raw_user_meta_data->>'role', 'client') = 'provider' then
    insert into public.providers_details (id)
    values (new.id);
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger de Auth
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
