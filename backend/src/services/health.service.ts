/**
 * Health Check Service
 * 
 * Monitors system health including:
 * - Database connectivity
 * - File system access
 * - Memory usage
 * - CPU usage
 * - External services
 * 
 * @module services/health.service
 */

import pool from '../config/database';
import logger from '../config/logger';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

// ============================================
// INTERFACES
// ============================================

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: HealthCheck;
    fileSystem: HealthCheck;
    memory: HealthCheck;
    storage: HealthCheck;
  };
}

export interface HealthCheck {
  status: 'ok' | 'warning' | 'error';
  message: string;
  responseTime?: number;
  details?: any;
}

// ============================================
// HEALTH SERVICE
// ============================================

class HealthService {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Get overall health status
   */
  async getHealth(): Promise<HealthStatus> {
    const startTime = Date.now();

    // Run all health checks in parallel
    const [database, fileSystem, memory, storage] = await Promise.all([
      this.checkDatabase(),
      this.checkFileSystem(),
      this.checkMemory(),
      this.checkStorage(),
    ]);

    // Determine overall status
    const checks = { database, fileSystem, memory, storage };
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    const hasError = Object.values(checks).some(check => check.status === 'error');
    const hasWarning = Object.values(checks).some(check => check.status === 'warning');

    if (hasError) {
      status = 'unhealthy';
    } else if (hasWarning) {
      status = 'degraded';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      checks,
    };
  }

  /**
   * Check database connectivity
   */
  async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      // Test connection with simple query
      const result = await pool.query('SELECT NOW() as time, version() as version');
      const responseTime = Date.now() - startTime;

      // Check connection pool status
      const poolInfo = {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      };

      // Warn if too many connections
      if (pool.totalCount > 15) {
        return {
          status: 'warning',
          message: 'High number of database connections',
          responseTime,
          details: poolInfo,
        };
      }

      // Warn if slow response
      if (responseTime > 1000) {
        return {
          status: 'warning',
          message: 'Slow database response',
          responseTime,
          details: poolInfo,
        };
      }

      return {
        status: 'ok',
        message: 'Database connection healthy',
        responseTime,
        details: {
          ...poolInfo,
          version: result.rows[0].version.split(' ')[0],
        },
      };
    } catch (error: any) {
      logger.error('Database health check failed', { error: error.message });
      return {
        status: 'error',
        message: 'Database connection failed',
        responseTime: Date.now() - startTime,
        details: { error: error.message },
      };
    }
  }

  /**
   * Check file system access
   */
  async checkFileSystem(): Promise<HealthCheck> {
    const startTime = Date.now();
    const testDir = process.env.UPLOAD_DIR || 'uploads';
    const testFile = path.join(testDir, '.health-check');

    try {
      // Create test directory if not exists
      await fs.mkdir(testDir, { recursive: true });

      // Write test file
      await fs.writeFile(testFile, 'health check', 'utf8');

      // Read test file
      const content = await fs.readFile(testFile, 'utf8');

      // Delete test file
      await fs.unlink(testFile);

      const responseTime = Date.now() - startTime;

      if (content !== 'health check') {
        return {
          status: 'error',
          message: 'File system read/write mismatch',
          responseTime,
        };
      }

      return {
        status: 'ok',
        message: 'File system access healthy',
        responseTime,
      };
    } catch (error: any) {
      logger.error('File system health check failed', { error: error.message });
      return {
        status: 'error',
        message: 'File system access failed',
        responseTime: Date.now() - startTime,
        details: { error: error.message },
      };
    }
  }

  /**
   * Check memory usage
   */
  async checkMemory(): Promise<HealthCheck> {
    const startTime = Date.now();

    try {
      const memUsage = process.memoryUsage();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memPercent = (usedMem / totalMem) * 100;

      const heapPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

      const details = {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
        heapPercent: `${heapPercent.toFixed(2)}%`,
        rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)} MB`,
        systemTotal: `${Math.round(totalMem / 1024 / 1024 / 1024)} GB`,
        systemFree: `${Math.round(freeMem / 1024 / 1024 / 1024)} GB`,
        systemUsed: `${memPercent.toFixed(2)}%`,
      };

      const responseTime = Date.now() - startTime;

      // Warn if heap usage > 85%
      if (heapPercent > 85) {
        return {
          status: 'warning',
          message: 'High memory usage',
          responseTime,
          details,
        };
      }

      // Warn if system memory > 90%
      if (memPercent > 90) {
        return {
          status: 'warning',
          message: 'High system memory usage',
          responseTime,
          details,
        };
      }

      return {
        status: 'ok',
        message: 'Memory usage healthy',
        responseTime,
        details,
      };
    } catch (error: any) {
      logger.error('Memory health check failed', { error: error.message });
      return {
        status: 'error',
        message: 'Memory check failed',
        responseTime: Date.now() - startTime,
        details: { error: error.message },
      };
    }
  }

  /**
   * Check storage space
   */
  async checkStorage(): Promise<HealthCheck> {
    const startTime = Date.now();
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';

    try {
      // Get directory stats
      let totalSize = 0;
      let fileCount = 0;

      const getDirectorySize = async (dir: string): Promise<void> => {
        try {
          const files = await fs.readdir(dir, { withFileTypes: true });

          for (const file of files) {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
              await getDirectorySize(filePath);
            } else {
              const stats = await fs.stat(filePath);
              totalSize += stats.size;
              fileCount++;
            }
          }
        } catch (error) {
          // Directory might not exist yet
        }
      };

      await getDirectorySize(uploadDir);

      const details = {
        uploadDir,
        totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        fileCount,
      };

      const responseTime = Date.now() - startTime;

      // Warn if total size > 1GB
      const sizeInGB = totalSize / 1024 / 1024 / 1024;
      if (sizeInGB > 1) {
        return {
          status: 'warning',
          message: 'High storage usage',
          responseTime,
          details,
        };
      }

      return {
        status: 'ok',
        message: 'Storage usage healthy',
        responseTime,
        details,
      };
    } catch (error: any) {
      logger.error('Storage health check failed', { error: error.message });
      return {
        status: 'error',
        message: 'Storage check failed',
        responseTime: Date.now() - startTime,
        details: { error: error.message },
      };
    }
  }

  /**
   * Get system information
   */
  getSystemInfo(): any {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      nodeVersion: process.version,
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): any {
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();

    return {
      memory: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        external: Math.round(mem.external / 1024 / 1024),
        unit: 'MB',
      },
      cpu: {
        user: Math.round(cpu.user / 1000),
        system: Math.round(cpu.system / 1000),
        unit: 'ms',
      },
      uptime: {
        process: Math.round(process.uptime()),
        system: Math.round(os.uptime()),
        unit: 'seconds',
      },
    };
  }
}

export default new HealthService();
