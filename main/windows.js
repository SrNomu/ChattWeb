// main/windows.js
const { BrowserWindow } = require('electron');
const path = require('path');
const { createView } = require('./views.js');
const { switchWhatsApp } = require('./whatsappManager.js');
const services = require('./services.js');
const { getMainWindowOptions, applyWindowStyles } = require('./style.js');

let mainWindow;
let currentView = null;
let currentServiceName = null;
const viewsCache = new Map();

/**
 * Verifica se é WhatsApp (para alternar entre instâncias)
 */
function isWhatsApp(name) {
  return name === 'whatsapp1' || name === 'whatsapp2';
}

/**
 * Cria a janela principal usando as opções do style.js
 */
function openMainWindow() {
  mainWindow = new BrowserWindow(getMainWindowOptions());
  applyWindowStyles(mainWindow);

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => (mainWindow = null));

  // Ajusta o tamanho da view quando a janela for redimensionada
  mainWindow.on('resize', () => {
    if (!mainWindow || !currentView) return;
    const [width, height] = mainWindow.getContentSize();
    currentView.setBounds({ x: 80, y: 0, width: width - 80, height });
  });

  // Inicializa com WhatsApp1
  showView('whatsapp1');

  mainWindow.once('ready-to-show', () => mainWindow.show());

  return mainWindow;
}

/**
 * Alterna a view ativa da janela
 */
function showView(serviceName) {
  if (!mainWindow) return;
  if (currentServiceName === serviceName) return;

  const service = services.find(s => s.name === serviceName);
  if (!service) return;

  if (isWhatsApp(serviceName)) {
    // Alterna entre WhatsApp1 e WhatsApp2
    currentView = switchWhatsApp(currentServiceName, serviceName, mainWindow);
  } else {
    // Serviços normais (Telegram, Messenger, Line)
    if (currentView && isWhatsApp(currentServiceName)) {
      try { mainWindow.removeBrowserView(currentView); } catch {}
      currentView = null;
    }

    if (viewsCache.has(serviceName)) {
      currentView = viewsCache.get(serviceName);
    } else {
      currentView = createView(service);
      viewsCache.set(serviceName, currentView);
    }

    mainWindow.setBrowserView(currentView);
    const [width, height] = mainWindow.getContentSize();
    currentView.setBounds({ x: 80, y: 0, width: width - 80, height });
    currentView.setAutoResize({ width: true, height: true });
  }

  currentServiceName = serviceName;
}

module.exports = { openMainWindow, showView };
