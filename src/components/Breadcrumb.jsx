import React from 'react';
import { ChevronRight, Home, Folder } from 'lucide-react';

const Breadcrumb = ({ currentFile, currentDirectory }) => {
  if (!currentFile && !currentDirectory) return null;

  const getPathSegments = () => {
    const path = currentFile || currentDirectory;
    if (!path) return [];

    // Split by both forward and backward slashes for cross-platform support
    const segments = path.split(/[/\\]/);
    return segments.filter(segment => segment.length > 0);
  };

  const segments = getPathSegments();

  return (
    <div className="h-8 bg-editor-bg border-b border-gray-700 flex items-center px-4 text-xs text-gray-400">
      <div className="flex items-center space-x-1 overflow-hidden">
        <Home size={12} className="flex-shrink-0" />

        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <ChevronRight size={10} className="flex-shrink-0 mx-1" />

            <div className="flex items-center space-x-1 min-w-0">
              {index < segments.length - 1 ? (
                <Folder size={12} className="flex-shrink-0" />
              ) : (
                <div className="w-2 h-2 bg-editor-accent rounded-full flex-shrink-0" />
              )}

              <span
                className={`truncate ${index === segments.length - 1 ? 'text-editor-text font-medium' : ''}`}
                title={segment}
              >
                {segment}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;