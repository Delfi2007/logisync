/**
 * Document Service
 * 
 * Business logic for document management:
 * - Document CRUD operations
 * - Version control
 * - Access control
 * - Document search and filtering
 * - Document processing status tracking
 * 
 * @module services/document.service
 */

import pool from '../config/database';
import storageService from './storage.service';
import { formatFileSize } from '../middleware/multer.config';

// ============================================
// INTERFACES
// ============================================

export interface Document {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  storage_type: string;
  document_type?: string;
  entity_type?: string;
  entity_id?: number;
  metadata?: any;
  uploaded_at: Date;
  processed: boolean;
  processed_at?: Date;
  processing_error?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DocumentVersion {
  id: number;
  document_id: number;
  version_number: number;
  filename: string;
  file_size: number;
  storage_path: string;
  uploaded_by: number;
  uploaded_at: Date;
  change_note?: string;
}

export interface CreateDocumentInput {
  user_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  storage_type?: string;
  document_type?: string;
  entity_type?: string;
  entity_id?: number;
  metadata?: any;
}

export interface DocumentSearchFilters {
  user_id?: number;
  document_type?: string;
  entity_type?: string;
  entity_id?: number;
  processed?: boolean;
  date_from?: Date;
  date_to?: Date;
  search?: string;
}

// ============================================
// DOCUMENT SERVICE
// ============================================

class DocumentService {
  /**
   * Create new document record
   */
  async createDocument(input: CreateDocumentInput): Promise<Document> {
    const query = `
      INSERT INTO documents (
        user_id, filename, original_filename, mime_type, file_size,
        storage_path, storage_type, document_type, entity_type, entity_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      input.user_id,
      input.filename,
      input.original_filename,
      input.mime_type,
      input.file_size,
      input.storage_path,
      input.storage_type || 'local',
      input.document_type,
      input.entity_type,
      input.entity_id,
      JSON.stringify(input.metadata || {})
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get document by ID
   */
  async getDocumentById(id: number, user_id?: number): Promise<Document | null> {
    let query = 'SELECT * FROM documents WHERE id = $1';
    const values: any[] = [id];

    if (user_id) {
      query += ' AND user_id = $2';
      values.push(user_id);
    }

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Get documents by filters
   */
  async getDocuments(
    filters: DocumentSearchFilters,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ documents: Document[]; total: number }> {
    let whereConditions: string[] = [];
    let values: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (filters.user_id) {
      whereConditions.push(`user_id = $${paramIndex++}`);
      values.push(filters.user_id);
    }

    if (filters.document_type) {
      whereConditions.push(`document_type = $${paramIndex++}`);
      values.push(filters.document_type);
    }

    if (filters.entity_type) {
      whereConditions.push(`entity_type = $${paramIndex++}`);
      values.push(filters.entity_type);
    }

    if (filters.entity_id) {
      whereConditions.push(`entity_id = $${paramIndex++}`);
      values.push(filters.entity_id);
    }

    if (filters.processed !== undefined) {
      whereConditions.push(`processed = $${paramIndex++}`);
      values.push(filters.processed);
    }

    if (filters.date_from) {
      whereConditions.push(`uploaded_at >= $${paramIndex++}`);
      values.push(filters.date_from);
    }

    if (filters.date_to) {
      whereConditions.push(`uploaded_at <= $${paramIndex++}`);
      values.push(filters.date_to);
    }

    if (filters.search) {
      whereConditions.push(`(original_filename ILIKE $${paramIndex} OR document_type ILIKE $${paramIndex})`);
      values.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM documents ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get documents
    const query = `
      SELECT * FROM documents
      ${whereClause}
      ORDER BY uploaded_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    return {
      documents: result.rows,
      total
    };
  }

