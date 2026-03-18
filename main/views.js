const { BrowserView, session, shell } = require('electron');

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

function createView(service) {
  const view = new BrowserView({
    webPreferences: {
      session: session.fromPartition(`persist:${service.name}`),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  view.webContents.loadURL(service.url);
  interceptLinks(view, service.url);

  return view;
}

module.exports = { createView };
