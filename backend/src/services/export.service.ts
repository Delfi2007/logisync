/**
 * Export Service
 * 
 * Handles data exports:
 * - CSV exports
 * - Excel (XLSX) exports
 * - Support for orders, products, customers, inventory
 * 
 * @module services/export.service
 */

import XLSX from 'xlsx';
import fs from 'fs/promises';
import pool from '../config/database';

// ============================================
// INTERFACES
// ============================================

export interface ExportOptions {
  format: 'csv' | 'xlsx';
  filters?: any;
  columns?: string[];
  includeHeaders?: boolean;
}

export interface ExportResult {
  filePath: string;
  filename: string;
  rowCount: number;
  fileSize: number;
}

// ============================================
// EXPORT SERVICE
// ============================================

class ExportService {
  /**
   * Export orders to CSV/Excel
   */
  async exportOrders(
    user_id: number,
    options: ExportOptions,
    outputPath: string
  ): Promise<ExportResult> {
    // Build query
    let query = `
      SELECT 
        o.id,
        o.order_number,
        o.order_date,
        c.name as customer_name,
        c.phone as customer_phone,
        o.origin,
        o.destination,
        o.status,
        o.total_amount,
        o.payment_status,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.user_id = $1
    `;

    const values: any[] = [user_id];

    // Apply filters
    if (options.filters) {
      if (options.filters.status) {
        query += ` AND o.status = $${values.length + 1}`;
        values.push(options.filters.status);
      }
      if (options.filters.date_from) {
        query += ` AND o.order_date >= $${values.length + 1}`;
        values.push(options.filters.date_from);
      }
      if (options.filters.date_to) {
        query += ` AND o.order_date <= $${values.length + 1}`;
        values.push(options.filters.date_to);
      }
    }

    query += ' ORDER BY o.order_date DESC';

    // Execute query
    const result = await pool.query(query, values);
    const data = result.rows;

    // Export to file
    if (options.format === 'csv') {
      return await this.exportToCSV(data, outputPath, options);
    } else {
      return await this.exportToExcel(data, outputPath, 'Orders', options);
    }
  }

  /**
   * Export products to CSV/Excel
   */
  async exportProducts(
    user_id: number,
    options: ExportOptions,
    outputPath: string
  ): Promise<ExportResult> {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.category,
        p.description,
        p.unit,
        p.cost_price,
        p.selling_price,
        p.current_stock,
        p.reorder_level,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      WHERE p.user_id = $1
    `;

    const values: any[] = [user_id];

    // Apply filters
    if (options.filters) {
      if (options.filters.category) {
        query += ` AND p.category = $${values.length + 1}`;
        values.push(options.filters.category);
      }
      if (options.filters.status) {
        query += ` AND p.status = $${values.length + 1}`;
        values.push(options.filters.status);
      }
      if (options.filters.low_stock) {
        query += ' AND p.current_stock <= p.reorder_level';
      }
    }

    query += ' ORDER BY p.name ASC';

    const result = await pool.query(query, values);
    const data = result.rows;

    if (options.format === 'csv') {
      return await this.exportToCSV(data, outputPath, options);
    } else {
      return await this.exportToExcel(data, outputPath, 'Products', options);
    }
  }

  /**
   * Export customers to CSV/Excel
   */
  async exportCustomers(
    user_id: number,
    options: ExportOptions,
    outputPath: string
  ): Promise<ExportResult> {
    let query = `
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.gstin,
        c.address,
        c.city,
        c.state,
        c.pincode,
        c.customer_type,
        c.credit_limit,
        c.outstanding_balance,
        c.created_at,
        c.updated_at
      FROM customers c
      WHERE c.user_id = $1
    `;

    const values: any[] = [user_id];

    // Apply filters
    if (options.filters) {
      if (options.filters.customer_type) {
        query += ` AND c.customer_type = $${values.length + 1}`;
        values.push(options.filters.customer_type);
      }
      if (options.filters.state) {
        query += ` AND c.state = $${values.length + 1}`;
        values.push(options.filters.state);
      }
    }

    query += ' ORDER BY c.name ASC';

    const result = await pool.query(query, values);
    const data = result.rows;

    if (options.format === 'csv') {
      return await this.exportToCSV(data, outputPath, options);
    } else {
      return await this.exportToExcel(data, outputPath, 'Customers', options);
    }
  }

  /**
   * Export inventory to CSV/Excel
   */
  async exportInventory(
    user_id: number,
    options: ExportOptions,
    outputPath: string
  ): Promise<ExportResult> {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        p.category,
        p.current_stock,
        p.reorder_level,
        p.unit,
        p.cost_price,
        p.selling_price,
        (p.current_stock * p.cost_price) as stock_value,
        CASE 
          WHEN p.current_stock <= 0 THEN 'Out of Stock'
          WHEN p.current_stock <= p.reorder_level THEN 'Low Stock'
          ELSE 'In Stock'
        END as stock_status
      FROM products p
      WHERE p.user_id = $1
    `;

    const values: any[] = [user_id];

    // Apply filters
    if (options.filters) {
      if (options.filters.stock_status === 'low') {
        query += ' AND p.current_stock <= p.reorder_level AND p.current_stock > 0';
      } else if (options.filters.stock_status === 'out') {
        query += ' AND p.current_stock <= 0';
      }
    }

    query += ' ORDER BY p.name ASC';

    const result = await pool.query(query, values);
    const data = result.rows;

    if (options.format === 'csv') {
      return await this.exportToCSV(data, outputPath, options);
    } else {
      return await this.exportToExcel(data, outputPath, 'Inventory', options);
    }
  }

