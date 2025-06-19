import React from 'react';
import { X, Plus, File } from 'lucide-react';

const TabBar = ({ 
  tabs, 
  activeTabId, 
  onTabClick, 
  onTabClose, 
  onNewTab,
  maxTabWidth = 200,
  minTabWidth = 120 
}) => {
  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    onTabClick(tabId);
  };

  const handleCloseClick = (e, tabId) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  const handleNewTabClick = () => {
    onNewTab();
  };

  // Calculate tab width based on number of tabs
  const calculateTabWidth = () => {
    if (tabs.length === 0) return maxTabWidth;
    
    const containerWidth = window.innerWidth - 200; // Account for sidebar
    const availableWidth = containerWidth - 40; // Account for new tab button
    const calculatedWidth = Math.floor(availableWidth / tabs.length);
    
    return Math.min(maxTabWidth, Math.max(minTabWidth, calculatedWidth));
  };

  const tabWidth = calculateTabWidth();

  if (tabs.length === 0) {
    return (
      <div className="flex items-center bg-editor-toolbar border-b border-gray-700">
        <div className="flex-1 h-10"></div>
        <button
          onClick={handleNewTabClick}
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          title="New Tab"
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center bg-editor-toolbar border-b border-gray-700">
      <div className="flex-1 flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const isDirty = tab.isDirty;
          
          return (
            <div
              key={tab.id}
              className={`
                relative flex items-center cursor-pointer border-r border-gray-700 transition-colors
                ${isActive 
                  ? 'bg-editor-bg text-white' 
                  : 'bg-editor-toolbar text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
              style={{ 
                width: `${tabWidth}px`,
                minWidth: `${minTabWidth}px`,
                maxWidth: `${maxTabWidth}px`
              }}
              onClick={(e) => handleTabClick(e, tab.id)}
              title={tab.path || tab.title}
            >
              <div className="flex items-center px-3 py-2 w-full">
                {/* File icon */}
                <File size={14} className="flex-shrink-0 mr-2 text-gray-400" />
                
                {/* Tab title */}
                <span className="flex-1 truncate text-sm">
                  {tab.title}
                  {isDirty && (
                    <span className="ml-1 text-editor-accent">•</span>
                  )}
                </span>
                
                {/* Close button */}
                <button
                  onClick={(e) => handleCloseClick(e, tab.id)}
                  className="flex-shrink-0 ml-2 p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                  title="Close"
                >
                  <X size={12} />
                </button>
              </div>
              
              {/* Active tab indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-editor-accent"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* New tab button */}
      <button
        onClick={handleNewTabClick}
        className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border-l border-gray-700"
        title="New Tab"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default TabBar; 