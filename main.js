const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev'); // Permite detectar si estamos en modo desarrollo
const { autoUpdater } = require('electron-updater');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    //if (!isDev) {
        autoUpdater.checkForUpdatesAndNotify();
    //}
});

// Manejo de eventos del autoUpdater

autoUpdater.on('checking-for-update', () => {
    console.log('Buscando actualizaciones...');
});

autoUpdater.on('update-available', (info) => {
    console.log('Actualización disponible:', info);
});

autoUpdater.on('update-not-available', (info) => {
    console.log('No hay actualizaciones disponibles:', info);
});

autoUpdater.on('error', (err) => {
    console.error('Error en autoUpdater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
    let percent = Math.round(progressObj.percent);
    console.log(`Descargando actualización: ${percent}%`);
});

autoUpdater.on('update-downloaded', (info) => {
    console.log('Actualización descargada; se reiniciará la aplicación para instalarla.');
    // Reinicia la app y aplica la actualización
    autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    // En macOS es común recrear la ventana cuando se hace clic en el dock
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
