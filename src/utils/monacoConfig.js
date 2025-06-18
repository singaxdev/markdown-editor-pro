import { loader } from '@monaco-editor/react';

// Configure Monaco Editor for Electron environment (offline)
export const configureMonaco = () => {
  if (typeof window !== 'undefined') {
    // Configure Monaco to use local files instead of CDN
    loader.config({
      // Don't specify paths - let it use the default bundled version
      "vs/nls": {
        availableLanguages: {
          "*": "en"
        }
      }
    });

    // Initialize Monaco Editor with custom configuration
    loader.init().then((monaco) => {
      // Set up markdown language support
      monaco.languages.setLanguageConfiguration('markdown', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

        brackets: [
          ['[', ']'],
          ['(', ')'],
          ['{', '}']
        ],

        autoClosingPairs: [
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '{', close: '}' },
          { open: '`', close: '`' },
          { open: '*', close: '*' },
          { open: '_', close: '_' },
          { open: '"', close: '"' },
          { open: "'", close: "'" }
        ],

        surroundingPairs: [
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '{', close: '}' },
          { open: '`', close: '`' },
          { open: '*', close: '*' },
          { open: '_', close: '_' },
          { open: '"', close: '"' },
          { open: "'", close: "'" }
        ]
      });

      // Define custom theme for markdown
      monaco.editor.defineTheme('markdown-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword.md', foreground: '569cd6' },
          { token: 'string.md', foreground: 'ce9178' },
          { token: 'emphasis.md', foreground: 'd4d4d4', fontStyle: 'italic' },
          { token: 'strong.md', foreground: 'd4d4d4', fontStyle: 'bold' },
          { token: 'variable.md', foreground: '9cdcfe' },
          { token: 'variable.source.md', foreground: '9cdcfe' },
          { token: 'meta.embedded', foreground: '569cd6' },
          { token: 'string.other.link.title.md', foreground: '569cd6' },
          { token: 'string.other.link.description.md', foreground: 'ce9178' },
          { token: 'punctuation.definition.string.begin.md', foreground: '569cd6' },
          { token: 'punctuation.definition.string.end.md', foreground: '569cd6' },
          { token: 'punctuation.definition.metadata.md', foreground: '569cd6' }
        ],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4',
          'editorLineNumber.foreground': '#858585',
          'editorLineNumber.activeForeground': '#c6c6c6',
          'editor.selectionBackground': '#264f78',
          'editor.selectionHighlightBackground': '#add6ff26'
        }
      });

      console.log('Monaco Editor configured successfully');
    }).catch((error) => {
      console.error('Failed to initialize Monaco Editor:', error);
    });
  }
};

export default configureMonaco;