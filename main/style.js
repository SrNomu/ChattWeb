// main/style.js
const path = require('path');
const { Menu } = require('electron');

function getMainWindowOptions() {
  return {
    width: 1200,
    height: 800,
    frame: true,              // barra de título nativa
    show: false,              // mostra depois de ready-to-show
    icon: path.join(__dirname, '../ChattWeb.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  };
}



function applyWindowStyles(win) {
  if (!win) return;

  // Remove menu padrão do Electron
  Menu.setApplicationMenu(null);

  // Aqui você pode adicionar outros ajustes visuais
  // Exemplo: bordas arredondadas ou transparência
}

module.exports = { getMainWindowOptions, applyWindowStyles };
