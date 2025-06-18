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

// Hooks
import { useMarkdownEditor } from './hooks/useMarkdownEditor';
import { useUI } from './hooks/useUI';
import { useRecentFiles } from './hooks/useRecentFiles';
import { useFileOperations } from './hooks/useFileOperations';
import { usePDFExport } from './hooks/usePDFExport';
import { useMenuHandlers } from './hooks/useMenuHandlers';

// Styles
import './index.css';
import 'highlight.js/styles/vs2015.css';

function App() {
  // Settings state with defaults
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    aiApiKey: '',
    aiProvider: 'openai',
    autoSave: true,
    wordWrap: true,
    lineNumbers: true,
    minimap: false,
  });

  const [showSettings, setShowSettings] = useState(false);

  // Core editor functionality
  const {
    content,
    setContent,
    currentFile,
    setCurrentFile,
    isDirty,
    setIsDirty,
    htmlContent,
    handleContentChange,
    getFileName
  } = useMarkdownEditor();

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
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.log('Could not load settings:', error);
    }
  }, []);

  // Save theme preference and apply theme classes when it changes
  useEffect(() => {
    try {
      localStorage.setItem('markdown-editor-settings', JSON.stringify(settings));
    } catch (error) {
      console.log('Could not save settings:', error);
    }

    // Update document class for global theme styling
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Settings handlers
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const handleResetSettings = (defaultSettings) => {
    setSettings(defaultSettings);
  };

  // Theme toggle handler (for backward compatibility)
  const handleToggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
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
    setIsDirty(true);
  };

  return (
    <div className="h-screen bg-editor-bg text-editor-text flex flex-col animate-fade-in">
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
            isSplitView={isSplitView}
            isDarkMode={settings.theme === 'dark'}
            fontSize={settings.fontSize}
            fontFamily={settings.fontFamily}
            lineNumbers={settings.lineNumbers}
            wordWrap={settings.wordWrap}
            minimap={settings.minimap}
          />
        ) : (
          <div className="flex-1 flex">
            {!isPreviewMode && (
              <Editor
                content={content}
                onChange={handleContentChange}
                isDarkMode={settings.theme === 'dark'}
                fontSize={settings.fontSize}
                fontFamily={settings.fontFamily}
                lineNumbers={settings.lineNumbers}
                wordWrap={settings.wordWrap}
                minimap={settings.minimap}
              />
            )}

            {isPreviewMode && (
              <Preview
                htmlContent={htmlContent}
              />
            )}

            {/* Hidden preview for PDF export - always rendered but invisible */}
            {!isPreviewMode && (
              <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <Preview
                  htmlContent={htmlContent}
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
    </div>
  );
}

export default App;