  /**
   * Get documents by entity
   */
  async getDocumentsByEntity(
    entity_type: string,
    entity_id: number,
    user_id?: number
  ): Promise<Document[]> {
    let query = 'SELECT * FROM documents WHERE entity_type = $1 AND entity_id = $2';
    const values: any[] = [entity_type, entity_id];

    if (user_id) {
      query += ' AND user_id = $3';
      values.push(user_id);
    }

    query += ' ORDER BY uploaded_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update document
   */
  async updateDocument(
    id: number,
    updates: Partial<Document>,
    user_id?: number
  ): Promise<Document | null> {
    const allowedFields = [
      'document_type', 'entity_type', 'entity_id', 'metadata',
      'processed', 'processing_error'
    ];

    const setClause: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key) && updates[key as keyof Document] !== undefined) {
        setClause.push(`${key} = $${paramIndex++}`);
        const value = key === 'metadata' ? JSON.stringify(updates[key as keyof Document]) : updates[key as keyof Document];
        values.push(value);
      }
    });

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    let query = `
      UPDATE documents
      SET ${setClause.join(', ')}, updated_at = NOW()
      WHERE id = $${paramIndex}
    `;

    if (user_id) {
      query += ` AND user_id = $${paramIndex + 1}`;
      values.push(user_id);
    }

    query += ' RETURNING *';

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Mark document as processed
   */
  async markAsProcessed(
    id: number,
    success: boolean = true,
    error?: string
  ): Promise<Document | null> {
    const query = `
      UPDATE documents
      SET 
        processed = $1,
        processed_at = NOW(),
        processing_error = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [success, error || null, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete document (soft delete - only removes DB record, file remains)
   */
  async deleteDocument(id: number, user_id?: number): Promise<boolean> {
    // First get the document to get storage path
    const document = await this.getDocumentById(id, user_id);
    if (!document) {
      return false;
    }

    // Delete from database
    let query = 'DELETE FROM documents WHERE id = $1';
    const values: any[] = [id];

    if (user_id) {
      query += ' AND user_id = $2';
      values.push(user_id);
    }

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      // Delete physical file
      try {
        await storageService.delete(document.storage_path);
      } catch (error) {
        console.error('Failed to delete physical file:', error);
        // Continue even if file deletion fails
      }
      return true;
    }

    return false;
  }

  /**
   * Create document version
   */
  async createVersion(
    document_id: number,
    uploaded_by: number,
    new_file_path: string,
    file_size: number,
    change_note?: string
  ): Promise<DocumentVersion> {
    const query = `
      INSERT INTO document_versions (
        document_id, filename, file_size, storage_path, uploaded_by, change_note
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const filename = new_file_path.split('/').pop() || new_file_path;
    const values = [document_id, filename, file_size, new_file_path, uploaded_by, change_note];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get document versions
   */
  async getVersions(document_id: number): Promise<DocumentVersion[]> {
    const query = `
      SELECT * FROM document_versions
      WHERE document_id = $1
      ORDER BY version_number DESC
    `;

    const result = await pool.query(query, [document_id]);
    return result.rows;
  }

  /**
   * Get document statistics for user
   */
  async getUserStats(user_id: number): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_documents,
        SUM(file_size) as total_size,
        COUNT(CASE WHEN processed = true THEN 1 END) as processed_count,
        COUNT(CASE WHEN processed = false THEN 1 END) as pending_count,
        COUNT(CASE WHEN document_type = 'invoice' THEN 1 END) as invoice_count,
        COUNT(CASE WHEN document_type = 'product' THEN 1 END) as product_count,
        COUNT(CASE WHEN document_type = 'eway-bill' THEN 1 END) as eway_bill_count
      FROM documents
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [user_id]);
    const stats = result.rows[0];

    return {
      total_documents: parseInt(stats.total_documents || 0),
      total_size: parseInt(stats.total_size || 0),
      total_size_formatted: formatFileSize(parseInt(stats.total_size || 0)),
      processed_count: parseInt(stats.processed_count || 0),
      pending_count: parseInt(stats.pending_count || 0),
      by_type: {
        invoice: parseInt(stats.invoice_count || 0),
        product: parseInt(stats.product_count || 0),
        eway_bill: parseInt(stats.eway_bill_count || 0)
      }
    };
  }

  /**
   * Get recent documents for user
   */
  async getRecentDocuments(user_id: number, limit: number = 10): Promise<Document[]> {
    const query = `
      SELECT * FROM documents
      WHERE user_id = $1
      ORDER BY uploaded_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [user_id, limit]);
    return result.rows;
  }

  /**
   * Get unprocessed documents
   */
  async getUnprocessedDocuments(user_id?: number, limit: number = 50): Promise<Document[]> {
    let query = 'SELECT * FROM documents WHERE processed = false';
    const values: any[] = [];

    if (user_id) {
      query += ' AND user_id = $1';
      values.push(user_id);
    }

    query += ' ORDER BY uploaded_at ASC LIMIT $' + (values.length + 1);
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Bulk delete documents
   */
  async bulkDelete(document_ids: number[], user_id?: number): Promise<number> {
    let query = 'SELECT * FROM documents WHERE id = ANY($1)';
    const values: any[] = [document_ids];

    if (user_id) {
      query += ' AND user_id = $2';
      values.push(user_id);
    }

    // Get documents first
    const documents = await pool.query(query, values);

    if (documents.rows.length === 0) {
      return 0;
    }

    // Delete from database
    const deleteQuery = user_id
      ? 'DELETE FROM documents WHERE id = ANY($1) AND user_id = $2'
      : 'DELETE FROM documents WHERE id = ANY($1)';
    
    const deleteResult = await pool.query(deleteQuery, values);

    // Delete physical files
    const deletePromises = documents.rows.map((doc: Document) =>
      storageService.delete(doc.storage_path).catch((error) => {
        console.error(`Failed to delete file ${doc.storage_path}:`, error);
      })
    );

    await Promise.all(deletePromises);

    return deleteResult.rowCount;
  }

  /**
   * Search documents with full-text search
   */
  async searchDocuments(
    user_id: number,
    searchTerm: string,
    limit: number = 20
  ): Promise<Document[]> {
    const query = `
      SELECT * FROM documents
      WHERE user_id = $1
        AND (
          original_filename ILIKE $2
          OR document_type ILIKE $2
          OR entity_type ILIKE $2
          OR metadata::text ILIKE $2
        )
      ORDER BY uploaded_at DESC
      LIMIT $3
    `;

    const result = await pool.query(query, [user_id, `%${searchTerm}%`, limit]);
    return result.rows;
  }

  /**
   * Get documents grouped by type
   */
  async getDocumentsByType(user_id: number): Promise<any> {
    const query = `
      SELECT 
        document_type,
        COUNT(*) as count,
        SUM(file_size) as total_size
      FROM documents
      WHERE user_id = $1
      GROUP BY document_type
      ORDER BY count DESC
    `;

    const result = await pool.query(query, [user_id]);
    
    return result.rows.map((row: any) => ({
      type: row.document_type || 'unknown',
      count: parseInt(row.count),
      total_size: parseInt(row.total_size || 0),
      total_size_formatted: formatFileSize(parseInt(row.total_size || 0))
    }));
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const documentService = new DocumentService();

export default documentService;
export { DocumentService };
