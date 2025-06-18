import React, { useState } from 'react';
import { Folder, FileText, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';

const FileItem = ({ file, onSelect, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (file.isDirectory) {
      setIsExpanded(!isExpanded);
      // In a real implementation, you'd load subdirectory contents here
    } else {
      // Only allow opening of markdown/text files
      const fileName = file.name.toLowerCase();
      const isMarkdownFile = fileName.endsWith('.md') ||
        fileName.endsWith('.markdown') ||
        fileName.endsWith('.txt') ||
        fileName.endsWith('.mdown') ||
        fileName.endsWith('.mkd') ||
        fileName.endsWith('.mdx');

      if (isMarkdownFile) {
        onSelect(file.path);
      }
    }
  };

  const isMarkdown = file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.markdown');
  const isText = file.name.toLowerCase().endsWith('.txt');
  const isOtherMarkdown = file.name.toLowerCase().endsWith('.mdown') ||
    file.name.toLowerCase().endsWith('.mkd') ||
    file.name.toLowerCase().endsWith('.mdx');

  // Don't render non-markdown files (they should be filtered out, but double-check)
  if (!file.isDirectory && !isMarkdown && !isText && !isOtherMarkdown) {
    return null;
  }

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer text-sm transition-colors ${
          !file.isDirectory && !isMarkdown && !isText && !isOtherMarkdown ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
      >
        {file.isDirectory ? (
          <>
            {isExpanded ? (
              <ChevronDown size={14} className="mr-1 text-gray-400" />
            ) : (
              <ChevronRight size={14} className="mr-1 text-gray-400" />
            )}
            {isExpanded ? (
              <FolderOpen size={14} className="mr-2 text-blue-400" />
            ) : (
              <Folder size={14} className="mr-2 text-blue-400" />
            )}
          </>
        ) : (
          <FileText
            size={14}
            className={`mr-2 ml-4 ${
              isMarkdown ? 'text-green-400' :
                isText ? 'text-yellow-400' :
                  isOtherMarkdown ? 'text-green-300' :
                    'text-gray-400'
            }`}
          />
        )}
        <span className="truncate text-editor-text">{file.name}</span>
        {/* Add file type badge for clarity */}
        {!file.isDirectory && (
          <span className="ml-auto text-xs text-gray-500">
            {file.name.split('.').pop().toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ files, currentDirectory, onFileSelect, onDirectoryLoad }) => {
  const handleOpenDirectory = async () => {
    try {
      // Use Electron API instead of Tauri
      const result = await window.electronAPI.showOpenDialog({
        properties: ['openDirectory']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        onDirectoryLoad(result.filePaths[0]);
      }
    } catch (error) {
      console.error('Error opening directory:', error);
      await window.electronAPI.showErrorDialog('Error', 'Could not open directory');
    }
  };

  return (
    <div className="w-64 bg-editor-sidebar border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-editor-text">Explorer</h3>
          <button
            onClick={handleOpenDirectory}
            className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-editor-text"
            title="Open Folder"
          >
            <FolderOpen size={14} />
          </button>
        </div>
        {currentDirectory && (
          <div className="text-xs text-gray-400 truncate" title={currentDirectory}>
            {currentDirectory.split('/').pop() || currentDirectory.split('\\').pop() || currentDirectory}
          </div>
        )}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!currentDirectory ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <FolderOpen size={24} className="mx-auto mb-2 opacity-50" />
            <p>No folder open</p>
            <p className="text-xs mt-1">Click the folder icon to open a directory</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            <FileText size={24} className="mx-auto mb-2 opacity-50" />
            <p>Empty folder</p>
          </div>
        ) : (
          <div className="py-2">
            {files.map((file, index) => (
              <FileItem
                key={`${file.path}-${index}`}
                file={file}
                onSelect={onFileSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 text-xs text-gray-500 flex-shrink-0">
        {files.length > 0 && `${files.length} items`}
      </div>
    </div>
  );
};

export default Sidebar;