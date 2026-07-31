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
    const files = Array.from(fileList);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

    for (const file of files) {
      if (!validImageTypes.includes(file.type) && !file.type.startsWith('image/')) {
        continue;
      }

      // Max 10 images limit
      if (this.images.length >= 10) {
        break;
      }

      try {
        const base64 = await this.fileToBase64(file);
        const imageObj = {
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          file: file,
          name: file.name,
          base64: base64,
          isCover: this.images.length === 0, // First image is cover by default
          sizeFormatted: this.formatFileSize(file.size)
        };
        this.images.push(imageObj);
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }

    this.ensureCoverSelected();
    return this.getImages();
  }

  /**
   * Convert a single File to Base64 String
   * @param {File} file 
   * @returns {Promise<string>} Base64 Data URL
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
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
