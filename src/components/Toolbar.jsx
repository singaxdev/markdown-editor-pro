import React, { useState } from 'react';
import {
  FileText,
  FolderOpen,
  Save,
  Download,
  Eye,
  EyeOff,
  PanelLeftClose,
  PanelLeftOpen,
  Bold,
  Italic,
  List,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Strikethrough,
  CheckSquare,
  Table,
  Hash,
  Folder,
  Clock,
  Columns,
  Settings,
  Zap,
  ChevronDown,
} from 'lucide-react';

const ToolbarButton = ({ icon: Icon, onClick, title, isActive = false, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-editor-accent text-white hover:bg-blue-600';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700';
      case 'warning':
        return 'bg-yellow-600 text-white hover:bg-yellow-700';
      default:
        return isActive
          ? 'bg-editor-accent text-white shadow-md'
          : 'text-editor-text hover:bg-gray-700 hover:text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${getVariantStyles()}`}
    >
      <Icon size={16} />
    </button>
  );
};

const ToolbarSeparator = () => (
  <div className="w-px h-6 bg-gray-600 mx-2"></div>
);

const Toolbar = ({
  onNewFile,
  onOpenFile,
  onOpenFolder,
  onSaveFile,
  onSaveAsFile,
  onExportPDF,
  onToggleSidebar,
  onTogglePreview,
  onToggleSplitView,
  onShowRecentFiles,
  onInsertMarkdown,
  onOpenSettings,
  onAIGenerate,
  onInsertImage,
  onInsertTable,
  isPreviewMode,
  isSidebarOpen,
  isSplitView,
  isLoading,
  aiConfigured = false,
}) => {
  const [showAIMenu, setShowAIMenu] = useState(false);

  const insertMarkdown = (markdown) => {
    onInsertMarkdown(markdown);
  };

  const aiActions = [
    { id: 'blog-post', label: 'Blog Post', icon: '📝' },
    { id: 'documentation', label: 'Documentation', icon: '📚' },
    { id: 'tutorial', label: 'Tutorial', icon: '🎓' },
    { id: 'readme', label: 'README', icon: '📋' },
    { id: 'improve', label: 'Improve Content', icon: '✨' },
    { id: 'summarize', label: 'Summarize', icon: '📄' },
    { id: 'outline', label: 'Create Outline', icon: '🗂️' },
    { id: 'table', label: 'Generate Table', icon: '📊' },
  ];

  return (
    <div className="h-12 bg-editor-toolbar border-b border-editor flex items-center px-4 gap-1 overflow-x-auto">
      {/* File Operations */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={FileText}
          onClick={onNewFile}
          title="New File (Ctrl+N)"
          variant="primary"
        />
        <ToolbarButton
          icon={FolderOpen}
          onClick={onOpenFile}
          title="Open File (Ctrl+O)"
        />
        <ToolbarButton
          icon={Folder}
          onClick={onOpenFolder}
          title="Open Folder (Ctrl+Shift+O)"
        />
        {onShowRecentFiles && (
          <ToolbarButton
            icon={Clock}
            onClick={onShowRecentFiles}
            title="Recent Files"
          />
        )}
      </div>

      <ToolbarSeparator />

      {/* Save Operations */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Save}
          onClick={onSaveFile}
          title="Save (Ctrl+S)"
          variant="success"
        />
        <ToolbarButton
          icon={Download}
          onClick={onExportPDF}
          title="Export as PDF (Ctrl+E)"
          variant="warning"
        />
      </div>

      <ToolbarSeparator />

      {/* View Controls */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={isSidebarOpen ? PanelLeftClose : PanelLeftOpen}
          onClick={onToggleSidebar}
          title="Toggle Sidebar (Ctrl+B)"
          isActive={isSidebarOpen}
        />
        <ToolbarButton
          icon={isPreviewMode ? EyeOff : Eye}
          onClick={onTogglePreview}
          title="Toggle Preview (Ctrl+P)"
          isActive={isPreviewMode}
        />
        {onToggleSplitView && (
          <ToolbarButton
            icon={Columns}
            onClick={onToggleSplitView}
            title="Split View (Ctrl+\\)"
            isActive={isSplitView}
          />
        )}

        {/* Settings */}
        <ToolbarButton
          icon={Settings}
          onClick={onOpenSettings}
          title="Settings"
          variant="default"
        />

        {/* AI Generate */}
        {aiConfigured && (
          <div className="relative">
            <ToolbarButton
              icon={Zap}
              onClick={() => setShowAIMenu(!showAIMenu)}
              title="AI Generate"
              variant="primary"
              isActive={showAIMenu}
            />
            {showAIMenu && (
              <div className="absolute top-full left-0 mt-1 bg-editor-sidebar border border-gray-600 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                {aiActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      onAIGenerate(action.id);
                      setShowAIMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-editor-text hover:bg-gray-700 flex items-center gap-3"
                  >
                    <span className="text-base">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ToolbarSeparator />

      {/* Formatting Tools */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Heading1}
          onClick={() => insertMarkdown('\n# Heading 1\n')}
          title="Heading 1"
        />
        <ToolbarButton
          icon={Heading2}
          onClick={() => insertMarkdown('\n## Heading 2\n')}
          title="Heading 2"
        />
        <ToolbarButton
          icon={Bold}
          onClick={() => insertMarkdown('**bold text**')}
          title="Bold"
        />
        <ToolbarButton
          icon={Italic}
          onClick={() => insertMarkdown('*italic text*')}
          title="Italic"
        />
        <ToolbarButton
          icon={Code}
          onClick={() => insertMarkdown('`code`')}
          title="Inline Code"
        />
      </div>

      <ToolbarSeparator />

      {/* Content Tools */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={List}
          onClick={() => insertMarkdown('\n- List item\n- List item\n')}
          title="Bullet List"
        />
        <ToolbarButton
          icon={CheckSquare}
          onClick={() => insertMarkdown('\n- [ ] Task item\n- [x] Completed task\n')}
          title="Task List"
        />
        <ToolbarButton
          icon={Table}
          onClick={onInsertTable || (() => insertMarkdown('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n'))}
          title="Insert Table (Visual Editor)"
        />
        <ToolbarButton
          icon={Link}
          onClick={() => insertMarkdown('[link text](https://example.com)')}
          title="Link"
        />
        <ToolbarButton
          icon={Image}
          onClick={onInsertImage || (() => insertMarkdown('![alt text](image-url)'))}
          title="Insert Image (Drag & Drop or Paste supported)"
        />
        <ToolbarButton
          icon={Quote}
          onClick={() => insertMarkdown('\n> Quote\n')}
          title="Quote"
        />
        <ToolbarButton
          icon={Strikethrough}
          onClick={() => insertMarkdown('~~strikethrough text~~')}
          title="Strikethrough"
        />
        <ToolbarButton
          icon={Hash}
          onClick={() => insertMarkdown('\n```javascript\n// Your code here\nconsole.log("Hello, World!");\n```\n')}
          title="Code Block"
        />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <>
          <ToolbarSeparator />
          <div className="flex items-center space-x-2 text-editor-accent">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-editor-accent"></div>
            <span className="text-xs">Processing...</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Toolbar;