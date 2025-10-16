/**
 * Storage Service
 * 
 * Handles file storage operations:
 * - Local disk storage
 * - S3/Cloud storage (future)
 * - File retrieval
 * - File deletion
 * - Storage management
 * 
 * @module services/storage.service
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

// ============================================
// CONFIGURATION
// ============================================

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local'; // 'local' or 's3'
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_STORAGE_SIZE = parseInt(process.env.MAX_STORAGE_SIZE || '10737418240'); // 10GB default

// ============================================
// INTERFACES
// ============================================

export interface StorageConfig {
  type: 'local' | 's3' | 'gcs';
  basePath?: string;
  bucket?: string;
  region?: string;
}

export interface StorageMetadata {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  storageType: string;
  checksum: string;
  createdAt: Date;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  usedSpace: number;
  availableSpace: number;
  storageType: string;
}

// ============================================
// LOCAL STORAGE
// ============================================

class LocalStorage {
  private basePath: string;

  constructor(basePath: string = UPLOAD_DIR) {
    this.basePath = basePath;
  }

  /**
   * Save file to local disk
   */
  async save(
    sourcePath: string,
    destinationPath: string,
    metadata?: any
  ): Promise<StorageMetadata> {
    try {
      const fullPath = path.join(this.basePath, destinationPath);
      const directory = path.dirname(fullPath);

      // Ensure directory exists
      await fs.mkdir(directory, { recursive: true });

      // Copy file
      await fs.copyFile(sourcePath, fullPath);

      // Get file stats
      const stats = await fs.stat(fullPath);

      // Calculate checksum
      const checksum = await this.calculateChecksum(fullPath);

      return {
        filename: path.basename(fullPath),
        originalName: metadata?.originalName || path.basename(fullPath),
        mimeType: metadata?.mimeType || 'application/octet-stream',
        size: stats.size,
        storagePath: destinationPath,
        storageType: 'local',
        checksum,
        createdAt: stats.birthtime
      };
    } catch (error: any) {
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Read file from local disk
   */
  async read(filePath: string): Promise<Buffer> {
    try {
      const fullPath = path.join(this.basePath, filePath);
      return await fs.readFile(fullPath);
    } catch (error: any) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  /**
   * Get file stream for efficient reading
   */
  getReadStream(filePath: string) {
    const fullPath = path.join(this.basePath, filePath);
    return createReadStream(fullPath);
  }

  /**
   * Get file write stream
   */
  getWriteStream(filePath: string) {
    const fullPath = path.join(this.basePath, filePath);
    const directory = path.dirname(fullPath);
    
    // Ensure directory exists synchronously
    const mkdirSync = require('fs').mkdirSync;
    mkdirSync(directory, { recursive: true });
    
    return createWriteStream(fullPath);
  }

  /**
   * Delete file from local disk
   */
  async delete(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.basePath, filePath);
      await fs.unlink(fullPath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    }
  }

  /**
   * Check if file exists
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.basePath, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getMetadata(filePath: string): Promise<Partial<StorageMetadata>> {
    try {
      const fullPath = path.join(this.basePath, filePath);
      const stats = await fs.stat(fullPath);
      const checksum = await this.calculateChecksum(fullPath);

      return {
        filename: path.basename(fullPath),
        size: stats.size,
        storagePath: filePath,
        storageType: 'local',
        checksum,
        createdAt: stats.birthtime
      };
    } catch (error: any) {
      throw new Error(`Failed to get metadata: ${error.message}`);
    }
  }

  /**
   * Move file to different location
   */
  async move(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const fullSourcePath = path.join(this.basePath, sourcePath);
      const fullDestPath = path.join(this.basePath, destinationPath);
      const directory = path.dirname(fullDestPath);

      await fs.mkdir(directory, { recursive: true });
      await fs.rename(fullSourcePath, fullDestPath);
    } catch (error: any) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  /**
   * Copy file to different location
   */
  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      const fullSourcePath = path.join(this.basePath, sourcePath);
      const fullDestPath = path.join(this.basePath, destinationPath);
      const directory = path.dirname(fullDestPath);

      await fs.mkdir(directory, { recursive: true });
      await fs.copyFile(fullSourcePath, fullDestPath);
    } catch (error: any) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }

  /**
   * Calculate file checksum (SHA256)
   */
  private async calculateChecksum(filePath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    const stream = createReadStream(filePath);

    for await (const chunk of stream) {
      hash.update(chunk);
    }

    return hash.digest('hex');
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<StorageStats> {
    try {
      let totalFiles = 0;
      let totalSize = 0;

      const countFiles = async (dir: string) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            await countFiles(fullPath);
          } else {
            totalFiles++;
            const stats = await fs.stat(fullPath);
            totalSize += stats.size;
          }
        }
      };

      await countFiles(this.basePath);

      return {
        totalFiles,
        totalSize,
        usedSpace: totalSize,
        availableSpace: MAX_STORAGE_SIZE - totalSize,
        storageType: 'local'
      };
    } catch (error: any) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }

  /**
   * Clean up old temporary files
   */
  async cleanupTemp(maxAgeHours: number = 24): Promise<number> {
    const tempDir = path.join(this.basePath, 'temp');
    let deletedCount = 0;

    try {
      const entries = await fs.readdir(tempDir, { withFileTypes: true });
      const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);

      for (const entry of entries) {
        if (entry.isFile()) {
          const filePath = path.join(tempDir, entry.name);
          const stats = await fs.stat(filePath);

          if (stats.mtimeMs < cutoffTime) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        }
      }

      return deletedCount;
    } catch (error: any) {
      console.error('Cleanup temp files failed:', error);
      return deletedCount;
    }
  }
}

