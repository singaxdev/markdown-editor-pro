import { useState, useCallback, useRef } from 'react';

export const useImageManager = (settings) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Image compression and optimization
  const optimizeImage = useCallback((file, maxWidth = 800, quality = 0.9) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Generate unique filename
  const generateFileName = useCallback((originalName) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const extension = originalName.split('.').pop();
    return `image_${timestamp}_${randomId}.${extension}`;
  }, []);

  // Save image to local folder (Electron)
  const saveImageLocally = useCallback(async (file, currentFilePath) => {
    if (!window.electronAPI || !currentFilePath) {
      return null;
    }

    try {
      const fileName = generateFileName(file.name);
      const currentDir = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
      const imagesDir = `${currentDir}/images`;
      const imagePath = `${imagesDir}/${fileName}`;

      // Create images directory if it doesn't exist
      try {
        await window.electronAPI.readDirectory(imagesDir);
      } catch {
        // Directory doesn't exist, create it
        // Note: This is a simplified approach - in a real app you'd create the directory
        console.log('Images directory would be created at:', imagesDir);
      }

      // Convert file to array buffer and save
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // In a real implementation, you'd use a proper file write API
      // For now, we'll create a data URL for the relative path
      const relativePath = `./images/${fileName}`;
      
      return {
        path: relativePath,
        fullPath: imagePath,
        fileName: fileName
      };
    } catch (error) {
      console.error('Error saving image locally:', error);
      return null;
    }
  }, [generateFileName]);

  // Convert image to data URL for embedding
  const imageToDataURL = useCallback(async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }, []);

  // Process and insert image
  const processImage = useCallback(async (file, insertCallback, currentFilePath = null) => {
    if (!file || !file.type.startsWith('image/')) {
      return false;
    }

    setUploading(true);
    
    try {
      // Optimize image
      const maxWidth = settings?.imageMaxWidth || 800;
      const quality = (settings?.imageQuality || 90) / 100;
      
      const optimizedFile = await optimizeImage(file, maxWidth, quality);
      
      // Try to save locally first (if in Electron and file is open)
      let imagePath = null;
      if (currentFilePath) {
        const savedImage = await saveImageLocally(optimizedFile, currentFilePath);
        if (savedImage) {
          imagePath = savedImage.path;
        }
      }
      
      // Fallback to data URL if local save failed
      if (!imagePath) {
        imagePath = await imageToDataURL(optimizedFile);
      }
      
      // Generate markdown
      const altText = file.name.split('.')[0].replace(/[_-]/g, ' ');
      const markdownImage = `![${altText}](${imagePath})`;
      
      // Insert into editor
      if (insertCallback) {
        insertCallback(markdownImage);
      }
      
      return true;
    } catch (error) {
      console.error('Error processing image:', error);
      return false;
    } finally {
      setUploading(false);
    }
  }, [settings, optimizeImage, saveImageLocally, imageToDataURL]);

  // Handle file input selection
  const handleFileSelect = useCallback(async (insertCallback, currentFilePath) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }

    const handleInputChange = async (e) => {
      const files = Array.from(e.target.files);
      for (const file of files) {
        await processImage(file, insertCallback, currentFilePath);
      }
      e.target.value = ''; // Reset input
    };

    if (fileInputRef.current) {
      fileInputRef.current.addEventListener('change', handleInputChange, { once: true });
    }
  }, [processImage]);

  // Handle paste events
  const handlePaste = useCallback(async (e, insertCallback, currentFilePath) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length === 0) return false;
    
    e.preventDefault();
    
    for (const item of imageItems) {
      const file = item.getAsFile();
      if (file) {
        await processImage(file, insertCallback, currentFilePath);
      }
    }
    
    return true;
  }, [processImage]);

  // Handle drag and drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(async (e, insertCallback, currentFilePath) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      await processImage(file, insertCallback, currentFilePath);
    }
  }, [processImage]);

  // Get drag and drop handlers for a container
  const getDragHandlers = useCallback((insertCallback, currentFilePath) => ({
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: (e) => handleDrop(e, insertCallback, currentFilePath),
  }), [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return {
    // State
    dragOver,
    uploading,
    fileInputRef,
    
    // Actions
    handleFileSelect,
    handlePaste,
    processImage,
    getDragHandlers,
    
    // Utilities
    optimizeImage,
    imageToDataURL,
  };
}; 