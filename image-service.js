/**
 * Once Gown - Isolated Image Service
 * 
 * Converts selected images into Base64 strings and manages image previews,
 * reordering, cover image designation, and compression limits.
 * 
 * Isolated behind an interface pattern so it can later be swapped with 
 * Firebase Storage uploading without altering any UI components.
 */

class ImageService {
  constructor() {
    this.images = []; // Array of { id, file, base64, isCover, sizeFormatted }
  }

  /**
   * Process array of File objects selected by user
   * @param {FileList|File[]} fileList 
   * @returns {Promise<Array>} List of processed image objects
   */
  async processFiles(fileList) {
    if (!fileList || fileList.length === 0) return this.getImages();
    const files = Array.from(fileList);

    for (const file of files) {
      // Robust image check (accepts missing mime types, mobile gallery files, and extension matches)
      const isImage = (file.type && file.type.startsWith('image/')) ||
                      (file.name && file.name.match(/\.(jpg|jpeg|png|webp|heic|heif|bmp|gif|jfif|avif)$/i)) ||
                      (!file.type && !file.name);

      if (!isImage) {
        continue;
      }

      // Max 10 images limit
      if (this.images.length >= 10) {
        break;
      }

      try {
        const base64 = await this.compressImage(file, 1200, 0.85);
        if (base64) {
          const imageObj = {
            id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            file: file,
            name: file.name || `صورة_${this.images.length + 1}.jpg`,
            base64: base64,
            isCover: this.images.length === 0, // First image is cover by default
            sizeFormatted: this.formatFileSize(file.size || 100000)
          };
          this.images.push(imageObj);
        }
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }

    this.ensureCoverSelected();
    return this.getImages();
  }

  /**
   * Compress File object to optimized JPEG Base64 with safe raw fallback
   * @param {File} file 
   * @param {number} maxWidth Max dimension in px
   * @param {number} quality JPEG quality (0 to 1)
   * @returns {Promise<string>} Base64 Data URL
   */
  compressImage(file, maxWidth = 1200, quality = 0.85) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawBase64 = e.target.result;
        if (!rawBase64) {
          resolve('');
          return;
        }

        const img = new Image();
        img.onload = () => {
          try {
            let width = img.width || 800;
            let height = img.height || 600;

            if (width > maxWidth || height > maxWidth) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxWidth) / height);
                height = maxWidth;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64 || rawBase64);
          } catch (err) {
            console.warn('Canvas compression fallback to raw base64:', err);
            resolve(rawBase64);
          }
        };
        img.onerror = () => resolve(rawBase64); // Fallback to raw if canvas cannot draw (e.g. HEIC)
        img.src = rawBase64;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  /**
   * Remove image by ID
   * @param {string} id 
   */
  removeImage(id) {
    const wasCover = this.images.find(img => img.id === id)?.isCover;
    this.images = this.images.filter(img => img.id !== id);
    if (wasCover && this.images.length > 0) {
      this.images[0].isCover = true;
    }
    return this.getImages();
  }

  /**
   * Set specific image as Cover image (main display image)
   * @param {string} id 
   */
  setCover(id) {
    this.images.forEach(img => {
      img.isCover = (img.id === id);
    });
    // Move cover image to the first position
    const coverIdx = this.images.findIndex(img => img.isCover);
    if (coverIdx > 0) {
      const [coverItem] = this.images.splice(coverIdx, 1);
      this.images.unshift(coverItem);
    }
    return this.getImages();
  }

  /**
   * Move image up or down in order
   * @param {string} id 
   * @param {number} direction -1 for up/left, 1 for down/right
   */
  reorderImage(id, direction) {
    const index = this.images.findIndex(img => img.id === id);
    if (index === -1) return this.getImages();

    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < this.images.length) {
      const [movedItem] = this.images.splice(index, 1);
      this.images.splice(newIndex, 0, movedItem);
    }

    this.ensureCoverSelected();
    return this.getImages();
  }

  /**
   * Get all images metadata and Base64 strings
   */
  getImages() {
    return [...this.images];
  }

  /**
   * Get array of Base64 strings for Firebase Storage/Firestore payload
   * @returns {string[]} Array of Base64 data URLs
   */
  getBase64Payload() {
    return this.images.map(img => img.base64);
  }

  /**
   * Reset service
   */
  clear() {
    this.images = [];
  }

  /**
   * Load existing Base64 strings (for draft restoration)
   * @param {string[]} base64List 
   */
  loadBase64List(base64List) {
    if (!Array.isArray(base64List)) return;
    this.images = base64List.map((b64, idx) => ({
      id: 'img_restored_' + idx + '_' + Date.now(),
      file: null,
      name: `صورة_${idx + 1}.jpg`,
      base64: b64,
      isCover: idx === 0,
      sizeFormatted: 'محررة'
    }));
  }

  ensureCoverSelected() {
    if (this.images.length > 0) {
      const hasCover = this.images.some(img => img.isCover);
      if (!hasCover) {
        this.images[0].isCover = true;
      }
    }
  }

  formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
