import { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

export const useMarkdownEditor = () => {
  const [content, setContent] = useState(`# Welcome to Markdown Editor

Start typing your markdown here...

## Features Supported

### Basic Formatting
- **Bold text** and *italic text*
- ~~Strikethrough text~~
- \`inline code\`

### Lists
1. Numbered list item
2. Another numbered item
   - Nested unordered list
   - Another nested item

### Links and Images
[Link to Google](https://google.com)

### Code Blocks
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

### Tables
| Feature | Supported |
|---------|-----------|
| Tables | ✅ Yes |
| Syntax Highlighting | ✅ Yes |
| Task Lists | ✅ Yes |

### Task Lists
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

### Blockquotes
> This is a blockquote
> It can span multiple lines
`);

  const [currentFile, setCurrentFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Configure marked with highlight.js
  useEffect(() => {
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error('Highlight error:', err);
          }
        }
        return hljs.highlightAuto(code).value;
      },
      gfm: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: true,
      xhtml: false,
      headerIds: true,
      mangle: false
    });
  }, []);

  // Parse markdown to HTML
  const htmlContent = DOMPurify.sanitize(marked.parse(content), {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'del', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'span', 'a', 'img', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'input'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'type', 'checked', 'disabled']
  });

  const handleContentChange = useCallback((newContent) => {
    setContent(newContent);
    setIsDirty(true);
  }, []);

  const getFileName = () => {
    if (currentFile) {
      return currentFile.split('/').pop().split('\\').pop();
    }
    return 'Untitled';
  };

  return {
    content,
    setContent,
    currentFile,
    setCurrentFile,
    isDirty,
    setIsDirty,
    htmlContent,
    handleContentChange,
    getFileName
  };
};