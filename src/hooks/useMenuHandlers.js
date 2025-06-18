import { useEffect } from 'react';

export const useMenuHandlers = ({
  handleNewFile,
  handleOpenFile,
  handleOpenFolder,
  handleSaveFile,
  handleSaveAsFile,
  handleExportPDF,
  handleTogglePreview,
  setIsSidebarOpen
}) => {
  useEffect(() => {
    if (window.electronAPI) {
      const handleMenuAction = (event, action) => {
        switch (action) {
          case 'menu-new-file':
            handleNewFile();
            break;
          case 'menu-open-file':
            handleOpenFile();
            break;
          case 'menu-open-folder':
            handleOpenFolder();
            break;
          case 'menu-save-file':
            handleSaveFile();
            break;
          case 'menu-save-as-file':
            handleSaveAsFile();
            break;
          case 'menu-export-pdf':
            handleExportPDF();
            break;
          case 'menu-toggle-preview':
            handleTogglePreview();
            break;
          case 'menu-toggle-sidebar':
            setIsSidebarOpen(prev => !prev);
            break;
          default:
            break;
        }
      };

      window.electronAPI.onMenuAction(handleMenuAction);

      return () => {
        if (window.electronAPI && window.electronAPI.removeAllListeners) {
          window.electronAPI.removeAllListeners('menu-action');
        }
      };
    }
  }, []);
};