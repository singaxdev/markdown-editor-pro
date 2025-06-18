import React from 'react';

const Preview = ({ htmlContent }) => {
  return (
    <div className="flex-1 bg-gray-900 overflow-y-auto">
      <div
        id="preview-content"
        className="max-w-4xl mx-auto p-8 min-h-full"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: '1.6',
          color: '#e2e8f0',
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        #preview-content h1,
        #preview-content h2,
        #preview-content h3,
        #preview-content h4,
        #preview-content h5,
        #preview-content h6 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
          color: #f1f5f9;
        }

        #preview-content h1 {
          font-size: 2em;
          border-bottom: 1px solid #475569;
          padding-bottom: 10px;
        }

        #preview-content h2 {
          font-size: 1.5em;
          border-bottom: 1px solid #475569;
          padding-bottom: 8px;
        }

        #preview-content h3 {
          font-size: 1.25em;
        }

        #preview-content p {
          margin-bottom: 16px;
          color: #e2e8f0;
        }

        #preview-content ul,
        #preview-content ol {
          margin-bottom: 16px;
          padding-left: 30px;
          color: #e2e8f0;
        }

        #preview-content li {
          margin-bottom: 4px;
        }

        #preview-content code {
          background-color: #374151;
          color: #fbbf24;
          border-radius: 3px;
          font-size: 85%;
          margin: 0;
          padding: 0.2em 0.4em;
          font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
        }

        #preview-content pre {
          background-color: #1f2937 !important;
          border: 1px solid #374151;
          border-radius: 6px;
          font-size: 85%;
          line-height: 1.45;
          overflow: auto;
          padding: 16px;
          margin-bottom: 16px;
        }

        #preview-content pre code {
          background-color: transparent !important;
          color: #e5e7eb !important;
          border: 0;
          display: block;
          font-size: 100%;
          margin: 0;
          padding: 0;
          font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
        }

        /* Syntax highlighting styles */
        #preview-content .hljs-keyword {
          color: #bb86fc !important;
          font-weight: bold;
        }

        #preview-content .hljs-string {
          color: #a5d6a7 !important;
        }

        #preview-content .hljs-number {
          color: #ffab40 !important;
        }

        #preview-content .hljs-comment {
          color: #75715e !important;
          font-style: italic;
        }

        #preview-content .hljs-function {
          color: #64b5f6 !important;
        }

        #preview-content .hljs-title {
          color: #64b5f6 !important;
          font-weight: bold;
        }

        #preview-content .hljs-variable {
          color: #e1f5fe !important;
        }

        #preview-content .hljs-built_in {
          color: #ffcc02 !important;
        }

        #preview-content .hljs-literal {
          color: #ff7043 !important;
        }

        #preview-content .hljs-operator {
          color: #4fc3f7 !important;
        }

        #preview-content .hljs-tag {
          color: #f48fb1 !important;
        }

        #preview-content .hljs-attr {
          color: #ce93d8 !important;
        }

        #preview-content blockquote {
          border-left: 4px solid #6b7280;
          color: #9ca3af;
          margin: 0 0 16px 0;
          padding: 0 16px;
          font-style: italic;
        }

        #preview-content table {
          border-collapse: collapse;
          margin-bottom: 16px;
          width: 100%;
          background-color: #1f2937;
          border: 1px solid #374151;
        }

        #preview-content table th,
        #preview-content table td {
          border: 1px solid #374151;
          padding: 6px 13px;
          color: #e2e8f0;
        }

        #preview-content table th {
          background-color: #374151;
          font-weight: 600;
          color: #f9fafb;
        }

        #preview-content img {
          max-width: 100%;
          height: auto;
          margin: 16px 0;
          border-radius: 4px;
        }

        #preview-content a {
          color: #60a5fa;
          text-decoration: none;
        }

        #preview-content a:hover {
          text-decoration: underline;
          color: #93c5fd;
        }

        #preview-content hr {
          background-color: #4b5563;
          border: 0;
          height: 1px;
          margin: 24px 0;
        }

        #preview-content strong {
          color: #f1f5f9;
          font-weight: 600;
        }

        #preview-content em {
          color: #cbd5e1;
          font-style: italic;
        }

        /* Task Lists */
        #preview-content input[type="checkbox"] {
          margin-right: 8px;
          transform: scale(1.2);
        }

        #preview-content li.task-list-item {
          list-style: none;
          margin-left: -20px;
        }

        /* Strikethrough */
        #preview-content del {
          color: #9ca3af;
          text-decoration: line-through;
        }
        `
      }} />
    </div>
  );
};

export default Preview;