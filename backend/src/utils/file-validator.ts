/**
 * File Validator Middleware
 * 
 * Advanced validation and security checks for uploaded files:
 * - Magic number verification (check real file type)
 * - File size validation
 * - Virus scanning hooks
 * - Image dimensions validation
 * - Filename security checks
 * 
 * @module utils/file-validator
 */

import { Request, Response, NextFunction } from 'express';
import { FileTypeResult, fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// ============================================
// CONFIGURATION
// ============================================

const MAX_IMAGE_WIDTH = parseInt(process.env.MAX_IMAGE_WIDTH || '4096');
const MAX_IMAGE_HEIGHT = parseInt(process.env.MAX_IMAGE_HEIGHT || '4096');
const MIN_IMAGE_WIDTH = parseInt(process.env.MIN_IMAGE_WIDTH || '50');
const MIN_IMAGE_HEIGHT = parseInt(process.env.MIN_IMAGE_HEIGHT || '50');

// ============================================
// INTERFACES
// ============================================

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: FileTypeResult;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    aspectRatio?: number;
  };
}

// ============================================
// MAGIC NUMBER VALIDATION
// ============================================

/**
 * Verify file type by reading magic numbers (file signature)
 * Prevents malicious files disguised with fake extensions
 */
export const verifyFileType = async (
  filepath: string,
  expectedMimeTypes: string[]
): Promise<FileValidationResult> => {
  try {
    // Read file buffer
    const buffer = await fs.readFile(filepath);
    
    // Get actual file type from magic numbers
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType) {
      return {
        valid: false,
        error: 'Unable to determine file type. File may be corrupted or unsupported.'
      };
    }

    // Check if detected type matches expected types
    if (!expectedMimeTypes.includes(fileType.mime)) {
      return {
        valid: false,
        error: `File type mismatch. Expected: ${expectedMimeTypes.join(', ')}, Got: ${fileType.mime}`,
        fileType
      };
    }

    return {
      valid: true,
      fileType
    };
  } catch (error: any) {
    return {
      valid: false,
      error: `File validation failed: ${error.message}`
    };
  }
};

// ============================================
// IMAGE VALIDATION
// ============================================

/**
 * Validate image dimensions and format
 * Returns metadata for valid images
 */
export const validateImage = async (
  filepath: string
): Promise<FileValidationResult> => {
  try {
    // Get image metadata using sharp
    const metadata = await sharp(filepath).metadata();

    if (!metadata.width || !metadata.height) {
      return {
        valid: false,
        error: 'Unable to read image dimensions'
      };
    }

    // Check dimensions
    if (metadata.width < MIN_IMAGE_WIDTH || metadata.height < MIN_IMAGE_HEIGHT) {
      return {
        valid: false,
        error: `Image too small. Minimum: ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}px, Got: ${metadata.width}x${metadata.height}px`
      };
    }

    if (metadata.width > MAX_IMAGE_WIDTH || metadata.height > MAX_IMAGE_HEIGHT) {
      return {
        valid: false,
        error: `Image too large. Maximum: ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}px, Got: ${metadata.width}x${metadata.height}px`
      };
    }

    // Calculate aspect ratio
    const aspectRatio = metadata.width / metadata.height;

    return {
      valid: true,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        aspectRatio: Math.round(aspectRatio * 100) / 100
      }
    };
  } catch (error: any) {
    return {
      valid: false,
      error: `Image validation failed: ${error.message}`
    };
  }
};

/**
 * Optimize image (resize, compress)
 * Returns path to optimized image
 */
export const optimizeImage = async (
  sourcePath: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<string> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 85,
    format = 'jpeg'
  } = options;

  const outputPath = sourcePath.replace(
    path.extname(sourcePath),
    `-optimized.${format}`
  );

  await sharp(sourcePath)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFormat(format, { quality })
    .toFile(outputPath);

  return outputPath;
};

// ============================================
// PDF VALIDATION
// ============================================

/**
 * Validate PDF file
 * Checks for PDF signature and basic structure
 */
export const validatePDF = async (
  filepath: string
): Promise<FileValidationResult> => {
  try {
    // Read first 1024 bytes to check PDF header
    const fileHandle = await fs.open(filepath, 'r');
    const buffer = Buffer.alloc(1024);
    await fileHandle.read(buffer, 0, 1024, 0);
    await fileHandle.close();

    // Check PDF signature: %PDF-
    const pdfSignature = buffer.slice(0, 5).toString('utf-8');
    if (!pdfSignature.startsWith('%PDF-')) {
      return {
        valid: false,
        error: 'Invalid PDF file. Missing PDF signature.'
      };
    }

    // Get PDF version
    const version = buffer.slice(5, 8).toString('utf-8').trim();

    // Check for EOF marker (%%EOF)
    const fileSize = (await fs.stat(filepath)).size;
    const endBuffer = Buffer.alloc(1024);
    const endFileHandle = await fs.open(filepath, 'r');
    await endFileHandle.read(endBuffer, 0, 1024, Math.max(0, fileSize - 1024));
    await endFileHandle.close();

    if (!endBuffer.toString('utf-8').includes('%%EOF')) {
      return {
        valid: false,
        error: 'Invalid PDF file. Missing EOF marker.'
      };
    }

    return {
      valid: true,
      metadata: {
        format: `PDF ${version}`,
        size: fileSize
      }
    };
  } catch (error: any) {
    return {
      valid: false,
      error: `PDF validation failed: ${error.message}`
    };
  }
};

// ============================================
// CSV/EXCEL VALIDATION
// ============================================

