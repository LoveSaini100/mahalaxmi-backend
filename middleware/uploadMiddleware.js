const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure destination folders exist
const propertiesUploadDir = path.join(__dirname, '..', 'uploads', 'properties');
const galleryUploadDir = path.join(__dirname, '..', 'uploads', 'gallery');

try {
  if (!fs.existsSync(propertiesUploadDir)) {
    fs.mkdirSync(propertiesUploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Properties upload directory check:', err.message);
}
try {
  if (!fs.existsSync(galleryUploadDir)) {
    fs.mkdirSync(galleryUploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Gallery upload directory check:', err.message);
}

const isVercel = Boolean(process.env.VERCEL);

// Storage for Property Images -> uploads/properties/ (or MemoryStorage for Vercel)
const propertiesStorage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, propertiesUploadDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = `property-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        cb(null, `${uniqueSuffix}${ext}`);
      },
    });

// Storage for Gallery Images -> uploads/gallery/ (or MemoryStorage for Vercel)
const galleryStorage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, galleryUploadDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = `gallery-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        cb(null, `${uniqueSuffix}${ext}`);
      },
    });

// File Filter for Image Type Validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed.'), false);
  }
};

// Multer Upload Instances
const uploadProperties = multer({
  storage: propertiesStorage,
  limits: { fileSize: 500 * 1024 }, // 500 KB
  fileFilter: fileFilter,
});

const uploadGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: 500 * 1024 }, // 500 KB
  fileFilter: fileFilter,
});

// Wrapper Middleware for handling Property upload errors
const handlePropertyImagesUpload = (req, res, next) => {
  const uploadArray = uploadProperties.array('images', 5);

  uploadArray(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Image size must be 500 KB or less.',
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Maximum 5 images are allowed.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed.',
      });
    }

    next();
  });
};

// Wrapper Middleware for Single Gallery Image upload
const handleSingleImageUpload = (req, res, next) => {
  const uploadSingle = uploadGallery.single('image');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Image size must be 500 KB or less.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed.',
      });
    }

    next();
  });
};

module.exports = {
  handlePropertyImagesUpload,
  handleSingleImageUpload,
  propertiesUploadDir,
  galleryUploadDir,
};
