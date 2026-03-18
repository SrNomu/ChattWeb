const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios');
const { execFile } = require('child_process');
const fs = require('fs');
const https = require('https');

let mainWindow;
const serverUrl = 'https://raw.githubusercontent.com/usuario/repositorio/main/version.json';
let retryAttempts = 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    resizable: false,
    icon: path.join(__dirname, '../assets/icons/app-icon.ico'),
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());

  checkUpdate();
}

async function checkUpdate(timeout = 10000) {
  const currentVersion = app.getVersion();

  try {
    const response = await axios.get(serverUrl, { timeout });
    const latest = response.data.version;
    const downloadUrl = response.data.url;

    if (latest !== currentVersion) {
      mainWindow.webContents.send('update-status', `Atualização encontrada: ${latest}`);
      await downloadUpdate(downloadUrl);
      runChattWeb();
    } else {
      mainWindow.webContents.send('update-status', 'Seu app já está atualizado.');
      runChattWeb();
    }
  } catch (err) {
    retryAttempts++;
    if (retryAttempts === 1) {
      mainWindow.webContents.send('update-status', 'Falha na conexão. Tentando novamente (23s)...');
      setTimeout(() => checkUpdate(23000), 0);
    } else {
      mainWindow.webContents.send('update-status', '');
      mainWindow.webContents.send('show-retry-button');
    }
  }
}

function downloadUpdate(url) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../ChattWeb.exe');
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });
  });
}

function runChattWeb() {
  const chattWebPath = path.join(__dirname, '../ChattWeb.exe');
  execFile(chattWebPath, (err) => {
    if (err) console.error(err);
    app.quit();
  });
}

// Permite tentar novamente pelo botão
ipcMain.on('retry-update', () => {
  retryAttempts = 0;
  mainWindow.webContents.send('update-status', 'Buscando atualizações...');
  checkUpdate();
});

app.whenReady().then(createWindow);
