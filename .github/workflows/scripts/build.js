const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const wwwDir = path.join(projectRoot, 'www');

if (!fs.existsSync(wwwDir)) {
    fs.mkdirSync(wwwDir);
}

const filesToCopy = [
    'index.html', 'app.js', 'store.js', 'config.js', 'data.js', 
    'styles.css', 'manifest.json', 'sw.js', 'icons'
];

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

filesToCopy.forEach(item => {
    const src = path.join(projectRoot, item);
    const dest = path.join(wwwDir, item);
    if (fs.existsSync(src)) {
        copyRecursiveSync(src, dest);
    }
});
