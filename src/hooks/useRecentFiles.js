import { useState, useCallback } from 'react';

export const useRecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState([]);

  const addToRecentFiles = useCallback((filePath) => {
    setRecentFiles(prev => {
      const filtered = prev.filter(file => file.path !== filePath);
      const newFile = { path: filePath, timestamp: Date.now() };
      return [newFile, ...filtered].slice(0, 10); // Keep only 10 recent files
    });
  }, []);

  const removeFromRecentFiles = useCallback((filePath) => {
    setRecentFiles(prev => prev.filter(file => file.path !== filePath));
  }, []);

  return {
    recentFiles,
    addToRecentFiles,
    removeFromRecentFiles
  };
};