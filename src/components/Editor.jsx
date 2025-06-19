import React, { useEffect, useRef } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

const Editor = ({
  content,
  onChange,
  settings = {},
  currentTheme = 'dark',
  imageManager = null,
  currentFile = null,
  onImageInsert = null
}) => {
  const isDarkMode = currentTheme !== 'light' && !currentTheme.includes('light');
  const fontSize = settings.fontSize || 14;
  const fontFamily = settings.fontFamily || 'JetBrains Mono';
  const fontWeight = settings.fontWeight || 400;
  const lineHeight = settings.lineHeight || 1.6;
  const lineNumbers = settings.lineNumbers !== false;
  const wordWrap = settings.wordWrap !== false;
  const minimap = settings.minimap || false;
  const bracketPairs = settings.bracketPairs !== false;
  const folding = settings.folding !== false;
  const editorRef = useRef(null);
  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: fontSize,
        fontFamily: `${fontFamily}, Monaco, Cascadia Code, Consolas, Courier New, monospace`,
        fontWeight: fontWeight,
        lineHeight: lineHeight,
        lineNumbers: lineNumbers ? 'on' : 'off',
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap },
        bracketPairColorization: { enabled: bracketPairs },
        folding: folding,
      });
    }
  }, [fontSize, fontFamily, fontWeight, lineHeight, lineNumbers, wordWrap, minimap, bracketPairs, folding]);

  // Configure Monaco themes
  useEffect(() => {
    // This will run when the editor loads and when theme changes
    import('@monaco-editor/react').then(({ loader }) => {
      loader.init().then((monaco) => {
        // Define custom light theme
        monaco.editor.defineTheme('light-theme', {
          base: 'vs',
          inherit: true,
          rules: [
            { token: '', foreground: '333333' },
            { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
            { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
            { token: 'string', foreground: 'A31515' },
            { token: 'number', foreground: '098658' },
            { token: 'regexp', foreground: 'A31515' },
            { token: 'operator', foreground: '000000' },
            { token: 'namespace', foreground: '267F99' },
            { token: 'type', foreground: '267F99' },
            { token: 'struct', foreground: '267F99' },
            { token: 'class', foreground: '267F99' },
            { token: 'interface', foreground: '267F99' },
            { token: 'parameter', foreground: '001080' },
            { token: 'variable', foreground: '001080' },
            { token: 'property', foreground: '001080' },
            { token: 'enumMember', foreground: '0070C1' },
            { token: 'function', foreground: '795E26' },
            { token: 'member', foreground: '795E26' },
          ],
          colors: {
            'editor.background': '#ffffff',
            'editor.foreground': '#333333',
            'editorLineNumber.foreground': '#999999',
            'editorLineNumber.activeForeground': '#333333',
            'editor.selectionBackground': '#ADD6FF4D',
            'editor.selectionHighlightBackground': '#ADD6FF26',
            'editor.findMatchBackground': '#A8AC94',
            'editor.findMatchHighlightBackground': '#EA5C0040',
            'editorCursor.foreground': '#000000',
            'editor.lineHighlightBackground': '#F7F7F7',
            'editorIndentGuide.background': '#D3D3D3',
            'editorIndentGuide.activeBackground': '#939393',
            'editorWhitespace.foreground': '#BFBFBF'
          }
        });

        // Define custom dark theme (enhanced)
        monaco.editor.defineTheme('dark-theme', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: '', foreground: 'CCCCCC' },
            { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
            { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
            { token: 'string', foreground: 'CE9178' },
            { token: 'number', foreground: 'B5CEA8' },
            { token: 'regexp', foreground: 'D16969' },
            { token: 'operator', foreground: 'D4D4D4' },
            { token: 'namespace', foreground: '4EC9B0' },
            { token: 'type', foreground: '4EC9B0' },
            { token: 'struct', foreground: '4EC9B0' },
            { token: 'class', foreground: '4EC9B0' },
            { token: 'interface', foreground: '4EC9B0' },
            { token: 'parameter', foreground: '9CDCFE' },
            { token: 'variable', foreground: '9CDCFE' },
            { token: 'property', foreground: '9CDCFE' },
            { token: 'enumMember', foreground: '4FC1FF' },
            { token: 'function', foreground: 'DCDCAA' },
            { token: 'member', foreground: 'DCDCAA' },
          ],
          colors: {
            'editor.background': '#1e1e1e',
            'editor.foreground': '#cccccc',
            'editorLineNumber.foreground': '#858585',
            'editorLineNumber.activeForeground': '#cccccc',
            'editor.selectionBackground': '#264F78',
            'editor.selectionHighlightBackground': '#ADD6FF26',
            'editor.findMatchBackground': '#515C6A',
            'editor.findMatchHighlightBackground': '#EA5C0040',
            'editorCursor.foreground': '#AEAFAD',
            'editor.lineHighlightBackground': '#2A2D2E',
            'editorIndentGuide.background': '#404040',
            'editorIndentGuide.activeBackground': '#707070',
            'editorWhitespace.foreground': '#404040'
          }
        });
      });
    });
  }, []);

  // Handle image paste in Monaco editor
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add image paste support
    if (imageManager && onImageInsert) {
      editor.onDidPaste(async (e) => {
        // Note: Monaco doesn't provide direct access to clipboard data
        // This would need to be handled at a higher level
      });
    }
  };

  const editorOptions = {
    minimap: { enabled: minimap },
    lineNumbers: lineNumbers ? 'on' : 'off',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    fontSize: fontSize,
    fontFamily: `${fontFamily}, Monaco, Cascadia Code, Roboto Mono, monospace`,
    fontWeight: fontWeight,
    lineHeight: lineHeight,
    wordWrap: wordWrap ? 'on' : 'off',
    wrappingIndent: 'indent',
    padding: { top: 16, bottom: 16 },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    renderLineHighlight: 'line',
    bracketPairColorization: {
      enabled: bracketPairs,
    },
    folding: folding,
    guides: {
      bracketPairs: bracketPairs,
      indentation: true,
    },
    suggest: {
      showKeywords: true,
      showSnippets: true,
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    automaticLayout: true,
  };

  // Apply drag and drop handlers if image manager is available
  const dragHandlers = imageManager ? imageManager.getDragHandlers(onImageInsert, currentFile) : {};

  return (
    <div 
      className={`flex-1 bg-editor-bg ${
        imageManager?.dragOver ? 'image-drop-zone drag-over' : ''
      }`}
      {...dragHandlers}
    >
      <MonacoEditor
        height="100%"
        defaultLanguage="markdown"
        value={content}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        options={editorOptions}
        theme={isDarkMode ? 'dark-theme' : 'light-theme'}
      />
      
      {/* Hidden file input for image selection */}
      {imageManager && (
        <input
          ref={imageManager.fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
      )}
      
      {/* Image upload indicator */}
      {imageManager?.uploading && (
        <div className="absolute top-4 right-4 bg-editor-accent text-white px-3 py-2 rounded-lg text-sm">
          Uploading image...
        </div>
      )}
    </div>
  );
};

export default Editor;