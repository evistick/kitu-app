const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

function read(file) {
    return fs.readFileSync(path.join(projectRoot, file), 'utf8');
}

// Cada archivo se envuelve en un IIFE para evitar colisiones de nombres
// (CONFIG, STATUS_LABELS, etc.). El acceso entre archivos va por window.

// ---------- config.js ----------
let config = read('config.js')
    .replace(/^export\s+/gm, '')
    .replace("DATABASE_MODE: 'supabase'", "DATABASE_MODE: 'local' // file:// no soporta módulos ES ni Supabase");
config = '(function(){\n' + config + '\n' +
    'window.CONFIG = CONFIG;\n' +
    'window.REGION_SETTINGS = REGION_SETTINGS;\n' +
    'window.getActiveSettings = getActiveSettings;\n' +
    'window.translate = translate;\n' +
    '})();\n';

// ---------- store.js ----------
let store = read('store.js')
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/^export\s+/gm, '')
    // referencias globales vía window (config y helper), sin tocar accesos de propiedad (.CONFIG)
    .replace(/(?<!\.)\bCONFIG\b/g, 'window.CONFIG')
    .replace(/(?<!\.)\bgetActiveSettings\b/g, 'window.getActiveSettings');
store = '(function(){\n' + store + '\n})();\n';

// ---------- app.js ----------
// app.js se deja a nivel global (como en la app real, donde se carga como
// script clásico) para que sus funciones (navigate, renderHome, etc.) sean
// accesibles desde los atributos onclick. Sus const locales no chocan con las
// de config/store porque esas van dentro de IIFE.
let app = read('app.js');
app = app + '\n';

const banner = '/* KITU standalone bundle - para abrir index.html directamente (file://) */\n';
fs.writeFileSync(path.join(projectRoot, 'standalone-app.js'), banner + config + '\n' + store + '\n' + app);
console.log('Generado standalone-app.js (modo local, sin módulos ES)');