// ============================================
// S3 STORAGE (PLACEHOLDER)
// ============================================

class S3Storage {
  private bucket: string;
  private region: string;

  constructor(config: { bucket: string; region: string }) {
    this.bucket = config.bucket;
    this.region = config.region;
  }

  /**
   * Save file to S3
   * TODO: Implement S3 upload using AWS SDK
   */
  async save(
    sourcePath: string,
    destinationPath: string,
    metadata?: any
  ): Promise<StorageMetadata> {
    throw new Error('S3 storage not implemented yet');
    
    // Implementation example:
    // const s3 = new AWS.S3({ region: this.region });
    // const fileStream = createReadStream(sourcePath);
    // const uploadParams = {
    //   Bucket: this.bucket,
    //   Key: destinationPath,
    //   Body: fileStream,
    //   ContentType: metadata?.mimeType
    // };
    // await s3.upload(uploadParams).promise();
  }

  async read(filePath: string): Promise<Buffer> {
    throw new Error('S3 storage not implemented yet');
  }

  async delete(filePath: string): Promise<void> {
    throw new Error('S3 storage not implemented yet');
  }

  async exists(filePath: string): Promise<boolean> {
    throw new Error('S3 storage not implemented yet');
  }

  async getMetadata(filePath: string): Promise<Partial<StorageMetadata>> {
    throw new Error('S3 storage not implemented yet');
  }
}

// ============================================
// STORAGE SERVICE (FACTORY)
// ============================================

class StorageService {
  private storage: LocalStorage | S3Storage;
  private config: StorageConfig;

  constructor(config?: StorageConfig) {
    this.config = config || {
      type: STORAGE_TYPE as 'local' | 's3',
      basePath: UPLOAD_DIR
    };

    // Initialize appropriate storage backend
    if (this.config.type === 's3') {
      if (!this.config.bucket || !this.config.region) {
        throw new Error('S3 configuration requires bucket and region');
      }
      this.storage = new S3Storage({
        bucket: this.config.bucket,
        region: this.config.region
      });
    } else {
      this.storage = new LocalStorage(this.config.basePath);
    }
  }

  /**
   * Save file to storage
   */
  async save(
    sourcePath: string,
    destinationPath: string,
    metadata?: any
  ): Promise<StorageMetadata> {
    return await this.storage.save(sourcePath, destinationPath, metadata);
  }

  /**
   * Read file from storage
   */
  async read(filePath: string): Promise<Buffer> {
    return await this.storage.read(filePath);
  }

  /**
   * Get file stream
   */
  getReadStream(filePath: string) {
    if (this.storage instanceof LocalStorage) {
      return this.storage.getReadStream(filePath);
    }
    throw new Error('Stream reading not supported for this storage type');
  }

  /**
   * Delete file from storage
   */
  async delete(filePath: string): Promise<void> {
    return await this.storage.delete(filePath);
  }

  /**
   * Check if file exists
   */
  async exists(filePath: string): Promise<boolean> {
    return await this.storage.exists(filePath);
  }

  /**
   * Get file metadata
   */
  async getMetadata(filePath: string): Promise<Partial<StorageMetadata>> {
    return await this.storage.getMetadata(filePath);
  }

  /**
   * Move file (local storage only)
   */
  async move(sourcePath: string, destinationPath: string): Promise<void> {
    if (this.storage instanceof LocalStorage) {
      return await this.storage.move(sourcePath, destinationPath);
    }
    throw new Error('Move operation not supported for this storage type');
  }

  /**
   * Copy file (local storage only)
   */
  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    if (this.storage instanceof LocalStorage) {
      return await this.storage.copy(sourcePath, destinationPath);
    }
    throw new Error('Copy operation not supported for this storage type');
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<StorageStats> {
    if (this.storage instanceof LocalStorage) {
      return await this.storage.getStats();
    }
    throw new Error('Stats not supported for this storage type');
  }

  /**
   * Clean up temporary files
   */
  async cleanupTemp(maxAgeHours: number = 24): Promise<number> {
    if (this.storage instanceof LocalStorage) {
      return await this.storage.cleanupTemp(maxAgeHours);
    }
    return 0;
  }

  /**
   * Generate unique filename
   */
  generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalFilename);
    const nameWithoutExt = path.basename(originalFilename, ext);
    const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    return `${timestamp}-${random}-${sanitized}${ext}`;
  }

  /**
   * Get storage path for file type
   */
  getStoragePath(fileType: string, filename: string): string {
    const subDir = fileType === 'image' ? 'images' : 'documents';
    return path.join(subDir, filename);
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const storageService = new StorageService();

export default storageService;
export { StorageService, LocalStorage, S3Storage };