/**
 * Validate CSV file
 * Basic check for CSV structure
 */
export const validateCSV = async (
  filepath: string
): Promise<FileValidationResult> => {
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    
    // Check if file is empty
    if (content.trim().length === 0) {
      return {
        valid: false,
        error: 'CSV file is empty'
      };
    }

    // Count rows
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return {
        valid: false,
        error: 'CSV must have at least a header row and one data row'
      };
    }

    // Basic validation: Check if all rows have similar column count
    const headerCols = lines[0].split(',').length;
    const invalidRows = lines.slice(1).filter(line => {
      const cols = line.split(',').length;
      return Math.abs(cols - headerCols) > 1; // Allow 1 column difference
    });

    if (invalidRows.length > lines.length * 0.1) {
      // More than 10% of rows have inconsistent columns
      return {
        valid: false,
        error: 'CSV has inconsistent column counts'
      };
    }

    return {
      valid: true,
      metadata: {
        format: 'CSV',
        size: content.length
      }
    };
  } catch (error: any) {
    return {
      valid: false,
      error: `CSV validation failed: ${error.message}`
    };
  }
};

// ============================================
// VIRUS SCANNING HOOK
// ============================================

/**
 * Placeholder for virus scanning integration
 * Integrate with ClamAV or cloud-based scanning service
 */
export const scanForVirus = async (
  filepath: string
): Promise<FileValidationResult> => {
  // TODO: Integrate with virus scanning service
  // Example: ClamAV, VirusTotal API, or AWS GuardDuty
  
  // For now, return valid (placeholder)
  // In production, implement actual scanning
  console.log(`[Virus Scan] Would scan file: ${filepath}`);
  
  return {
    valid: true
  };
};

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Middleware to validate uploaded file after multer processes it
 * Use after multer middleware in route
 */
export const validateUploadedFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
      return;
    }

    // Verify file type by magic numbers
    const mimeValidation = await verifyFileType(file.path, [file.mimetype]);
    if (!mimeValidation.valid) {
      // Delete invalid file
      await fs.unlink(file.path);
      res.status(400).json({
        success: false,
        error: mimeValidation.error
      });
      return;
    }

    // Type-specific validation
    if (file.mimetype.startsWith('image/')) {
      const imageValidation = await validateImage(file.path);
      if (!imageValidation.valid) {
        await fs.unlink(file.path);
        res.status(400).json({
          success: false,
          error: imageValidation.error
        });
        return;
      }
      // Attach metadata to request
      (req as any).fileMetadata = imageValidation.metadata;
    } else if (file.mimetype === 'application/pdf') {
      const pdfValidation = await validatePDF(file.path);
      if (!pdfValidation.valid) {
        await fs.unlink(file.path);
        res.status(400).json({
          success: false,
          error: pdfValidation.error
        });
        return;
      }
      (req as any).fileMetadata = pdfValidation.metadata;
    } else if (file.mimetype === 'text/csv') {
      const csvValidation = await validateCSV(file.path);
      if (!csvValidation.valid) {
        await fs.unlink(file.path);
        res.status(400).json({
          success: false,
          error: csvValidation.error
        });
        return;
      }
      (req as any).fileMetadata = csvValidation.metadata;
    }

    // Virus scanning (placeholder)
    const virusScan = await scanForVirus(file.path);
    if (!virusScan.valid) {
      await fs.unlink(file.path);
      res.status(400).json({
        success: false,
        error: 'File failed security scan'
      });
      return;
    }

    next();
  } catch (error: any) {
    console.error('File validation error:', error);
    
    // Clean up file if it exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'File validation failed',
      details: error.message
    });
  }
};

/**
 * Middleware to validate multiple files
 */
export const validateUploadedFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
      return;
    }

    const validationResults = await Promise.all(
      files.map(async (file) => {
        const mimeValidation = await verifyFileType(file.path, [file.mimetype]);
        return { file, valid: mimeValidation.valid, error: mimeValidation.error };
      })
    );

    const invalidFiles = validationResults.filter(r => !r.valid);

    if (invalidFiles.length > 0) {
      // Delete all uploaded files
      await Promise.all(files.map(f => fs.unlink(f.path).catch(() => {})));
      
      res.status(400).json({
        success: false,
        error: 'Some files failed validation',
        details: invalidFiles.map(f => ({ filename: f.file.originalname, error: f.error }))
      });
      return;
    }

    next();
  } catch (error: any) {
    console.error('Files validation error:', error);
    
    // Clean up all files
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      await Promise.all(files.map(f => fs.unlink(f.path).catch(() => {})));
    }

    res.status(500).json({
      success: false,
      error: 'Files validation failed',
      details: error.message
    });
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get safe filename for storage
 */
export const getSafeFilename = (originalFilename: string): string => {
  return originalFilename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.')
    .slice(0, 255);
};

/**
 * Check if file is suspicious based on patterns
 */
export const isSuspiciousFile = (filename: string): boolean => {
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.php$/i,
    /\.jsp$/i,
    /\.asp$/i,
    /\.aspx$/i,
    /\.dll$/i,
    /\.scr$/i,
    /\.\w+\.\w+$/, // Double extensions (e.g., file.php.jpg)
  ];

  return suspiciousPatterns.some(pattern => pattern.test(filename));
};

export default {
  verifyFileType,
  validateImage,
  validatePDF,
  validateCSV,
  optimizeImage,
  scanForVirus,
  validateUploadedFile,
  validateUploadedFiles,
  getSafeFilename,
  isSuspiciousFile
};
