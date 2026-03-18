// /main/ipcHandlers.js
const { ipcMain } = require('electron');
const { sendSystemNotification } = require('./notifications.js'); // função que cria a notificação

function registerIpcHandlers(showView) {
  // Troca de view
  ipcMain.on('switch-view', (event, serviceName) => {
    try {
      showView(serviceName);
    } catch (error) {
      console.error('Erro ao trocar de view:', error);
    }
  });

  // Foca a janela
  ipcMain.on('focus-window', (event) => {
    const win = event.sender.getOwnerBrowserWindow();
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });

  // Controle de janelas: minimizar, maximizar, fechar
  ipcMain.on('window-control', (event, action) => {
    const win = event.sender.getOwnerBrowserWindow();
    if (!win) return;

    switch (action) {
      case 'minimize':
        win.minimize();
        break;
      case 'maximize':
        win.isMaximized() ? win.unmaximize() : win.maximize();
        break;
      case 'close':
        win.close();
        break;
      default:
        console.warn('Ação de janela desconhecida:', action);
    }
  });

  // Notificação do sistema com som personalizado
  ipcMain.on('show-notification', (event, title, message) => {
    try {
      sendSystemNotification(title, message);
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
    }
  });
}

module.exports = { registerIpcHandlers };
