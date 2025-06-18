import React from 'react';
import { FileText, Download, FolderOpen, Save } from 'lucide-react';

const LoadingSpinner = ({ type = 'default', message, isVisible = true }) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'file':
        return <FileText className="text-editor-accent" />;
      case 'save':
        return <Save className="text-green-400" />;
      case 'export':
        return <Download className="text-blue-400" />;
      case 'folder':
        return <FolderOpen className="text-yellow-400" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    if (message) return message;

    switch (type) {
      case 'file':
        return 'Loading file...';
      case 'save':
        return 'Saving file...';
      case 'export':
        return 'Exporting PDF...';
      case 'folder':
        return 'Reading directory...';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-editor-sidebar border border-gray-600 rounded-lg p-6 flex flex-col items-center space-y-4 min-w-64">
        {/* Spinner and Icon */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-editor-accent"></div>
          {getIcon() && (
            <div className="absolute inset-0 flex items-center justify-center">
              {getIcon()}
            </div>
          )}
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-editor-text font-medium">{getMessage()}</p>
          <div className="flex space-x-1 mt-2 justify-center">
            <div className="w-2 h-2 bg-editor-accent rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-editor-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-editor-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast notification component
export const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500';
      case 'error':
        return 'bg-red-600 border-red-500';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500';
      default:
        return 'bg-editor-accent border-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${getTypeStyles()} border rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex items-center justify-between">
          <p className="text-white text-sm">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;