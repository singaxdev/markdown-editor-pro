const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,

  // File operations
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),

  // Dialogs
  showErrorDialog: (title, content) => ipcRenderer.invoke('show-error-dialog', title, content),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // Menu event listeners
  onMenuAction: (callback) => {
    const menuEvents = [
      'menu-new-file',
      'menu-open-file',
      'menu-open-folder',
      'menu-save-file',
      'menu-save-as-file',
      'menu-export-pdf',
      'menu-toggle-sidebar',
      'menu-toggle-preview'
    ];

    menuEvents.forEach(event => {
      ipcRenderer.on(event, callback);
    });

    // Return cleanup function
    return () => {
      menuEvents.forEach(event => {
        ipcRenderer.removeListener(event, callback);
      });
    };
  }
});