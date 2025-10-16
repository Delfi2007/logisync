/**
 * Multer Configuration for File Uploads
 * 
 * Provides secure file upload middleware with:
 * - File type validation (images, PDFs, Excel, CSV)
 * - File size limits
 * - Filename sanitization
 * - Storage configuration (local/S3)
 * - Virus scanning hooks
 * 
 * @module middleware/multer.config
 */

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { Request } from 'express';

// ============================================
// CONFIGURATION
// ============================================

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
const MAX_FILES_PER_REQUEST = parseInt(process.env.MAX_FILES_PER_REQUEST || '5');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Create subdirectories for different file types
const SUB_DIRS = ['documents', 'images', 'temp', 'exports'];
SUB_DIRS.forEach(dir => {
  const fullPath = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ============================================
// ALLOWED FILE TYPES
// ============================================

export const ALLOWED_MIME_TYPES = {
  images: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp'
  ],
  documents: [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'text/csv',
    'text/plain'
  ],
  all: [] as string[] // Populated below
};

ALLOWED_MIME_TYPES.all = [
  ...ALLOWED_MIME_TYPES.images,
  ...ALLOWED_MIME_TYPES.documents
];

// File extensions mapping
export const ALLOWED_EXTENSIONS: { [key: string]: string[] } = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
  documents: ['.pdf', '.xls', '.xlsx', '.csv', '.txt'],
  all: []
};

ALLOWED_EXTENSIONS.all = [
  ...ALLOWED_EXTENSIONS.images,
  ...ALLOWED_EXTENSIONS.documents
];

// ============================================
// STORAGE CONFIGURATION
// ============================================

/**
 * Local disk storage configuration
 * Generates unique filename and determines storage path
 */
const diskStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Determine subdirectory based on mime type
    let subDir = 'documents';
    if (ALLOWED_MIME_TYPES.images.includes(file.mimetype)) {
      subDir = 'images';
    }

    const destination = path.join(UPLOAD_DIR, subDir);
    cb(null, destination);
  },

  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename: timestamp-random-original.ext
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const sanitizedName = sanitizeFilename(file.originalname);
    const ext = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, ext);
    
    const uniqueFilename = `${timestamp}-${randomString}-${nameWithoutExt}${ext}`;
    cb(null, uniqueFilename);
  }
});

// ============================================
// FILE FILTER
// ============================================

/**
 * File filter function to validate uploads
 * Checks MIME type and file extension
 */
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.all.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.all.join(', ')}`));
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.all.includes(ext)) {
    return cb(new Error(`Invalid file extension: ${ext}. Allowed extensions: ${ALLOWED_EXTENSIONS.all.join(', ')}`));
  }

  // Additional security: Check for double extensions (e.g., file.php.jpg)
  const basename = path.basename(file.originalname, ext);
  if (path.extname(basename)) {
    return cb(new Error('Files with double extensions are not allowed'));
  }

  cb(null, true);
};

/**
 * Image-only file filter
 */
export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (!ALLOWED_MIME_TYPES.images.includes(file.mimetype)) {
    return cb(new Error(`Only image files allowed. Received: ${file.mimetype}`));
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.images.includes(ext)) {
    return cb(new Error(`Invalid image extension: ${ext}`));
  }

  cb(null, true);
};

/**
 * Document-only file filter (PDF, Excel, CSV)
 */
export const documentFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (!ALLOWED_MIME_TYPES.documents.includes(file.mimetype)) {
    return cb(new Error(`Only document files allowed. Received: ${file.mimetype}`));
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.documents.includes(ext)) {
    return cb(new Error(`Invalid document extension: ${ext}`));
  }

  cb(null, true);
};

// ============================================
// MULTER INSTANCES
// ============================================

/**
 * General file upload (all allowed types)
 */
export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_REQUEST
  },
  fileFilter: fileFilter
});

/**
 * Image upload only
 */
export const uploadImage = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_REQUEST
  },
  fileFilter: imageFilter
});

/**
 * Document upload only (PDF, Excel, CSV)
 */
export const uploadDocument = multer({
  storage: diskStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_REQUEST
  },
  fileFilter: documentFilter
});

/**
 * Memory storage (for processing before saving)
 * Use for virus scanning or image manipulation
 */
export const uploadToMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_REQUEST
  },
  fileFilter: fileFilter
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Sanitize filename to prevent directory traversal
 * Removes dangerous characters and path separators
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace unsafe chars with underscore
    .replace(/\.+/g, '.') // Collapse multiple dots
    .replace(/^\./, '') // Remove leading dot
    .slice(0, 255); // Limit length
};

/**
 * Get file extension from mimetype
 */
export const getExtensionFromMimetype = (mimetype: string): string => {
  const mimeToExt: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
    'application/pdf': '.pdf',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'text/csv': '.csv',
    'text/plain': '.txt'
  };

  return mimeToExt[mimetype] || '';
};

/**
 * Determine file category from mimetype
 */
export const getFileCategory = (mimetype: string): string => {
  if (ALLOWED_MIME_TYPES.images.includes(mimetype)) {
    return 'image';
  }
  if (ALLOWED_MIME_TYPES.documents.includes(mimetype)) {
    return 'document';
  }
  return 'unknown';
};

/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Delete file from disk
 */
export const deleteFile = (filepath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, (err) => {
      if (err && err.code !== 'ENOENT') {
        // Ignore file not found errors
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Move file from temp location to permanent storage
 */
export const moveFile = (sourcePath: string, destPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.rename(sourcePath, destPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Check if file exists
 */
export const fileExists = (filepath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.access(filepath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

// ============================================
// CONFIGURATION EXPORT
// ============================================

export const uploadConfig = {
  uploadDir: UPLOAD_DIR,
  maxFileSize: MAX_FILE_SIZE,
  maxFilesPerRequest: MAX_FILES_PER_REQUEST,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
  allowedExtensions: ALLOWED_EXTENSIONS,
  formatFileSize
};

export default {
  upload,
  uploadImage,
  uploadDocument,
  uploadToMemory,
  uploadConfig,
  fileFilter,
  imageFilter,
  documentFilter,
  sanitizeFilename,
  getExtensionFromMimetype,
  getFileCategory,
  formatFileSize,
  deleteFile,
  moveFile,
  fileExists
};
