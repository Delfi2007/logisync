/**
 * Upload Controller
 * 
 * Handles file upload operations:
 * - Single/multiple file uploads
 * - File download
 * - File deletion
 * - Document management
 * 
 * @module controllers/upload.controller
 */

import { Request, Response } from 'express';
import path from 'path';
import documentService from '../services/document.service';
import storageService from '../services/storage.service';
import { formatFileSize, getFileCategory } from '../middleware/multer.config';

// ============================================
// INTERFACES
// ============================================

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
  fileMetadata?: any;
}

// ============================================
// UPLOAD CONTROLLER
// ============================================

/**
 * Upload single file
 * POST /api/upload
 */
export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const file = req.file;
    const { document_type, entity_type, entity_id } = req.body;

    // Create document record
    const document = await documentService.createDocument({
      user_id: req.user.id,
      filename: file.filename,
      original_filename: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      storage_path: file.path,
      storage_type: 'local',
      document_type: document_type || getFileCategory(file.mimetype),
      entity_type: entity_type || undefined,
      entity_id: entity_id ? parseInt(entity_id) : undefined,
      metadata: {
        ...req.fileMetadata,
        upload_ip: req.ip,
        user_agent: req.get('user-agent')
      }
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: document.id,
        filename: document.filename,
        original_filename: document.original_filename,
        mime_type: document.mime_type,
        file_size: document.file_size,
        file_size_formatted: formatFileSize(document.file_size),
        document_type: document.document_type,
        uploaded_at: document.uploaded_at,
        download_url: `/api/upload/${document.id}/download`
      }
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      details: error.message
    });
  }
};

/**
 * Upload multiple files
 * POST /api/upload/multiple
 */
export const uploadMultipleFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const { document_type, entity_type, entity_id } = req.body;

    // Create document records for all files
    const documents = await Promise.all(
      files.map(file =>
        documentService.createDocument({
          user_id: req.user!.id,
          filename: file.filename,
          original_filename: file.originalname,
          mime_type: file.mimetype,
          file_size: file.size,
          storage_path: file.path,
          storage_type: 'local',
          document_type: document_type || getFileCategory(file.mimetype),
          entity_type: entity_type || undefined,
          entity_id: entity_id ? parseInt(entity_id) : undefined,
          metadata: {
            upload_ip: req.ip,
            user_agent: req.get('user-agent')
          }
        })
      )
    );

    res.status(201).json({
      success: true,
      message: `${documents.length} files uploaded successfully`,
      data: documents.map(doc => ({
        id: doc.id,
        filename: doc.filename,
        original_filename: doc.original_filename,
        mime_type: doc.mime_type,
        file_size: doc.file_size,
        file_size_formatted: formatFileSize(doc.file_size),
        document_type: doc.document_type,
        uploaded_at: doc.uploaded_at,
        download_url: `/api/upload/${doc.id}/download`
      }))
    });
  } catch (error: any) {
    console.error('Multiple files upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload files',
      details: error.message
    });
  }
};

/**
 * Get document by ID
 * GET /api/upload/:id
 */
export const getDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const document = await documentService.getDocumentById(parseInt(id), req.user.id);

    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        ...document,
        file_size_formatted: formatFileSize(document.file_size),
        download_url: `/api/upload/${document.id}/download`
      }
    });
  } catch (error: any) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get document',
      details: error.message
    });
  }
};

/**
 * Download document
 * GET /api/upload/:id/download
 */
export const downloadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const document = await documentService.getDocumentById(parseInt(id), req.user.id);

    if (!document) {
      res.status(404).json({
        success: false,
        error: 'Document not found'
      });
      return;
    }

    // Check if file exists
    const fileExists = await storageService.exists(document.storage_path);
    if (!fileExists) {
      res.status(404).json({
        success: false,
        error: 'File not found on storage'
      });
      return;
    }

    // Set headers for download
    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${document.original_filename}"`);
    res.setHeader('Content-Length', document.file_size);

    // Stream file to response
    const stream = storageService.getReadStream(document.storage_path);
    stream.pipe(res);

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to download file'
        });
      }
    });
  } catch (error: any) {
    console.error('Download document error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to download document',
        details: error.message
      });
    }
  }
};

/**
 * Delete document
 * DELETE /api/upload/:id
 */
export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const deleted = await documentService.deleteDocument(parseInt(id), req.user.id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Document not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document',
      details: error.message
    });
  }
};

/**
 * List user's documents
 * GET /api/upload/list
 */
export const listDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const { 
      document_type, 
      entity_type, 
      entity_id, 
      processed,
      search,
      limit = '50', 
      offset = '0' 
    } = req.query;

    const filters: any = {
      user_id: req.user.id
    };

    if (document_type) filters.document_type = document_type as string;
    if (entity_type) filters.entity_type = entity_type as string;
    if (entity_id) filters.entity_id = parseInt(entity_id as string);
    if (processed !== undefined) filters.processed = processed === 'true';
    if (search) filters.search = search as string;

    const result = await documentService.getDocuments(
      filters,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({
      success: true,
      data: result.documents.map(doc => ({
        ...doc,
        file_size_formatted: formatFileSize(doc.file_size),
        download_url: `/api/upload/${doc.id}/download`
      })),
      pagination: {
        total: result.total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        has_more: result.total > parseInt(offset as string) + parseInt(limit as string)
      }
    });
  } catch (error: any) {
    console.error('List documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list documents',
      details: error.message
    });
  }
};

/**
 * Get user document statistics
 * GET /api/upload/stats
 */
export const getDocumentStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const stats = await documentService.getUserStats(req.user.id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Get document stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get document statistics',
      details: error.message
    });
  }
};

/**
 * Get documents by entity
 * GET /api/upload/entity/:entity_type/:entity_id
 */
export const getDocumentsByEntity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { entity_type, entity_id } = req.params;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const documents = await documentService.getDocumentsByEntity(
      entity_type,
      parseInt(entity_id),
      req.user.id
    );

    res.json({
      success: true,
      data: documents.map(doc => ({
        ...doc,
        file_size_formatted: formatFileSize(doc.file_size),
        download_url: `/api/upload/${doc.id}/download`
      }))
    });
  } catch (error: any) {
    console.error('Get documents by entity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get documents',
      details: error.message
    });
  }
};

/**
 * Bulk delete documents
 * POST /api/upload/bulk-delete
 */
export const bulkDeleteDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { document_ids } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    if (!Array.isArray(document_ids) || document_ids.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid document_ids array'
      });
      return;
    }

    const deletedCount = await documentService.bulkDelete(document_ids, req.user.id);

    res.json({
      success: true,
      message: `${deletedCount} documents deleted successfully`,
      data: {
        deleted_count: deletedCount
      }
    });
  } catch (error: any) {
    console.error('Bulk delete documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete documents',
      details: error.message
    });
  }
};

export default {
  uploadFile,
  uploadMultipleFiles,
  getDocument,
  downloadDocument,
  deleteDocument,
  listDocuments,
  getDocumentStats,
  getDocumentsByEntity,
  bulkDeleteDocuments
};