  /**
   * Export order items (detailed) to CSV/Excel
   */
  async exportOrderItems(
    user_id: number,
    options: ExportOptions,
    outputPath: string
  ): Promise<ExportResult> {
    let query = `
      SELECT 
        o.order_number,
        o.order_date,
        c.name as customer_name,
        p.name as product_name,
        p.sku,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        o.status as order_status
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.user_id = $1
    `;

    const values: any[] = [user_id];

    // Apply filters
    if (options.filters) {
      if (options.filters.date_from) {
        query += ` AND o.order_date >= $${values.length + 1}`;
        values.push(options.filters.date_from);
      }
      if (options.filters.date_to) {
        query += ` AND o.order_date <= $${values.length + 1}`;
        values.push(options.filters.date_to);
      }
    }

    query += ' ORDER BY o.order_date DESC, o.order_number ASC';

    const result = await pool.query(query, values);
    const data = result.rows;

    if (options.format === 'csv') {
      return await this.exportToCSV(data, outputPath, options);
    } else {
      return await this.exportToExcel(data, outputPath, 'Order Items', options);
    }
  }

  /**
   * Export to CSV format
   */
  private async exportToCSV(
    data: any[],
    outputPath: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // Get column names
    const columns = options.columns || Object.keys(data[0]);

    // Build CSV content
    let csvContent = '';

    // Add headers
    if (options.includeHeaders !== false) {
      csvContent += columns.map(col => this.escapeCsvValue(col)).join(',') + '\n';
    }

    // Add rows
    data.forEach(row => {
      const values = columns.map(col => {
        const value = row[col];
        return this.escapeCsvValue(value);
      });
      csvContent += values.join(',') + '\n';
    });

    // Write to file
    await fs.writeFile(outputPath, csvContent, 'utf-8');

    // Get file stats
    const stats = await fs.stat(outputPath);

    return {
      filePath: outputPath,
      filename: outputPath.split('/').pop() || outputPath.split('\\').pop() || 'export.csv',
      rowCount: data.length,
      fileSize: stats.size
    };
  }

