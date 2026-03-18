const { shell } = require('electron');

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

module.exports = { interceptLinks };
