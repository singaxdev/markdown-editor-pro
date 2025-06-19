import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram = ({ 
  chart, 
  config = {}, 
  className = '',
  onError = null 
}) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const mermaidRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Mermaid once
  useEffect(() => {
    if (!isInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        htmlLabels: true,
        fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
        fontSize: 14,
        ...config
      });
      setIsInitialized(true);
    }
  }, [config, isInitialized]);

  // Render the diagram when chart or theme changes
  useEffect(() => {
    if (!isInitialized || !chart) return;

    const renderDiagram = async () => {
      try {
        setError(null);
        
        // Generate a unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Validate and render the diagram
        const isValid = await mermaid.parse(chart);
        if (!isValid) {
          throw new Error('Invalid Mermaid syntax');
        }

        const { svg: svgCode } = await mermaid.render(id, chart);
        setSvg(svgCode);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err.message);
        if (onError) {
          onError(err);
        }
      }
    };

    renderDiagram();
  }, [chart, isInitialized, onError]);

  if (error) {
    return (
      <div className={`mermaid-error p-4 bg-red-900/20 border border-red-500/30 rounded ${className}`}>
        <div className="text-red-400 text-sm font-medium mb-2">Mermaid Diagram Error:</div>
        <div className="text-red-300 text-xs font-mono whitespace-pre-wrap">{error}</div>
        <details className="mt-2">
          <summary className="text-red-400 text-xs cursor-pointer">Show diagram code</summary>
          <pre className="text-red-300 text-xs mt-1 whitespace-pre-wrap">{chart}</pre>
        </details>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className={`mermaid-loading p-4 text-center text-gray-400 ${className}`}>
        <div className="animate-pulse">Rendering diagram...</div>
      </div>
    );
  }

  return (
    <div 
      ref={mermaidRef}
      className={`mermaid-container ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// Hook to detect and extract Mermaid diagrams from markdown
export const useMermaidDetection = (content) => {
  const [diagrams, setDiagrams] = useState([]);

  useEffect(() => {
    const detectMermaidBlocks = (markdown) => {
      const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
      const found = [];
      let match;

      while ((match = mermaidRegex.exec(markdown)) !== null) {
        found.push({
          id: `mermaid-${found.length}`,
          code: match[1].trim(),
          fullMatch: match[0],
          index: match.index
        });
      }

      return found;
    };

    const detectedDiagrams = detectMermaidBlocks(content);
    setDiagrams(detectedDiagrams);
  }, [content]);

  return diagrams;
};

// Utility function to replace Mermaid blocks in HTML for preview
export const replaceMermaidInHTML = (html, diagrams) => {
  let processedHtml = html;

  diagrams.forEach((diagram, index) => {
    const placeholder = `<div class="mermaid-placeholder" data-diagram-id="${diagram.id}" data-index="${index}"></div>`;
    const codeBlockPattern = new RegExp(
      `<pre><code class="language-mermaid">[\\s\\S]*?</code></pre>`,
      'g'
    );
    
    // Replace the first occurrence (we process in order)
    processedHtml = processedHtml.replace(codeBlockPattern, placeholder);
  });

  return processedHtml;
};

export default MermaidDiagram; 