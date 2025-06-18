import React, { useState, useRef, useEffect } from 'react';
import Preview from './Preview';

const SplitView = ({ content, onChange, htmlContent, isSplitView }) => {
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
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

  // Synchronized scrolling
  const handleEditorScroll = () => {
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
  };

  const handlePreviewScroll = () => {
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
  };

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

  // Calculate line number width to prevent overlap
  const lineCount = content.split('\n').length;
  const lineNumberWidth = Math.max(lineCount.toString().length * 8 + 16, 40);

  return (
    <div ref={containerRef} className="flex-1 flex h-full">
      {/* Editor Panel */}
      <div
        className="relative overflow-hidden bg-editor-bg flex flex-col"
        style={{ width: `${splitRatio}%` }}
      >
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleEditorScroll}
            className="w-full h-full bg-editor-bg text-editor-text border-0 outline-none resize-none font-mono text-sm leading-relaxed"
            style={{
              fontFamily: 'JetBrains Mono, Monaco, Cascadia Code, Roboto Mono, monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              tabSize: 2,
              minHeight: '100%',
              paddingLeft: `${lineNumberWidth}px`,
              paddingTop: '16px',
              paddingRight: '16px',
              paddingBottom: '16px'
            }}
            placeholder="Start typing your markdown here..."
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
          <div
            className="split-preview-content max-w-4xl mx-auto p-8 min-h-full"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              lineHeight: '1.6',
              color: '#e2e8f0',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Include the same styles as the Preview component */}
          <style dangerouslySetInnerHTML={{
            __html: `
            .split-preview-content h1,
            .split-preview-content h2,
            .split-preview-content h3,
            .split-preview-content h4,
            .split-preview-content h5,
            .split-preview-content h6 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
              color: #f1f5f9;
            }

            .split-preview-content h1 {
              font-size: 2em;
              border-bottom: 1px solid #475569;
              padding-bottom: 10px;
            }

            .split-preview-content h2 {
              font-size: 1.5em;
              border-bottom: 1px solid #475569;
              padding-bottom: 8px;
            }

            .split-preview-content h3 {
              font-size: 1.25em;
            }

            .split-preview-content p {
              margin-bottom: 16px;
              color: #e2e8f0;
            }

            .split-preview-content ul,
            .split-preview-content ol {
              margin-bottom: 16px;
              padding-left: 30px;
              color: #e2e8f0;
            }

            .split-preview-content li {
              margin-bottom: 4px;
            }

            .split-preview-content code {
              background-color: #374151;
              color: #fbbf24;
              border-radius: 3px;
              font-size: 85%;
              margin: 0;
              padding: 0.2em 0.4em;
              font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
            }

            .split-preview-content pre {
              background-color: #1f2937 !important;
              border: 1px solid #374151;
              border-radius: 6px;
              font-size: 85%;
              line-height: 1.45;
              overflow: auto;
              padding: 16px;
              margin-bottom: 16px;
            }

            .split-preview-content pre code {
              background-color: transparent !important;
              color: #e5e7eb !important;
              border: 0;
              display: block;
              font-size: 100%;
              margin: 0;
              padding: 0;
              font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
            }

            .split-preview-content .hljs-keyword {
              color: #bb86fc !important;
              font-weight: bold;
            }

            .split-preview-content .hljs-string {
              color: #a5d6a7 !important;
            }

            .split-preview-content .hljs-number {
              color: #ffab40 !important;
            }

            .split-preview-content .hljs-comment {
              color: #75715e !important;
              font-style: italic;
            }

            .split-preview-content .hljs-function {
              color: #64b5f6 !important;
            }

            .split-preview-content .hljs-title {
              color: #64b5f6 !important;
              font-weight: bold;
            }

            .split-preview-content .hljs-variable {
              color: #e1f5fe !important;
            }

            .split-preview-content .hljs-built_in {
              color: #ffcc02 !important;
            }

            .split-preview-content .hljs-literal {
              color: #ff7043 !important;
            }

            .split-preview-content .hljs-operator {
              color: #4fc3f7 !important;
            }

            .split-preview-content .hljs-tag {
              color: #f48fb1 !important;
            }

            .split-preview-content .hljs-attr {
              color: #ce93d8 !important;
            }

            .split-preview-content blockquote {
              border-left: 4px solid #6b7280;
              color: #9ca3af;
              margin: 0 0 16px 0;
              padding: 0 16px;
              font-style: italic;
            }

            .split-preview-content table {
              border-collapse: collapse;
              margin-bottom: 16px;
              width: 100%;
              background-color: #1f2937;
              border: 1px solid #374151;
            }

            .split-preview-content table th,
            .split-preview-content table td {
              border: 1px solid #374151;
              padding: 6px 13px;
              color: #e2e8f0;
            }

            .split-preview-content table th {
              background-color: #374151;
              font-weight: 600;
              color: #f9fafb;
            }

            .split-preview-content img {
              max-width: 100%;
              height: auto;
              margin: 16px 0;
              border-radius: 4px;
            }

            .split-preview-content a {
              color: #60a5fa;
              text-decoration: none;
            }

            .split-preview-content a:hover {
              text-decoration: underline;
              color: #93c5fd;
            }

            .split-preview-content hr {
              background-color: #4b5563;
              border: 0;
              height: 1px;
              margin: 24px 0;
            }

            .split-preview-content strong {
              color: #f1f5f9;
              font-weight: 600;
            }

            .split-preview-content em {
              color: #cbd5e1;
              font-style: italic;
            }

            .split-preview-content input[type="checkbox"] {
              margin-right: 8px;
              transform: scale(1.2);
            }

            .split-preview-content li.task-list-item {
              list-style: none;
              margin-left: -20px;
            }

            .split-preview-content del {
              color: #9ca3af;
              text-decoration: line-through;
            }
            `
          }} />
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