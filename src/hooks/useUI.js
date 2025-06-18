import { useState, useCallback } from 'react';

export const useUI = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [showRecentFiles, setShowRecentFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState('default');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  // Toast functions
  const showToast = useCallback((message, type = 'info') => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Loading functions
  const showLoading = useCallback((type = 'default', message = '') => {
    setIsLoading(true);
    setLoadingType(type);
    setLoadingMessage(message);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingType('default');
    setLoadingMessage('');
  }, []);

  // View mode handlers
  const handleTogglePreview = useCallback(() => {
    if (isSplitView) {
      setIsSplitView(false);
    }
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode, isSplitView]);

  const handleToggleSplitView = useCallback(() => {
    if (isSplitView) {
      // If currently in split view, turn it off and go back to editor
      setIsSplitView(false);
      setIsPreviewMode(false);
    } else {
      // If not in split view, turn it on and disable preview mode
      setIsSplitView(true);
      setIsPreviewMode(false);
    }
  }, [isSplitView]);

  return {
    // State
    isSidebarOpen,
    setIsSidebarOpen,
    isPreviewMode,
    setIsPreviewMode,
    isSplitView,
    setIsSplitView,
    showRecentFiles,
    setShowRecentFiles,
    isLoading,
    loadingType,
    loadingMessage,
    toast,

    // Functions
    showToast,
    hideToast,
    showLoading,
    hideLoading,
    handleTogglePreview,
    handleToggleSplitView
  };
};