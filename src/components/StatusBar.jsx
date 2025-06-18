import React from 'react';
import { FileText, Type, Clock, Eye } from 'lucide-react';

const StatusBar = ({ content, currentFile, isPreviewMode }) => {
  // Calculate document stats
  const lines = content.split('\n').length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;

  // Estimate reading time (average 200 words per minute)
  const readingTime = Math.ceil(words / 200);

  // Get file info
  const fileName = currentFile ? currentFile.split('/').pop().split('\\').pop() : null;
  const fileExtension = fileName ? fileName.split('.').pop().toLowerCase() : null;

  return (
    <div className="h-6 bg-editor-toolbar border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400">
      {/* Left side - File info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <FileText size={12} />
          <span>{fileName || 'Untitled'}</span>
          {fileExtension && (
            <span className="px-1 py-0.5 bg-gray-600 rounded text-xs">
              {fileExtension.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Type size={12} />
          <span>Markdown</span>
        </div>

        <div className="flex items-center space-x-1">
          <Eye size={12} />
          <span>{isPreviewMode ? 'Preview' : 'Editor'}</span>
        </div>
      </div>

      {/* Right side - Document stats */}
      <div className="flex items-center space-x-4">
        <span>Lines: {lines.toLocaleString()}</span>
        <span>Words: {words.toLocaleString()}</span>
        <span>Characters: {characters.toLocaleString()}</span>
        <span>No Spaces: {charactersNoSpaces.toLocaleString()}</span>
        <div className="flex items-center space-x-1">
          <Clock size={12} />
          <span>{readingTime} min read</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;