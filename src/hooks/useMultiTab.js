import { useState, useCallback, useRef } from 'react';

export const useMultiTab = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const nextTabIdRef = useRef(1);

  // Get the currently active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Create a new tab
  const createTab = useCallback((file = null, content = '', isDirty = false) => {
    const newTab = {
      id: nextTabIdRef.current++,
      file,
      content,
      isDirty,
      title: file ? file.name : 'Untitled',
      path: file ? file.path : null,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  }, []);

  // Open a file in a new tab or switch to existing tab
  const openInTab = useCallback((file, content) => {
    // Check if file is already open
    const existingTab = tabs.find(tab => tab.path === file.path);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return existingTab;
    }

    // Create new tab for the file
    return createTab(file, content, false);
  }, [tabs, createTab]);

  // Update tab content
  const updateTabContent = useCallback((tabId, content) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isDirty: true }
        : tab
    ));
  }, []);

  // Mark tab as saved
  const markTabSaved = useCallback((tabId, newFile = null) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { 
            ...tab, 
            isDirty: false,
            file: newFile || tab.file,
            title: newFile ? newFile.name : tab.title,
            path: newFile ? newFile.path : tab.path
          }
        : tab
    ));
  }, []);

  // Close a tab
  const closeTab = useCallback((tabId) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If we're closing the active tab, switch to another
      if (tabId === activeTabId) {
        if (newTabs.length > 0) {
          // Find the tab that was to the right, or the rightmost tab
          const closedTabIndex = prev.findIndex(tab => tab.id === tabId);
          const nextTab = newTabs[closedTabIndex] || newTabs[newTabs.length - 1];
          setActiveTabId(nextTab.id);
        } else {
          setActiveTabId(null);
        }
      }
      
      return newTabs;
    });
  }, [activeTabId]);

  // Switch to a tab
  const switchToTab = useCallback((tabId) => {
    setActiveTabId(tabId);
  }, []);

  // Get tab by ID
  const getTab = useCallback((tabId) => {
    return tabs.find(tab => tab.id === tabId);
  }, [tabs]);

  // Close all tabs
  const closeAllTabs = useCallback(() => {
    setTabs([]);
    setActiveTabId(null);
  }, []);

  // Close all tabs except one
  const closeOtherTabs = useCallback((keepTabId) => {
    setTabs(prev => prev.filter(tab => tab.id === keepTabId));
    setActiveTabId(keepTabId);
  }, []);

  // Check if there are any dirty tabs
  const hasDirtyTabs = tabs.some(tab => tab.isDirty);

  // Get dirty tabs
  const dirtyTabs = tabs.filter(tab => tab.isDirty);

  return {
    tabs,
    activeTabId,
    activeTab,
    createTab,
    openInTab,
    updateTabContent,
    markTabSaved,
    closeTab,
    switchToTab,
    getTab,
    closeAllTabs,
    closeOtherTabs,
    hasDirtyTabs,
    dirtyTabs,
  };
}; 