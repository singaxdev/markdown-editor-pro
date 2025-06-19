import React, { useState, useEffect } from 'react';

// Components
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import StatusBar from './components/StatusBar';
import Breadcrumb from './components/Breadcrumb';
import RecentFiles from './components/RecentFiles';
import LoadingSpinner, { Toast } from './components/LoadingSpinner';
import SplitView from './components/SplitView';
import SettingsPanel from './components/SettingsPanel';
import TabBar from './components/TabBar';
import TableEditor from './components/TableEditor';

// Hooks
import { useMarkdownEditor } from './hooks/useMarkdownEditor';
import { useUI } from './hooks/useUI';
import { useRecentFiles } from './hooks/useRecentFiles';
import { useFileOperations } from './hooks/useFileOperations';
import { usePDFExport } from './hooks/usePDFExport';
import { useMenuHandlers } from './hooks/useMenuHandlers';
import { useTheme } from './hooks/useTheme';
import { useImageManager } from './hooks/useImageManager';
import { useMultiTab } from './hooks/useMultiTab';
import { useScrollSync } from './hooks/useScrollSync';

// Styles
import './index.css';
import 'highlight.js/styles/atom-one-dark.css';

function App() {
  // Settings state with defaults
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    fontWeight: 400,
    lineHeight: 1.6,
    splitRatio: 50,
    imageMaxWidth: 800,
    imageQuality: 90,
    aiApiKey: '',
    aiProvider: 'openai',
    autoSave: true,
    wordWrap: true,
    lineNumbers: true,
    minimap: false,
    bracketPairs: true,
    autoIndent: true,
    folding: true,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Theme management
  const { currentTheme, theme, isDarkMode, isLoading: themeLoading, setTheme } = useTheme();
  
  // Image management
  const imageManager = useImageManager(settings);

  // Multi-tab management
  const {
    tabs,
    activeTabId,
    activeTab,
    createTab,
    openInTab,
    updateTabContent,
    markTabSaved,
    closeTab,
    switchToTab,
    hasDirtyTabs
  } = useMultiTab();

  // Scroll sync
  const scrollSync = useScrollSync(settings.scrollSync !== false);

  // Core editor functionality (modified for multi-tab support)
  const {
    content: baseContent,
    setContent: setBaseContent,
    currentFile: baseCurrentFile,
    setCurrentFile: setBaseCurrentFile,
    isDirty: baseIsDirty,
    setIsDirty: setBaseIsDirty,
    htmlContent,
    handleContentChange: baseHandleContentChange,
    getFileName
  } = useMarkdownEditor();

  // Use tab data if available, otherwise fall back to base editor
  const content = activeTab ? activeTab.content : (baseContent || '# Welcome to Markdown Editor Pro\n\nStart writing your markdown here...');
  const currentFile = activeTab ? activeTab.file : baseCurrentFile;
  const isDirty = activeTab ? activeTab.isDirty : baseIsDirty;

  // Functions to update the correct state (tab or base)
  const setCurrentFile = (file) => {
    if (activeTab) {
      // For now, just update the base state - we'll improve tab file management later
      setBaseCurrentFile(file);
    } else {
      setBaseCurrentFile(file);
    }
  };

  const setIsDirty = (dirty) => {
    if (activeTab) {
      // Tab dirty state is handled by updateTabContent
    } else {
      setBaseIsDirty(dirty);
    }
  };

  const setContent = (newContent) => {
    if (activeTab) {
      updateTabContent(activeTab.id, newContent);
    } else {
      setBaseContent(newContent);
    }
  };

  const handleContentChange = (newContent) => {
    if (activeTab) {
      updateTabContent(activeTab.id, newContent);
    }
    baseHandleContentChange(newContent);
  };

  // UI state management
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isPreviewMode,
    isSplitView,
    showRecentFiles,
    setShowRecentFiles,
    isLoading,
    loadingType,
    loadingMessage,
    toast,
    showToast,
    hideToast,
    showLoading,
    hideLoading,
    handleTogglePreview,
    handleToggleSplitView
  } = useUI();

  // Recent files management
  const {
    recentFiles,
    addToRecentFiles,
    removeFromRecentFiles
  } = useRecentFiles();

  // File operations
  const {
    currentDirectory,
    files,
    handleNewFile,
    handleOpenFile,
    handleSaveFile,
    handleOpenFolder,
    handleFileSelect,
    loadDirectory
  } = useFileOperations({
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
  });

  // PDF export functionality
  const { handleExportPDF } = usePDFExport({
    currentFile,
    htmlContent,
    showLoading,
    hideLoading,
    showToast
  });

  // Load preferences on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('markdown-editor-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ 
          ...prev, 
          ...parsed,
          // Don't override theme here - let useTheme handle it
          theme: prev.theme 
        }));
      }
    } catch (error) {
      console.log('Could not load settings:', error);
    }
  }, []);

  // Sync currentTheme from useTheme hook back to settings
  useEffect(() => {
    if (currentTheme !== settings.theme && !themeLoading) {
      setSettings(prev => ({ ...prev, theme: currentTheme }));
    }
  }, [currentTheme, settings.theme, themeLoading]);

  // Save settings when they change (except theme which is handled by useTheme)
  useEffect(() => {
    try {
      localStorage.setItem('markdown-editor-settings', JSON.stringify(settings));
      
      // Apply image settings to CSS variables
      document.documentElement.style.setProperty('--image-max-width', `${settings.imageMaxWidth}px`);
    } catch (error) {
      console.log('Could not save settings:', error);
    }
  }, [settings]);

  // Settings handlers
  const handleUpdateSettings = (newSettings) => {
    // Handle theme change through useTheme hook
    if (newSettings.theme !== settings.theme) {
      setTheme(newSettings.theme);
    }
    setSettings(newSettings);
  };

  const handleResetSettings = (defaultSettings) => {
    // Handle theme reset through useTheme hook
    if (defaultSettings.theme !== settings.theme) {
      setTheme(defaultSettings.theme);
    }
    setSettings(defaultSettings);
  };

  // Theme toggle handler (for backward compatibility)
  const handleToggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Create image insert callback for the editor
  const handleImageInsert = (markdown) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + '\n' + markdown + '\n' + content.substring(end);
      setContent(newContent);
      handleContentChange(newContent);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + markdown.length + 2;
        textarea.focus();
      }, 0);
    }
  };

  // Save As functionality
  const handleSaveAsFile = async () => {
    try {
      showLoading('save', 'Saving file as...');

      if (window.electronAPI) {
        const result = await window.electronAPI.showSaveDialog({
          filters: [
            { name: 'Markdown', extensions: ['md'] },
            { name: 'Text', extensions: ['txt'] }
          ]
        });

        if (!result.canceled) {
          const writeResult = await window.electronAPI.writeFile(result.filePath, content);

          if (writeResult.success) {
            setCurrentFile(result.filePath);
            setIsDirty(false);
            addToRecentFiles(result.filePath);
            showToast(`Saved as ${result.filePath.split('/').pop().split('\\').pop()}`, 'success');
          } else {
            await window.electronAPI.showErrorDialog('Error', `Could not save file: ${writeResult.error}`);
            showToast('Failed to save file', 'error');
          }
        }
      } else {
        await handleSaveFile();
      }
    } catch (error) {
      console.error('Error saving file:', error);
      showToast('Error saving file', 'error');
    } finally {
      hideLoading();
    }
  };

  // Menu handlers integration
  useMenuHandlers({
    handleNewFile,
    handleOpenFile,
    handleOpenFolder,
    handleSaveFile,
    handleSaveAsFile,
    handleExportPDF,
    handleTogglePreview,
    setIsSidebarOpen
  });

  // Markdown insertion handler
  const handleInsertMarkdown = (markdown) => {
    setContent(content + markdown);
    handleContentChange(content + markdown);
  };

  // Table editor handlers
  const handleInsertTable = () => {
    setEditingTable(null);
    setShowTableEditor(true);
  };

  const handleTableSave = (tableMarkdown) => {
    handleInsertMarkdown('\n' + tableMarkdown + '\n');
    setShowTableEditor(false);
    setEditingTable(null);
  };

  const handleTableCancel = () => {
    setShowTableEditor(false);
    setEditingTable(null);
  };

  // Multi-tab handlers
  const handleNewTab = () => {
    createTab();
  };

  // Don't initialize tabs automatically for now - let user create them
  // useEffect(() => {
  //   if (tabs.length === 0) {
  //     createTab(null, '# Welcome to Markdown Editor Pro\n\nStart writing your markdown here...', false);
  //   }
  // }, []);

  const handleTabClose = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && tab.isDirty) {
      // TODO: Add confirmation dialog for unsaved changes
      if (confirm(`"${tab.title}" has unsaved changes. Do you want to close it anyway?`)) {
        closeTab(tabId);
      }
    } else {
      closeTab(tabId);
    }
  };

  const handleTabSwitch = (tabId) => {
    switchToTab(tabId);
  };

  // Show loading screen while theme is loading
  if (themeLoading) {
    return (
      <div className="h-screen bg-editor-bg text-editor-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-editor-accent mx-auto mb-4"></div>
          <div className="text-editor-text">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-editor-bg text-editor-text flex flex-col fade-in">
      {/* Menu Bar - Platform-aware dragging */}
      <div className="h-8 bg-editor-toolbar border-b border-gray-700 flex items-center justify-between px-4 text-sm relative drag-region">
        {/* Left side - extra space on macOS for native controls */}
        <div className={`${window.electronAPI?.platform === 'darwin' ? 'w-20' : 'flex-1'}`}></div>

        {/* Center - filename */}
        <div className="flex-shrink-0 px-4">
          <span className="text-editor-text font-medium select-none pointer-events-none">
            {getFileName()} {isDirty && '•'}
          </span>
        </div>

        {/* Right side - window controls (only on Windows/Linux) */}
        <div className="flex-1 flex justify-end">
          {window.electronAPI?.platform !== 'darwin' && (
            <div className="flex items-center space-x-1 no-drag">
              <button
                onClick={() => window.electronAPI && window.electronAPI.minimizeWindow && window.electronAPI.minimizeWindow()}
                className="w-5 h-5 rounded hover:bg-gray-600 flex items-center justify-center text-xs text-gray-300 transition-colors"
                title="Minimize"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M0 5h10v1H0z"/>
                </svg>
              </button>
              <button
                onClick={() => window.electronAPI && window.electronAPI.maximizeWindow && window.electronAPI.maximizeWindow()}
                className="w-5 h-5 rounded hover:bg-gray-600 flex items-center justify-center text-xs text-gray-300 transition-colors"
                title="Maximize"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z"/>
                </svg>
              </button>
              <button
                onClick={() => window.electronAPI && window.electronAPI.closeWindow && window.electronAPI.closeWindow()}
                className="w-5 h-5 rounded hover:bg-red-600 hover:text-white flex items-center justify-center text-xs text-gray-300 transition-colors"
                title="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <path d="M1.5 1.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb currentFile={currentFile} currentDirectory={currentDirectory} />

      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabSwitch}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />

      {/* Toolbar */}
      <Toolbar
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFolder}
        onSaveFile={handleSaveFile}
        onSaveAsFile={handleSaveAsFile}
        onExportPDF={handleExportPDF}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onTogglePreview={handleTogglePreview}
        onToggleSplitView={handleToggleSplitView}
        onOpenSettings={() => setShowSettings(true)}
        onShowRecentFiles={() => setShowRecentFiles(true)}
        onInsertImage={() => imageManager.handleFileSelect(handleImageInsert, currentFile)}
        onInsertTable={handleInsertTable}
        isPreviewMode={isPreviewMode}
        isSidebarOpen={isSidebarOpen}
        isSplitView={isSplitView}
        isLoading={isLoading}
        onInsertMarkdown={handleInsertMarkdown}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden layout-transition">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="animate-slide-in-right">
            <Sidebar
              files={files}
              currentDirectory={currentDirectory}
              onFileSelect={handleFileSelect}
              onDirectoryLoad={loadDirectory}
            />
          </div>
        )}

        {/* Editor/Preview Area */}
        {isSplitView ? (
          <SplitView
            content={content}
            onChange={handleContentChange}
            htmlContent={htmlContent}
            markdownContent={content}
            isSplitView={isSplitView}
            settings={settings}
            imageManager={imageManager}
            currentFile={currentFile}
            onImageInsert={handleImageInsert}
            scrollSync={scrollSync}
          />
        ) : (
          <div className="flex-1 flex">
            {!isPreviewMode && (
              <Editor
                content={content}
                onChange={handleContentChange}
                settings={settings}
                currentTheme={currentTheme}
                imageManager={imageManager}
                currentFile={currentFile}
                onImageInsert={handleImageInsert}
              />
            )}

            {isPreviewMode && (
              <Preview
                htmlContent={htmlContent}
                markdownContent={content}
              />
            )}

            {/* Hidden preview for PDF export - always rendered but invisible */}
            {!isPreviewMode && (
              <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <Preview
                  htmlContent={htmlContent}
                  markdownContent={content}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        content={content}
        currentFile={currentFile}
        isPreviewMode={isPreviewMode || isSplitView}
      />

      {/* Enhanced UI Overlays */}
      <LoadingSpinner
        type={loadingType}
        message={loadingMessage}
        isVisible={isLoading}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <RecentFiles
        recentFiles={recentFiles}
        onFileSelect={handleFileSelect}
        onRemoveRecent={removeFromRecentFiles}
        isVisible={showRecentFiles}
        onClose={() => setShowRecentFiles(false)}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
      />

      {/* Table Editor Modal */}
      {showTableEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <TableEditor
              tableMarkdown={editingTable}
              onSave={handleTableSave}
              onCancel={handleTableCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;