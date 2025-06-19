import { useRef, useCallback, useEffect } from 'react';

export const useScrollSync = (enabled = true) => {
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isScrollSyncEnabled = useRef(true);
  const isSyncing = useRef(false);

  // Disable scroll sync temporarily
  const disableSync = useCallback(() => {
    isScrollSyncEnabled.current = false;
    setTimeout(() => {
      isScrollSyncEnabled.current = true;
    }, 100);
  }, []);

  // Handle editor scroll
  const handleEditorScroll = useCallback(() => {
    if (!enabled || !isScrollSyncEnabled.current || !editorRef.current || !previewRef.current || isSyncing.current) {
      return;
    }

    isSyncing.current = true;
    
    const editor = editorRef.current;
    const preview = previewRef.current;

    try {
      // Calculate scroll percentage
      const scrollTop = editor.scrollTop;
      const scrollHeight = editor.scrollHeight - editor.clientHeight;
      const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      // Apply to preview
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
      const newPreviewScrollTop = scrollPercentage * previewScrollHeight;
      
      preview.scrollTop = newPreviewScrollTop;
    } catch (error) {
      console.warn('Error during editor scroll sync:', error);
    } finally {
      setTimeout(() => {
        isSyncing.current = false;
      }, 50);
    }
  }, [enabled]);

  // Handle preview scroll
  const handlePreviewScroll = useCallback(() => {
    if (!enabled || !isScrollSyncEnabled.current || !editorRef.current || !previewRef.current || isSyncing.current) {
      return;
    }

    isSyncing.current = true;

    const editor = editorRef.current;
    const preview = previewRef.current;

    try {
      // Calculate scroll percentage
      const scrollTop = preview.scrollTop;
      const scrollHeight = preview.scrollHeight - preview.clientHeight;
      const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      // Apply to editor
      const editorScrollHeight = editor.scrollHeight - editor.clientHeight;
      const newEditorScrollTop = scrollPercentage * editorScrollHeight;
      
      editor.scrollTop = newEditorScrollTop;
    } catch (error) {
      console.warn('Error during preview scroll sync:', error);
    } finally {
      setTimeout(() => {
        isSyncing.current = false;
      }, 50);
    }
  }, [enabled]);

  // Advanced line-based scroll sync for Monaco editor
  const handleMonacoScroll = useCallback((editor) => {
    if (!enabled || !isScrollSyncEnabled.current || !previewRef.current || isSyncing.current) {
      return;
    }

    isSyncing.current = true;

    try {
      const preview = previewRef.current;
      
      // Get visible range from Monaco
      const visibleRange = editor.getVisibleRanges();
      if (visibleRange.length === 0) return;

      const topLine = visibleRange[0].startLineNumber;
      const totalLines = editor.getModel()?.getLineCount() || 1;
      const scrollPercentage = (topLine - 1) / Math.max(totalLines - 1, 1);

      // Apply to preview
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
      const newPreviewScrollTop = scrollPercentage * previewScrollHeight;
      
      preview.scrollTop = newPreviewScrollTop;
    } catch (error) {
      console.warn('Error during Monaco scroll sync:', error);
    } finally {
      setTimeout(() => {
        isSyncing.current = false;
      }, 50);
    }
  }, [enabled]);

  // Sync scroll to a specific line (useful for goto line functionality)
  const syncToLine = useCallback((lineNumber, totalLines) => {
    if (!enabled || !previewRef.current) return;

    const preview = previewRef.current;
    const scrollPercentage = Math.min((lineNumber - 1) / Math.max(totalLines - 1, 1), 1);
    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    const newScrollTop = scrollPercentage * previewScrollHeight;
    
    preview.scrollTop = newScrollTop;
  }, [enabled]);

  // Return refs and handlers
  return {
    editorRef,
    previewRef,
    handleEditorScroll,
    handlePreviewScroll,
    handleMonacoScroll,
    syncToLine,
    disableSync,
    isEnabled: enabled && isScrollSyncEnabled.current
  };
}; 