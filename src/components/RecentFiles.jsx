import React from 'react';
import { FileText, Clock, X } from 'lucide-react';

const RecentFiles = ({ recentFiles, onFileSelect, onRemoveRecent, isVisible, onClose }) => {
  if (!isVisible) return null;

  const formatFileTime = (timestamp) => {
    const now = new Date();
    const fileTime = new Date(timestamp);
    const diffInHours = (now - fileTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  const getFileName = (path) => {
    return path.split('/').pop().split('\\').pop();
  };

  const getFilePath = (path) => {
    const segments = path.split(/[/\\]/);
    return segments.slice(0, -1).join('/') || '/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-editor-sidebar border border-gray-600 rounded-lg shadow-2xl w-96 max-h-80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-editor-accent" />
            <h3 className="text-sm font-medium text-editor-text">Recent Files</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-editor-text transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Recent files list */}
        <div className="max-h-64 overflow-y-auto">
          {recentFiles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent files</p>
              <p className="text-xs mt-1">Open some files to see them here</p>
            </div>
          ) : (
            <div className="py-2">
              {recentFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer group"
                  onClick={() => {
                    onFileSelect(file.path);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <FileText size={14} className="text-green-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-editor-text truncate">
                        {getFileName(file.path)}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {getFilePath(file.path)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {formatFileTime(file.timestamp)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecent(file.path);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-600 text-gray-400 hover:text-red-400 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {recentFiles.length > 0 && (
          <div className="p-3 border-t border-gray-700 bg-editor-bg">
            <button
              onClick={() => {
                recentFiles.forEach(file => onRemoveRecent(file.path));
              }}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear all recent files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentFiles;