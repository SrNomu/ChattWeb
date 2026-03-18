const { BrowserView, session } = require('electron');
const { interceptLinks } = require('./linkInterceptor');

function createServiceView(serviceName, url) {
  const view = new BrowserView({
    webPreferences: {
      session: session.fromPartition(`persist:${serviceName}`),
      contextIsolation: true
    }
  });

  view.webContents.loadURL(url);
  interceptLinks(view, url);

  return view;
}

module.exports = { createServiceView };
