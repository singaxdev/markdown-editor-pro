import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePDFExport = ({ currentFile, htmlContent, showLoading, hideLoading, showToast }) => {
  const handleExportPDF = useCallback(async () => {
    try {
      showLoading('export', 'Exporting to PDF...');

      // First, check if preview content exists
      let element = document.getElementById('preview-content');
      let createdTemp = false;

      // If preview is not visible, create a temporary one
      if (!element) {
        createdTemp = true;
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '210mm';
        tempContainer.style.background = '#ffffff';
        tempContainer.style.padding = '20mm';
        tempContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        tempContainer.style.lineHeight = '1.6';
        tempContainer.style.color = '#000000';
        tempContainer.innerHTML = htmlContent;
        tempContainer.id = 'temp-preview-content';

        document.body.appendChild(tempContainer);
        element = tempContainer;
      } else {
        createdTemp = true;
        const tempContainer = element.cloneNode(true);
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.width = '210mm';
        tempContainer.style.background = '#ffffff';
        tempContainer.style.color = '#000000';
        tempContainer.id = 'temp-pdf-content';

        document.body.appendChild(tempContainer);
        element = tempContainer;
      }

      // Apply print-friendly styles
      const printStyles = document.createElement('style');
      printStyles.innerHTML = `
        #temp-preview-content,
        #temp-pdf-content {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        
        #temp-preview-content h1,
        #temp-preview-content h2,
        #temp-preview-content h3,
        #temp-preview-content h4,
        #temp-preview-content h5,
        #temp-preview-content h6,
        #temp-pdf-content h1,
        #temp-pdf-content h2,
        #temp-pdf-content h3,
        #temp-pdf-content h4,
        #temp-pdf-content h5,
        #temp-pdf-content h6 {
          margin-top: 24px !important;
          margin-bottom: 16px !important;
          font-weight: 600 !important;
          line-height: 1.25 !important;
          color: #000000 !important;
          border-bottom-color: #cccccc !important;
        }
        
        #temp-preview-content h1,
        #temp-pdf-content h1 {
          font-size: 2em !important;
          border-bottom: 1px solid #cccccc !important;
          padding-bottom: 10px !important;
        }
        
        #temp-preview-content h2,
        #temp-pdf-content h2 {
          font-size: 1.5em !important;
          border-bottom: 1px solid #cccccc !important;
          padding-bottom: 8px !important;
        }
        
        #temp-preview-content h3,
        #temp-pdf-content h3 {
          font-size: 1.25em !important;
        }
        
        #temp-preview-content p,
        #temp-pdf-content p {
          margin-bottom: 16px !important;
          color: #000000 !important;
        }
        
        #temp-preview-content ul,
        #temp-preview-content ol,
        #temp-pdf-content ul,
        #temp-pdf-content ol {
          margin-bottom: 16px !important;
          padding-left: 30px !important;
          color: #000000 !important;
        }
        
        #temp-preview-content li,
        #temp-pdf-content li {
          margin-bottom: 4px !important;
          color: #000000 !important;
        }
        
        #temp-preview-content pre,
        #temp-pdf-content pre {
          background-color: #f5f5f5 !important;
          border: 1px solid #cccccc !important;
          border-radius: 6px !important;
          font-size: 85% !important;
          line-height: 1.45 !important;
          overflow: auto !important;
          padding: 16px !important;
          margin-bottom: 16px !important;
        }
        
        #temp-preview-content pre code,
        #temp-pdf-content pre code {
          background-color: transparent !important;
          color: #000000 !important;
          border: 0 !important;
          display: block !important;
          font-size: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Courier New', monospace !important;
        }
        
        #temp-preview-content code,
        #temp-pdf-content code {
          background-color: #f0f0f0 !important;
          color: #333333 !important;
          border-radius: 3px !important;
          font-size: 85% !important;
          margin: 0 !important;
          padding: 0.2em 0.4em !important;
          font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Courier New', monospace !important;
        }
        
        #temp-preview-content blockquote,
        #temp-pdf-content blockquote {
          border-left: 4px solid #666666 !important;
          color: #333333 !important;
          margin: 0 0 16px 0 !important;
          padding: 0 16px !important;
          font-style: italic !important;
        }
        
        #temp-preview-content table,
        #temp-pdf-content table {
          border-collapse: collapse !important;
          margin-bottom: 16px !important;
          width: 100% !important;
          background-color: #ffffff !important;
          border: 1px solid #cccccc !important;
        }
        
        #temp-preview-content table th,
        #temp-preview-content table td,
        #temp-pdf-content table th,
        #temp-pdf-content table td {
          border: 1px solid #cccccc !important;
          padding: 6px 13px !important;
          color: #000000 !important;
        }
        
        #temp-preview-content table th,
        #temp-pdf-content table th {
          background-color: #f0f0f0 !important;
          font-weight: 600 !important;
          color: #000000 !important;
        }
        
        #temp-preview-content img,
        #temp-pdf-content img {
          max-width: 100% !important;
          height: auto !important;
          margin: 16px 0 !important;
          border-radius: 4px !important;
        }
        
        #temp-preview-content a,
        #temp-pdf-content a {
          color: #0066cc !important;
          text-decoration: none !important;
        }
        
        #temp-preview-content hr,
        #temp-pdf-content hr {
          background-color: #cccccc !important;
          border: 0 !important;
          height: 1px !important;
          margin: 24px 0 !important;
        }
        
        #temp-preview-content strong,
        #temp-pdf-content strong {
          color: #000000 !important;
          font-weight: 600 !important;
        }
        
        #temp-preview-content em,
        #temp-pdf-content em {
          color: #000000 !important;
          font-style: italic !important;
        }
        
        #temp-preview-content input[type="checkbox"],
        #temp-pdf-content input[type="checkbox"] {
          margin-right: 8px !important;
          transform: scale(1.2) !important;
        }
        
        #temp-preview-content li.task-list-item,
        #temp-pdf-content li.task-list-item {
          list-style: none !important;
          margin-left: -20px !important;
        }
        
        #temp-preview-content del,
        #temp-pdf-content del {
          color: #666666 !important;
          text-decoration: line-through !important;
        }
        
        #temp-preview-content .hljs-keyword,
        #temp-pdf-content .hljs-keyword {
          color: #0066cc !important;
          font-weight: bold !important;
        }
        
        #temp-preview-content .hljs-string,
        #temp-pdf-content .hljs-string {
          color: #006600 !important;
        }
        
        #temp-preview-content .hljs-number,
        #temp-pdf-content .hljs-number {
          color: #cc6600 !important;
        }
        
        #temp-preview-content .hljs-comment,
        #temp-pdf-content .hljs-comment {
          color: #666666 !important;
          font-style: italic !important;
        }
        
        #temp-preview-content .hljs-function,
        #temp-preview-content .hljs-title,
        #temp-pdf-content .hljs-function,
        #temp-pdf-content .hljs-title {
          color: #0066cc !important;
          font-weight: bold !important;
        }
      `;
      document.head.appendChild(printStyles);

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const defaultFileName = currentFile ?
        currentFile.split('/').pop().split('\\').pop().replace(/\.[^/.]+$/, '') + '.pdf' :
        'document.pdf';

      // Clean up temporary elements
      if (createdTemp) {
        const tempElement = document.getElementById('temp-preview-content') || document.getElementById('temp-pdf-content');
        if (tempElement) {
          document.body.removeChild(tempElement);
        }
      }
      document.head.removeChild(printStyles);

      // Use Electron's save dialog if available
      if (window.electronAPI) {
        const result = await window.electronAPI.showSaveDialog({
          defaultPath: defaultFileName,
          filters: [
            { name: 'PDF Files', extensions: ['pdf'] }
          ]
        });

        if (!result.canceled) {
          const pdfBuffer = pdf.output('arraybuffer');
          const uint8Array = new Uint8Array(pdfBuffer);

          const writeResult = await window.electronAPI.writeFile(result.filePath, uint8Array);

          if (writeResult.success) {
            showToast(`PDF exported to ${result.filePath.split('/').pop().split('\\').pop()}`, 'success');
          } else {
            await window.electronAPI.showErrorDialog('Export Error', `Could not save PDF: ${writeResult.error}`);
            showToast('Failed to export PDF', 'error');
          }
        }
      } else {
        // Fallback for web version
        pdf.save(defaultFileName);
        showToast(`PDF downloaded as ${defaultFileName}`, 'success');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showToast('Error exporting PDF', 'error');
    } finally {
      hideLoading();
    }
  }, [currentFile, htmlContent, showLoading, hideLoading, showToast]);

  return {
    handleExportPDF
  };
};
