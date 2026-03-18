const { BrowserView, session, shell } = require('electron');

// Cache das views de WhatsApp para manter sessão
const whatsappCache = new Map();

function interceptLinks(view, serviceUrl) {
  const serviceOrigin = new URL(serviceUrl).origin;

  view.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  view.webContents.on('will-navigate', (event, url) => {
    try {
      const urlOrigin = new URL(url).origin;
      if (urlOrigin !== serviceOrigin) {
        event.preventDefault();
        shell.openExternal(url);
      }
    } catch {}
  });
}

function defaultUserAgent() {
  return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';
}

/**
 * Cria ou retorna a view de WhatsApp de acordo com a conta
 * @param {string} accountName 'whatsapp1' ou 'whatsapp2'
 * @returns {BrowserView}
 */
function getWhatsAppView(accountName) {
  if (whatsappCache.has(accountName)) {
    return whatsappCache.get(accountName);
  }

  const url = 'https://web.whatsapp.com';
  const view = new BrowserView({
    webPreferences: {
      session: session.fromPartition(`persist:${accountName}`),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  view.webContents.loadURL(url, { userAgent: defaultUserAgent() });
  interceptLinks(view, url);

  // Debug opcional
  view.webContents.on('console-message', (e, level, msg) => {
    console.log(`[WhatsApp:${accountName}]`, msg);
  });

  whatsappCache.set(accountName, view);
  return view;
}

/**
 * Alterna entre whatsapp1 e whatsapp2 de forma segura
 * @param {string} currentViewName - view ativa antes da troca
 * @param {string} nextViewName - 'whatsapp1' ou 'whatsapp2'
 * @param {BrowserWindow} mainWindow
 * @returns {BrowserView} nova view ativa
 */
function switchWhatsApp(currentViewName, nextViewName, mainWindow) {
  if (!mainWindow) return null;
  if (currentViewName === nextViewName) return whatsappCache.get(nextViewName);

  // Remove a view atual
  const currentView = whatsappCache.get(currentViewName);
  if (currentView) {
    try { mainWindow.removeBrowserView(currentView); } catch {}
  }

  // Cria ou pega a view da próxima conta
  const nextView = getWhatsAppView(nextViewName);
  mainWindow.setBrowserView(nextView);

  // Ajusta tamanho
  const [width, height] = mainWindow.getContentSize();
  nextView.setBounds({ x: 80, y: 0, width: width - 80, height });
  nextView.setAutoResize({ width: true, height: true });

  return nextView;
}

module.exports = { getWhatsAppView, switchWhatsApp };
