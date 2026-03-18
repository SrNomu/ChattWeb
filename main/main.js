const { app, BrowserWindow } = require('electron');
const { openMainWindow, showView } = require('./windows.js');
const { registerIpcHandlers } = require('./ipcHandlers.js');

// Define o nome do app (importante para notificações e menus)
app.name = 'ChattWeb';

let mainWindow;

app.whenReady().then(() => {
  mainWindow = openMainWindow();
  registerIpcHandlers(showView);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) openMainWindow();
});
