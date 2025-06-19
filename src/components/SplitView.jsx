import React, { useState, useRef, useEffect } from 'react';
import Preview from './Preview';

const SplitView = ({ 
  content, 
  onChange, 
  htmlContent, 
  markdownContent = '',
  isSplitView, 
  settings = {},
  imageManager = null,
  currentFile = null,
  onImageInsert = null,
  scrollSync = null 
}) => {
  const [splitRatio, setSplitRatio] = useState(settings.splitRatio || 50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  
  // Use scroll sync refs if provided, otherwise create local ones
  const editorRef = scrollSync?.editorRef || useRef(null);
  const previewRef = scrollSync?.previewRef || useRef(null);
  const isScrollSyncEnabled = useRef(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;

      setSplitRatio(Math.min(80, Math.max(20, newRatio)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // Synchronized scrolling - use provided scroll sync or fallback to local implementation
  const handleEditorScroll = scrollSync?.handleEditorScroll || (() => {
    if (!isScrollSyncEnabled.current || !editorRef.current || !previewRef.current) return;

    const editor = editorRef.current;
    const preview = previewRef.current;

    // Calculate scroll percentage
    const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);

    // Apply to preview
    isScrollSyncEnabled.current = false;
    preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);

    // Re-enable sync after a short delay
    setTimeout(() => {
      isScrollSyncEnabled.current = true;
    }, 100);
  });

  const handlePreviewScroll = scrollSync?.handlePreviewScroll || (() => {
    if (!isScrollSyncEnabled.current || !editorRef.current || !previewRef.current) return;

    const editor = editorRef.current;
    const preview = previewRef.current;

    // Calculate scroll percentage
    const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);

    // Apply to editor
    isScrollSyncEnabled.current = false;
    editor.scrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight);

    // Re-enable sync after a short delay
    setTimeout(() => {
      isScrollSyncEnabled.current = true;
    }, 100);
  });

  const handleKeyDown = (e) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newValue);

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Handle image paste
  const handlePaste = async (e) => {
    if (imageManager && onImageInsert) {
      const handled = await imageManager.handlePaste(e, onImageInsert, currentFile);
      if (handled) {
        return; // Image was pasted, don't process as text
      }
    }
  };

  // Calculate line number width to prevent overlap
  const lineCount = content.split('\n').length;
  const lineNumberWidth = Math.max(lineCount.toString().length * 8 + 16, 40);

  // Apply drag and drop handlers if image manager is available
  const dragHandlers = imageManager ? imageManager.getDragHandlers(onImageInsert, currentFile) : {};

  return (
    <div ref={containerRef} className="flex-1 flex h-full">
      {/* Editor Panel */}
      <div
        className={`relative overflow-hidden bg-editor-bg flex flex-col ${
          imageManager?.dragOver ? 'image-drop-zone drag-over' : ''
        }`}
        style={{ width: `${splitRatio}%` }}
        {...dragHandlers}
      >
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleEditorScroll}
            onPaste={handlePaste}
            className="w-full h-full bg-editor-bg text-editor-text border-0 outline-none resize-none font-mono text-sm leading-relaxed"
            style={{
              fontFamily: `${settings.fontFamily || 'JetBrains Mono'}, Monaco, Cascadia Code, Roboto Mono, monospace`,
              fontSize: `${settings.fontSize || 14}px`,
              fontWeight: settings.fontWeight || 400,
              lineHeight: settings.lineHeight || 1.6,
              tabSize: 2,
              minHeight: '100%',
              paddingLeft: `${lineNumberWidth}px`,
              paddingTop: '16px',
              paddingRight: '16px',
              paddingBottom: '16px'
            }}
            placeholder="Start typing your markdown here... (You can paste images directly!)"
            spellCheck={false}
          />

          {/* Line numbers overlay - properly positioned */}
          <div
            className="absolute left-0 top-0 py-4 pointer-events-none text-gray-500 font-mono text-sm leading-relaxed select-none border-r border-gray-700 bg-editor-sidebar"
            style={{
              width: `${lineNumberWidth}px`,
              paddingLeft: '8px',
              paddingRight: '8px'
            }}
          >
            {content.split('\n').map((_, index) => (
              <div key={index} style={{ height: '1.6em', textAlign: 'right' }}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Editor label */}
        <div className="absolute top-2 left-2 bg-editor-toolbar bg-opacity-90 px-2 py-1 rounded text-xs text-gray-400 z-50 pointer-events-none">
          Editor ({splitRatio.toFixed(0)}%)
        </div>
      </div>

      {/* Resizer */}
      <div
        className="w-1 bg-gray-700 hover:bg-editor-accent cursor-col-resize transition-colors relative group flex-shrink-0"
        onMouseDown={() => setIsDragging(true)}
      >
        {/* Resizer handle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 group-hover:bg-editor-accent rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Preview Panel */}
      <div
        className="relative flex flex-col"
        style={{ width: `${100 - splitRatio}%` }}
      >
        {/* Custom preview container for split view */}
        <div
          ref={previewRef}
          className="flex-1 bg-gray-900 overflow-y-auto"
          onScroll={handlePreviewScroll}
        >
          <Preview 
            htmlContent={htmlContent} 
            markdownContent={markdownContent}
          />
        </div>

        {/* Preview label */}
        <div className="absolute top-2 right-2 bg-editor-toolbar bg-opacity-90 px-2 py-1 rounded text-xs text-gray-400 z-50 pointer-events-none">
          Preview ({(100 - splitRatio).toFixed(0)}%)
        </div>
      </div>
    </div>
  );
};

export default SplitView;