import { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
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
// JavaScript with syntax highlighting
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log("Doubled:", doubled);
\`\`\`

\`\`\`python
# Python example
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
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
    // Configure marked with extensions
    marked.use(markedHighlight({
      highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error('Highlight error:', err);
          }
        }
        return hljs.highlightAuto(code).value;
      }
    }));

    // Set other marked options
    marked.setOptions({
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
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'type', 'checked', 'disabled'],
    // Allow highlight.js classes
    ALLOW_UNKNOWN_PROTOCOLS: false,
    ADD_ATTR: ['target']
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