  /**
   * Export to Excel format
   */
  private async exportToExcel(
    data: any[],
    outputPath: string,
    sheetName: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // Filter columns if specified
    let exportData = data;
    if (options.columns) {
      exportData = data.map(row => {
        const filteredRow: any = {};
        options.columns!.forEach(col => {
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const maxWidth = 50;
    const colWidths: { [key: string]: number } = {};

    // Calculate column widths
    Object.keys(exportData[0]).forEach(key => {
      colWidths[key] = Math.min(
        maxWidth,
        Math.max(
          key.length,
          ...exportData.map(row => String(row[key] || '').length)
        )
      );
    });

    ws['!cols'] = Object.values(colWidths).map(width => ({ wch: width }));

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Write file
    XLSX.writeFile(wb, outputPath);

    // Get file stats
    const stats = await fs.stat(outputPath);

    return {
      filePath: outputPath,
      filename: outputPath.split('/').pop() || outputPath.split('\\').pop() || 'export.xlsx',
      rowCount: data.length,
      fileSize: stats.size
    };
  }

  /**
   * Escape CSV value
   */
  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return '"' + stringValue.replace(/"/g, '""') + '"';
    }

    return stringValue;
  }

  /**
   * Export sales report
   */
  async exportSalesReport(
    user_id: number,
    date_from: string,
    date_to: string,
    outputPath: string,
    format: 'csv' | 'xlsx' = 'xlsx'
  ): Promise<ExportResult> {
    const query = `
      SELECT 
        DATE(o.order_date) as date,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_sales,
        AVG(o.total_amount) as average_order_value,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(oi.quantity) as total_items_sold
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
        AND o.order_date >= $2
        AND o.order_date <= $3
        AND o.status NOT IN ('cancelled', 'refunded')
      GROUP BY DATE(o.order_date)
      ORDER BY date DESC
    `;

    const result = await pool.query(query, [user_id, date_from, date_to]);
    const data = result.rows.map(row => ({
      date: row.date,
      total_orders: parseInt(row.total_orders),
      total_sales: parseFloat(row.total_sales || 0).toFixed(2),
      average_order_value: parseFloat(row.average_order_value || 0).toFixed(2),
      unique_customers: parseInt(row.unique_customers),
      total_items_sold: parseInt(row.total_items_sold || 0)
    }));

    if (format === 'csv') {
      return await this.exportToCSV(data, outputPath, { format: 'csv' });
    } else {
      return await this.exportToExcel(data, outputPath, 'Sales Report', { format: 'xlsx' });
    }
  }

  /**
   * Export customer statement
   */
  async exportCustomerStatement(
    user_id: number,
    customer_id: number,
    date_from: string,
    date_to: string,
    outputPath: string,
    format: 'csv' | 'xlsx' = 'xlsx'
  ): Promise<ExportResult> {
    const query = `
      SELECT 
        o.order_date as date,
        o.order_number as reference,
        'Order' as transaction_type,
        o.total_amount as debit,
        NULL as credit,
        o.payment_status,
        o.status
      FROM orders o
      WHERE o.user_id = $1
        AND o.customer_id = $2
        AND o.order_date >= $3
        AND o.order_date <= $4
      ORDER BY o.order_date DESC
    `;

    const result = await pool.query(query, [user_id, customer_id, date_from, date_to]);
    const data = result.rows;

    if (format === 'csv') {
      return await this.exportToCSV(data, outputPath, { format: 'csv' });
    } else {
      return await this.exportToExcel(data, outputPath, 'Customer Statement', { format: 'xlsx' });
    }
  }

  /**
   * Export inventory valuation
   */
  async exportInventoryValuation(
    user_id: number,
    outputPath: string,
    format: 'csv' | 'xlsx' = 'xlsx'
  ): Promise<ExportResult> {
    const query = `
      SELECT 
        p.category,
        p.name as product_name,
        p.sku,
        p.current_stock,
        p.unit,
        p.cost_price,
        (p.current_stock * p.cost_price) as stock_value,
        p.selling_price,
        (p.current_stock * p.selling_price) as potential_revenue
      FROM products p
      WHERE p.user_id = $1
        AND p.current_stock > 0
      ORDER BY stock_value DESC
    `;

    const result = await pool.query(query, [user_id]);
    const data = result.rows.map(row => ({
      ...row,
      stock_value: parseFloat(row.stock_value || 0).toFixed(2),
      potential_revenue: parseFloat(row.potential_revenue || 0).toFixed(2),
      cost_price: parseFloat(row.cost_price || 0).toFixed(2),
      selling_price: parseFloat(row.selling_price || 0).toFixed(2)
    }));

    if (format === 'csv') {
      return await this.exportToCSV(data, outputPath, { format: 'csv' });
    } else {
      return await this.exportToExcel(data, outputPath, 'Inventory Valuation', { format: 'xlsx' });
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const exportService = new ExportService();

export default exportService;
export { ExportService };
