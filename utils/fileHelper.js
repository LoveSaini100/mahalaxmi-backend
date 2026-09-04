const fs = require('fs');
const path = require('path');

/**
 * Safely removes a file from the backend uploads directory.
 * @param {string} filePath - Path to file e.g. "/uploads/properties/property-123.jpg" or "/uploads/gallery/gallery-123.jpg"
 */
const deletePhysicalFile = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return;

  try {
    const sanitizedPath = filePath.replace(/^[\/\\]/, '');
    const filename = path.basename(sanitizedPath);

    // Candidates to search for deletion
    const candidatePaths = [
      path.isAbsolute(sanitizedPath) ? sanitizedPath : path.join(__dirname, '..', sanitizedPath),
      path.join(__dirname, '..', 'uploads', 'properties', filename),
      path.join(__dirname, '..', 'uploads', 'gallery', filename),
      path.join(__dirname, '..', 'uploads', filename),
    ];

    for (const targetPath of candidatePaths) {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        console.log(`Successfully deleted physical image: ${targetPath}`);
        return;
      }
    }

    console.warn(`Physical image not found on disk, skipping unlink: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting physical image ${filePath}:`, error.message);
  }
};

/**
 * Deletes multiple physical files given an array of relative image URLs.
 * @param {string[]} imagePaths 
 */
const deleteMultipleFiles = (imagePaths) => {
  if (Array.isArray(imagePaths) && imagePaths.length > 0) {
    imagePaths.forEach((img) => deletePhysicalFile(img));
  }
};

module.exports = {
  deletePhysicalFile,
  deleteMultipleFiles,
};
