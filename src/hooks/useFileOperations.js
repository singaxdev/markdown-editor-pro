import { useState, useCallback } from 'react';

export const useFileOperations = ({
  content,
  setContent,
  currentFile,
  setCurrentFile,
  isDirty,
  setIsDirty,
  showLoading,
  hideLoading,
  showToast,
  addToRecentFiles
}) => {
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [files, setFiles] = useState([]);

  const handleNewFile = useCallback(async () => {
    if (isDirty) {
      if (window.electronAPI) {
        const result = await window.electronAPI.showMessageDialog({
          type: 'question',
          buttons: ['Save', "Don't Save", 'Cancel'],
          defaultId: 0,
          message: 'Do you want to save the changes to your document?',
          detail: 'Your changes will be lost if you don\'t save them.'
        });

        if (result.response === 2) return; // Cancel
        if (result.response === 0) { // Save
          await handleSaveFile();
        }
      } else {
        if (!window.confirm('You have unsaved changes. Continue?')) return;
      }
    }

    setContent('# New Document\n\nStart writing...');
    setCurrentFile(null);
    setIsDirty(false);
    showToast('New document created', 'success');
  }, [isDirty, setContent, setCurrentFile, setIsDirty, showToast]);

  const handleOpenFile = useCallback(async () => {
    try {
      showLoading('file', 'Opening file...');

      if (window.electronAPI) {
        const result = await window.electronAPI.showOpenDialog({
          filters: [
            { name: 'Markdown', extensions: ['md', 'markdown'] },
            { name: 'Text', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
          ],
          properties: ['openFile']
        });

        if (!result.canceled && result.filePaths.length > 0) {
          const filePath = result.filePaths[0];
          const fileResult = await window.electronAPI.readFile(filePath);

          if (fileResult.success) {
            setContent(fileResult.content);
            setCurrentFile(filePath);
            setIsDirty(false);
            addToRecentFiles(filePath);
            showToast(`Opened ${filePath.split('/').pop().split('\\').pop()}`, 'success');
          } else {
            await window.electronAPI.showErrorDialog('Error', `Could not open file: ${fileResult.error}`);
            showToast('Failed to open file', 'error');
          }
        }
      } else {
        // Fallback for web version
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.markdown,.txt';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setContent(e.target.result);
              setCurrentFile(file.name);
              setIsDirty(false);
              showToast(`Opened ${file.name}`, 'success');
            };
            reader.readAsText(file);
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('Error opening file:', error);
      showToast('Error opening file', 'error');
    } finally {
      hideLoading();
    }
  }, [setContent, setCurrentFile, setIsDirty, showLoading, hideLoading, showToast, addToRecentFiles]);

  const handleSaveFile = useCallback(async () => {
    try {
      showLoading('save', 'Saving file...');

      if (window.electronAPI) {
        let filePath = currentFile;

        if (!filePath) {
          const result = await window.electronAPI.showSaveDialog({
            filters: [
              { name: 'Markdown', extensions: ['md'] },
              { name: 'Text', extensions: ['txt'] }
            ]
          });

          if (result.canceled) {
            hideLoading();
            return;
          }
          filePath = result.filePath;
        }

        const writeResult = await window.electronAPI.writeFile(filePath, content);

        if (writeResult.success) {
          setCurrentFile(filePath);
          setIsDirty(false);
          addToRecentFiles(filePath);
          showToast(`Saved ${filePath.split('/').pop().split('\\').pop()}`, 'success');
        } else {
          await window.electronAPI.showErrorDialog('Error', `Could not save file: ${writeResult.error}`);
          showToast('Failed to save file', 'error');
        }
      } else {
        // Fallback for web version
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFile || 'document.md';
        a.click();
        URL.revokeObjectURL(url);
        setIsDirty(false);
        showToast('File downloaded', 'success');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      showToast('Error saving file', 'error');
    } finally {
      hideLoading();
    }
  }, [currentFile, content, setCurrentFile, setIsDirty, showLoading, hideLoading, showToast, addToRecentFiles]);

  const handleOpenFolder = useCallback(async () => {
    try {
      showLoading('folder', 'Opening folder...');

      if (window.electronAPI) {
        const result = await window.electronAPI.showOpenDialog({
          properties: ['openDirectory']
        });

        if (!result.canceled && result.filePaths.length > 0) {
          const dirPath = result.filePaths[0];
          await loadDirectory(dirPath);
          showToast(`Opened folder ${dirPath.split('/').pop() || dirPath.split('\\').pop()}`, 'success');
        }
      }
    } catch (error) {
      console.error('Error opening folder:', error);
      showToast('Error opening folder', 'error');
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const loadDirectory = useCallback(async (dirPath) => {
    try {
      if (window.electronAPI) {
        const dirResult = await window.electronAPI.readDirectory(dirPath);

        if (dirResult.success) {
          // Filter to only show markdown files and directories
          const filteredFiles = dirResult.files.filter(file => {
            if (file.isDirectory) {
              return true; // Always show directories
            }

            // Only show markdown and text files
            const fileName = file.name.toLowerCase();
            return fileName.endsWith('.md') ||
              fileName.endsWith('.markdown') ||
              fileName.endsWith('.txt') ||
              fileName.endsWith('.mdown') ||
              fileName.endsWith('.mkd') ||
              fileName.endsWith('.mdx');
          });

          setFiles(filteredFiles);
          setCurrentDirectory(dirPath);
        } else {
          await window.electronAPI.showErrorDialog('Error', `Could not read directory: ${dirResult.error}`);
          showToast('Failed to read directory', 'error');
        }
      }
    } catch (error) {
      console.error('Error reading directory:', error);
      showToast('Error reading directory', 'error');
    }
  }, [showToast]);

  const handleFileSelect = useCallback(async (filePath) => {
    try {
      showLoading('file', 'Loading file...');

      if (window.electronAPI) {
        const fileResult = await window.electronAPI.readFile(filePath);

        if (fileResult.success) {
          setContent(fileResult.content);
          setCurrentFile(filePath);
          setIsDirty(false);
          addToRecentFiles(filePath);
          showToast(`Opened ${filePath.split('/').pop().split('\\').pop()}`, 'success');
        } else {
          await window.electronAPI.showErrorDialog('Error', `Could not open file: ${fileResult.error}`);
          showToast('Failed to open file', 'error');
        }
      }
    } catch (error) {
      console.error('Error reading file:', error);
      showToast('Error reading file', 'error');
    } finally {
      hideLoading();
    }
  }, [setContent, setCurrentFile, setIsDirty, showLoading, hideLoading, showToast, addToRecentFiles]);

  return {
    currentDirectory,
    files,
    handleNewFile,
    handleOpenFile,
    handleSaveFile,
    handleOpenFolder,
    handleFileSelect,
    loadDirectory
  };
};