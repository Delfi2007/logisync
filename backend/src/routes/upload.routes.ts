/**
 * Upload Routes
 * 
 * File upload and document management endpoints
 * 
 * @module routes/upload.routes
 */

import express from 'express';
import { authenticate } from '../middleware/auth.enhanced';
import { apiRateLimiter, uploadRateLimiter } from '../middleware/rateLimiter';
import { upload, uploadImage, uploadDocument } from '../middleware/multer.config';
import { validateUploadedFile, validateUploadedFiles } from '../utils/file-validator';
import uploadController from '../controllers/upload.controller';

const router = express.Router();

// ============================================
// ROUTES
// ============================================

/**
 * @route   POST /api/upload
 * @desc    Upload single file
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  uploadRateLimiter,
  upload.single('file'),
  validateUploadedFile,
  uploadController.uploadFile
);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files
 * @access  Private
 */
router.post(
  '/multiple',
  authenticate,
  uploadRateLimiter,
  upload.array('files', 10), // Max 10 files
  validateUploadedFiles,
  uploadController.uploadMultipleFiles
);

/**
 * @route   POST /api/upload/image
 * @desc    Upload image file
 * @access  Private
 */
router.post(
  '/image',
  authenticate,
  uploadRateLimiter,
  uploadImage.single('image'),
  validateUploadedFile,
  uploadController.uploadFile
);

/**
 * @route   POST /api/upload/document
 * @desc    Upload document file (PDF, Excel, CSV)
 * @access  Private
 */
router.post(
  '/document',
  authenticate,
  uploadRateLimiter,
  uploadDocument.single('document'),
  validateUploadedFile,
  uploadController.uploadFile
);

/**
 * @route   GET /api/upload/list
 * @desc    List user's documents with filters
 * @access  Private
 */
router.get(
  '/list',
  authenticate,
  apiRateLimiter,
  uploadController.listDocuments
);

/**
 * @route   GET /api/upload/stats
 * @desc    Get user document statistics
 * @access  Private
 */
router.get(
  '/stats',
  authenticate,
  apiRateLimiter,
  uploadController.getDocumentStats
);

/**
 * @route   GET /api/upload/entity/:entity_type/:entity_id
 * @desc    Get documents by entity (order, product, customer)
 * @access  Private
 */
router.get(
  '/entity/:entity_type/:entity_id',
  authenticate,
  apiRateLimiter,
  uploadController.getDocumentsByEntity
);

/**
 * @route   GET /api/upload/:id
 * @desc    Get document by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  apiRateLimiter,
  uploadController.getDocument
);

/**
 * @route   GET /api/upload/:id/download
 * @desc    Download document file
 * @access  Private
 */
router.get(
  '/:id/download',
  authenticate,
  apiRateLimiter,
  uploadController.downloadDocument
);

/**
 * @route   DELETE /api/upload/:id
 * @desc    Delete document
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  apiRateLimiter,
  uploadController.deleteDocument
);

/**
 * @route   POST /api/upload/bulk-delete
 * @desc    Bulk delete documents
 * @access  Private
 */
router.post(
  '/bulk-delete',
  authenticate,
  apiRateLimiter,
  uploadController.bulkDeleteDocuments
);

export default router;
