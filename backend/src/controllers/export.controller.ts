/**
 * Export Controller
 * 
 * Handles data export operations
 * 
 * @module controllers/export.controller
 */

import { Request, Response } from 'express';
import path from 'path';
import exportService from '../services/export.service';
import emailService from '../services/email.service';
import storageService from '../services/storage.service';
import { formatFileSize } from '../middleware/multer.config';

// ============================================
// INTERFACES
// ============================================

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// ============================================
// EXPORT CONTROLLER
// ============================================

/**
 * Export orders
 * POST /api/export/orders
 */
export const exportOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    const { format = 'xlsx', filters, email_result } = req.body;

    // Generate filename
    const timestamp = Date.now();
    const filename = `orders-export-${timestamp}.${format}`;
    const outputPath = path.join(process.env.UPLOAD_DIR || 'uploads', 'exports', filename);

    // Export data
    const result = await exportService.exportOrders(
      req.user.id,
      { format, filters },
      outputPath
    );

    // Send email if requested
    if (email_result && req.user.email) {
      await emailService.sendReport(
        req.user.email,
        {
          reportName: 'Orders Export',
          period: filters?.date_from && filters?.date_to 
            ? `${filters.date_from} to ${filters.date_to}`
            : 'All Time',
          summary: `${result.rowCount} orders exported`
        },
        result.filePath,
        result.filename
      );
    }

    res.json({
      success: true,
      message: 'Orders exported successfully',
      data: {
        filename: result.filename,
        row_count: result.rowCount,
        file_size: result.fileSize,
        file_size_formatted: formatFileSize(result.fileSize),
        download_url: `/api/export/download/${filename}`
      }
    });
  } catch (error: any) {
    console.error('Export orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export orders',
      details: error.message
    });
  }
};

/**
 * Export products
 * POST /api/export/products
 */
export const exportProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { format = 'xlsx', filters } = req.body;
    const timestamp = Date.now();
    const filename = `products-export-${timestamp}.${format}`;
    const outputPath = path.join(process.env.UPLOAD_DIR || 'uploads', 'exports', filename);

    const result = await exportService.exportProducts(req.user.id, { format, filters }, outputPath);

    res.json({
      success: true,
      message: 'Products exported successfully',
      data: {
        filename: result.filename,
        row_count: result.rowCount,
        file_size_formatted: formatFileSize(result.fileSize),
        download_url: `/api/export/download/${filename}`
      }
    });
  } catch (error: any) {
    console.error('Export products error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export products',
      details: error.message
    });
  }
};

/**
 * Export customers
 * POST /api/export/customers
 */
export const exportCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { format = 'xlsx', filters } = req.body;
    const timestamp = Date.now();
    const filename = `customers-export-${timestamp}.${format}`;
    const outputPath = path.join(process.env.UPLOAD_DIR || 'uploads', 'exports', filename);

    const result = await exportService.exportCustomers(req.user.id, { format, filters }, outputPath);

    res.json({
      success: true,
      message: 'Customers exported successfully',
      data: {
        filename: result.filename,
        row_count: result.rowCount,
        file_size_formatted: formatFileSize(result.fileSize),
        download_url: `/api/export/download/${filename}`
      }
    });
  } catch (error: any) {
    console.error('Export customers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export customers',
      details: error.message
    });
  }
};

/**
 * Export inventory
 * POST /api/export/inventory
 */
export const exportInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { format = 'xlsx', filters } = req.body;
    const timestamp = Date.now();
    const filename = `inventory-export-${timestamp}.${format}`;
    const outputPath = path.join(process.env.UPLOAD_DIR || 'uploads', 'exports', filename);

    const result = await exportService.exportInventory(req.user.id, { format, filters }, outputPath);

    res.json({
      success: true,
      message: 'Inventory exported successfully',
      data: {
        filename: result.filename,
        row_count: result.rowCount,
        file_size_formatted: formatFileSize(result.fileSize),
        download_url: `/api/export/download/${filename}`
      }
    });
  } catch (error: any) {
    console.error('Export inventory error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export inventory',
      details: error.message
    });
  }
};

/**
 * Export sales report
 * POST /api/export/sales-report
 */
export const exportSalesReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { format = 'xlsx', date_from, date_to } = req.body;

    if (!date_from || !date_to) {
      res.status(400).json({
        success: false,
        error: 'date_from and date_to are required'
      });
      return;
    }

    const timestamp = Date.now();
    const filename = `sales-report-${timestamp}.${format}`;
    const outputPath = path.join(process.env.UPLOAD_DIR || 'uploads', 'exports', filename);

    const result = await exportService.exportSalesReport(
      req.user.id,
      date_from,
      date_to,
      outputPath,
      format
    );

    res.json({
      success: true,
      message: 'Sales report exported successfully',
      data: {
        filename: result.filename,
        row_count: result.rowCount,
        file_size_formatted: formatFileSize(result.fileSize),
        download_url: `/api/export/download/${filename}`
      }
    });
  } catch (error: any) {
    console.error('Export sales report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export sales report',
      details: error.message
    });
  }
};

/**
 * Download exported file
 * GET /api/export/download/:filename
 */
export const downloadExport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;

    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    // Security: Validate filename (no path traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
      return;
    }

    const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', 'exports', filename);

    // Check if file exists
    const exists = await storageService.exists(`exports/${filename}`);
    if (!exists) {
      res.status(404).json({
        success: false,
        error: 'File not found'
      });
      return;
    }

    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.csv' 
      ? 'text/csv' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream file
    const stream = storageService.getReadStream(`exports/${filename}`);
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
    console.error('Download export error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to download export',
        details: error.message
      });
    }
  }
};

export default {
  exportOrders,
  exportProducts,
  exportCustomers,
  exportInventory,
  exportSalesReport,
  downloadExport
};
