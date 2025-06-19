import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Move, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const TableEditor = ({ 
  tableMarkdown, 
  onSave, 
  onCancel,
  className = '' 
}) => {
  const [tableData, setTableData] = useState({ headers: [], rows: [], alignments: [] });
  const [editingCell, setEditingCell] = useState({ row: -1, col: -1 });
  const [tableWidth, setTableWidth] = useState('100%');
  const editorRef = useRef(null);

  // Parse markdown table to data structure
  useEffect(() => {
    if (tableMarkdown) {
      parseMarkdownTable(tableMarkdown);
    } else {
      // Create a default 3x3 table
      setTableData({
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          ['', '', ''],
          ['', '', '']
        ],
        alignments: ['left', 'left', 'left']
      });
    }
  }, [tableMarkdown]);

  const parseMarkdownTable = (markdown) => {
    const lines = markdown.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) return;

    // Parse headers
    const headerLine = lines[0];
    const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);

    // Parse alignment row
    const alignmentLine = lines[1];
    const alignments = alignmentLine.split('|').map(a => a.trim()).filter(a => a).map(alignment => {
      if (alignment.startsWith(':') && alignment.endsWith(':')) return 'center';
      if (alignment.endsWith(':')) return 'right';
      return 'left';
    });

    // Parse data rows
    const rows = lines.slice(2).map(line => {
      return line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
    });

    // Ensure all rows have the same number of columns
    const maxCols = Math.max(headers.length, ...rows.map(row => row.length));
    const normalizedRows = rows.map(row => {
      while (row.length < maxCols) row.push('');
      return row.slice(0, maxCols);
    });

    // Ensure alignments array matches column count
    while (alignments.length < maxCols) alignments.push('left');

    setTableData({
      headers: headers.slice(0, maxCols),
      rows: normalizedRows,
      alignments: alignments.slice(0, maxCols)
    });
  };

  const generateMarkdown = () => {
    const { headers, rows, alignments } = tableData;
    
    // Create header row
    const headerRow = '| ' + headers.join(' | ') + ' |';
    
    // Create alignment row
    const alignmentRow = '|' + alignments.map(align => {
      switch (align) {
        case 'center': return ':---:';
        case 'right': return '---:';
        default: return '---';
      }
    }).map(a => ` ${a} `).join('|') + '|';
    
    // Create data rows
    const dataRows = rows.map(row => '| ' + row.join(' | ') + ' |');
    
    return [headerRow, alignmentRow, ...dataRows].join('\n');
  };

  const handleCellEdit = (rowIndex, colIndex, value) => {
    const newTableData = { ...tableData };
    
    if (rowIndex === -1) {
      // Editing header
      newTableData.headers[colIndex] = value;
    } else {
      // Editing data cell
      newTableData.rows[rowIndex][colIndex] = value;
    }
    
    setTableData(newTableData);
  };

  const addColumn = () => {
    const newTableData = { ...tableData };
    newTableData.headers.push(`Column ${newTableData.headers.length + 1}`);
    newTableData.alignments.push('left');
    newTableData.rows = newTableData.rows.map(row => [...row, '']);
    setTableData(newTableData);
  };

  const removeColumn = (colIndex) => {
    if (tableData.headers.length <= 1) return; // Keep at least one column
    
    const newTableData = { ...tableData };
    newTableData.headers.splice(colIndex, 1);
    newTableData.alignments.splice(colIndex, 1);
    newTableData.rows = newTableData.rows.map(row => {
      const newRow = [...row];
      newRow.splice(colIndex, 1);
      return newRow;
    });
    setTableData(newTableData);
  };

  const addRow = () => {
    const newTableData = { ...tableData };
    const newRow = new Array(newTableData.headers.length).fill('');
    newTableData.rows.push(newRow);
    setTableData(newTableData);
  };

  const removeRow = (rowIndex) => {
    if (tableData.rows.length <= 1) return; // Keep at least one row
    
    const newTableData = { ...tableData };
    newTableData.rows.splice(rowIndex, 1);
    setTableData(newTableData);
  };

  const setColumnAlignment = (colIndex, alignment) => {
    const newTableData = { ...tableData };
    newTableData.alignments[colIndex] = alignment;
    setTableData(newTableData);
  };

  const handleSave = () => {
    const markdown = generateMarkdown();
    onSave(markdown);
  };

  const CellEditor = ({ value, onSave, onCancel, isHeader = false }) => {
    const [editValue, setEditValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, []);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSave(editValue);
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    const handleBlur = () => {
      onSave(editValue);
    };

    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`w-full px-2 py-1 bg-gray-700 text-white border border-editor-accent rounded text-sm ${
          isHeader ? 'font-semibold' : ''
        }`}
      />
    );
  };

  return (
    <div ref={editorRef} className={`table-editor bg-editor-bg border border-gray-600 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Table Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-3 py-1 bg-editor-accent text-white rounded text-sm hover:bg-opacity-80"
            title="Add Column"
          >
            <Plus size={14} />
            Column
          </button>
          <button
            onClick={addRow}
            className="flex items-center gap-1 px-3 py-1 bg-editor-accent text-white rounded text-sm hover:bg-opacity-80"
            title="Add Row"
          >
            <Plus size={14} />
            Row
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-600 bg-gray-800">
          {/* Header row */}
          <thead>
            <tr className="bg-gray-700">
              {tableData.headers.map((header, colIndex) => (
                <th
                  key={colIndex}
                  className="border border-gray-600 p-2 text-left relative group"
                  style={{ textAlign: tableData.alignments[colIndex] }}
                >
                  {editingCell.row === -1 && editingCell.col === colIndex ? (
                    <CellEditor
                      value={header}
                      onSave={(value) => {
                        handleCellEdit(-1, colIndex, value);
                        setEditingCell({ row: -1, col: -1 });
                      }}
                      onCancel={() => setEditingCell({ row: -1, col: -1 })}
                      isHeader={true}
                    />
                  ) : (
                    <div
                      className="cursor-text min-h-[20px] font-semibold"
                      onClick={() => setEditingCell({ row: -1, col: colIndex })}
                    >
                      {header || 'Header'}
                    </div>
                  )}
                  
                  {/* Column controls */}
                  <div className="absolute top-0 right-0 hidden group-hover:flex bg-gray-600 rounded-bl text-xs">
                    <button
                      onClick={() => setColumnAlignment(colIndex, 'left')}
                      className={`p-1 hover:bg-gray-500 ${tableData.alignments[colIndex] === 'left' ? 'bg-editor-accent' : ''}`}
                      title="Align Left"
                    >
                      <AlignLeft size={12} />
                    </button>
                    <button
                      onClick={() => setColumnAlignment(colIndex, 'center')}
                      className={`p-1 hover:bg-gray-500 ${tableData.alignments[colIndex] === 'center' ? 'bg-editor-accent' : ''}`}
                      title="Align Center"
                    >
                      <AlignCenter size={12} />
                    </button>
                    <button
                      onClick={() => setColumnAlignment(colIndex, 'right')}
                      className={`p-1 hover:bg-gray-500 ${tableData.alignments[colIndex] === 'right' ? 'bg-editor-accent' : ''}`}
                      title="Align Right"
                    >
                      <AlignRight size={12} />
                    </button>
                    <button
                      onClick={() => removeColumn(colIndex)}
                      className="p-1 hover:bg-red-600 text-red-400"
                      title="Remove Column"
                      disabled={tableData.headers.length <= 1}
                    >
                      <Minus size={12} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Data rows */}
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-750 group">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-600 p-2 relative"
                    style={{ textAlign: tableData.alignments[colIndex] }}
                  >
                    {editingCell.row === rowIndex && editingCell.col === colIndex ? (
                      <CellEditor
                        value={cell}
                        onSave={(value) => {
                          handleCellEdit(rowIndex, colIndex, value);
                          setEditingCell({ row: -1, col: -1 });
                        }}
                        onCancel={() => setEditingCell({ row: -1, col: -1 })}
                      />
                    ) : (
                      <div
                        className="cursor-text min-h-[20px]"
                        onClick={() => setEditingCell({ row: rowIndex, col: colIndex })}
                      >
                        {cell || ''}
                      </div>
                    )}
                  </td>
                ))}
                
                {/* Row controls */}
                <td className="border-0 pl-2">
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="p-1 text-red-400 hover:bg-red-600 hover:text-white rounded text-xs"
                      title="Remove Row"
                      disabled={tableData.rows.length <= 1}
                    >
                      <Minus size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-600">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-editor-accent text-white rounded hover:bg-opacity-80"
        >
          Insert Table
        </button>
      </div>

      {/* Preview markdown */}
      <details className="mt-4">
        <summary className="text-sm text-gray-400 cursor-pointer">Preview Markdown</summary>
        <pre className="mt-2 p-2 bg-gray-900 text-xs font-mono rounded border text-gray-300 overflow-x-auto">
          {generateMarkdown()}
        </pre>
      </details>
    </div>
  );
};

// Hook to detect table editing opportunities
export const useTableDetection = (content, cursorPosition) => {
  const [tableAtCursor, setTableAtCursor] = useState(null);

  useEffect(() => {
    const detectTableAtPosition = () => {
      const lines = content.split('\n');
      let currentLine = 0;
      let currentPos = 0;

      // Find which line the cursor is on
      for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length + 1; // +1 for newline
        if (currentPos + lineLength > cursorPosition) {
          currentLine = i;
          break;
        }
        currentPos += lineLength;
      }

      // Check if current line is part of a table
      const line = lines[currentLine];
      if (line && line.includes('|')) {
        // Find the full table
        let startLine = currentLine;
        let endLine = currentLine;

        // Find start of table
        while (startLine > 0 && lines[startLine - 1].includes('|')) {
          startLine--;
        }

        // Find end of table
        while (endLine < lines.length - 1 && lines[endLine + 1].includes('|')) {
          endLine++;
        }

        // Extract table content
        const tableLines = lines.slice(startLine, endLine + 1);
        if (tableLines.length >= 2) { // At least header and alignment rows
          setTableAtCursor({
            content: tableLines.join('\n'),
            startLine,
            endLine,
            lineRange: [startLine, endLine]
          });
          return;
        }
      }

      setTableAtCursor(null);
    };

    detectTableAtPosition();
  }, [content, cursorPosition]);

  return tableAtCursor;
};

export default TableEditor; 