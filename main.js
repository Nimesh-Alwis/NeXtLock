const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1150,
        height: 750,
        minWidth: 900,
        minHeight: 600,
        title: 'NeXtLock Vault Security',
        autoHideMenuBar: true,
        backgroundColor: '#090d16',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    });

    // Load the main login page
    mainWindow.loadFile(path.join(__dirname, 'src/login/login.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
