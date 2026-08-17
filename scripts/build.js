const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const wwwDir = path.join(projectRoot, 'www');

// Asegurar que la carpeta www exista
if (!fs.existsSync(wwwDir)) {
    fs.mkdirSync(wwwDir);
}

// Archivos y directorios a copiar a www
const filesToCopy = [
    'index.html',
    'app.js',
    'store.js',
    'config.js',
    'data.js',
    'styles.css',
    'manifest.json',
    'sw.js',
    'icons'
];

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

console.log('Empaquetando Kitu para Capacitor en /www...');
filesToCopy.forEach(item => {
    const src = path.join(projectRoot, item);
    const dest = path.join(wwwDir, item);
    if (fs.existsSync(src)) {
        copyRecursiveSync(src, dest);
        console.log(`Copiado: ${item}`);
    }
});
console.log('¡Empaquetado completado!');

// Generar también el bundle standalone para abrir index.html directamente (file://)
require('./build-standalone.js');
