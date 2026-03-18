const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    const validChannels = ['switch-view', 'window-control'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});
