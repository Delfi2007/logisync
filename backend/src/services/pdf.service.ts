/**
 * PDF Generation Service
 * 
 * Generates PDF documents:
 * - GST-compliant invoices
 * - Delivery challans
 * - Reports
 * - QR codes for UPI payments
 * 
 * @module services/pdf.service
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { formatFileSize } from '../middleware/multer.config';

// ============================================
// INTERFACES
// ============================================

export interface InvoiceData {
  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  poNumber?: string;
  
  // Company details
  companyName: string;
  companyAddress: string;
  companyGSTIN: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo?: string;
  
  // Customer details
  customerName: string;
  customerAddress: string;
  customerGSTIN?: string;
  customerPhone?: string;
  customerEmail?: string;
  
  // Line items
  items: InvoiceItem[];
  
  // Amounts
  subtotal: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTax: number;
  totalAmount: number;
  
  // Payment
  paymentTerms?: string;
  bankDetails?: BankDetails;
  upiId?: string;
  
  // Notes
  notes?: string;
  termsAndConditions?: string;
}

export interface InvoiceItem {
  sno: number;
  description: string;
  hsnCode?: string;
  quantity: number;
  unit: string;
  rate: number;
  discount?: number;
  taxRate: number;
  amount: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  period: string;
  generatedDate: string;
  sections: ReportSection[];
  summary?: any;
}

export interface ReportSection {
  title: string;
  type: 'table' | 'text' | 'chart';
  data: any;
}

// ============================================
// PDF SERVICE
// ============================================

class PDFService {
  /**
   * Generate GST-compliant invoice PDF
   */
  async generateInvoice(data: InvoiceData, outputPath: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A4',
          margin: 50,
          info: {
            Title: `Invoice ${data.invoiceNumber}`,
            Author: data.companyName
          }
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Header
        await this.addInvoiceHeader(doc, data);

        // Company and customer details
        this.addCompanyDetails(doc, data);
        this.addCustomerDetails(doc, data);

        // Invoice details
        this.addInvoiceDetails(doc, data);

        // Line items table
        this.addItemsTable(doc, data);

        // Totals
        this.addTotals(doc, data);

        // Payment details and QR code
        if (data.upiId || data.bankDetails) {
          await this.addPaymentDetails(doc, data);
        }

        // Notes and terms
        this.addNotesAndTerms(doc, data);

        // Footer
        this.addFooter(doc, data);

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Add invoice header with company logo
   */
  private async addInvoiceHeader(doc: PDFKit.PDFDocument, data: InvoiceData): Promise<void> {
    // Add logo if provided
    if (data.companyLogo && fs.existsSync(data.companyLogo)) {
      doc.image(data.companyLogo, 50, 45, { width: 80 });
      doc.moveDown(3);
    }

    // Tax Invoice title
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('TAX INVOICE', { align: 'center' })
       .moveDown(0.5);

    doc.fontSize(10)
       .font('Helvetica')
       .text('(Original for Recipient)', { align: 'center' })
       .moveDown(1);

    // Horizontal line
    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke()
       .moveDown(1);
  }

  /**
   * Add company details
   */
  private addCompanyDetails(doc: PDFKit.PDFDocument, data: InvoiceData): void {
    const startY = doc.y;

    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('From:', 50, startY);

    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text(data.companyName, 50, startY + 20);

    doc.fontSize(9)
       .font('Helvetica')
       .text(data.companyAddress, 50, startY + 35, { width: 250 });

    doc.text(`GSTIN: ${data.companyGSTIN}`, 50, startY + 65);
    doc.text(`Phone: ${data.companyPhone}`, 50, startY + 80);
    doc.text(`Email: ${data.companyEmail}`, 50, startY + 95);
  }

  /**
   * Add customer details
   */
  private addCustomerDetails(doc: PDFKit.PDFDocument, data: InvoiceData): void {
    const startY = doc.y - 110; // Align with company details

    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Bill To:', 320, startY);

    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text(data.customerName, 320, startY + 20);

    doc.fontSize(9)
       .font('Helvetica')
       .text(data.customerAddress, 320, startY + 35, { width: 225 });

    if (data.customerGSTIN) {
      doc.text(`GSTIN: ${data.customerGSTIN}`, 320, startY + 65);
    }
    if (data.customerPhone) {
      doc.text(`Phone: ${data.customerPhone}`, 320, startY + 80);
    }
    if (data.customerEmail) {
      doc.text(`Email: ${data.customerEmail}`, 320, startY + 95);
    }

    doc.moveDown(2);
  }

  /**
   * Add invoice details (number, date, etc.)
   */
  private addInvoiceDetails(doc: PDFKit.PDFDocument, data: InvoiceData): void {
    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke()
       .moveDown(0.5);

    const detailsY = doc.y;

    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text('Invoice No:', 50, detailsY)
       .font('Helvetica')
       .text(data.invoiceNumber, 130, detailsY);

    doc.font('Helvetica-Bold')
       .text('Invoice Date:', 320, detailsY)
       .font('Helvetica')
       .text(data.invoiceDate, 400, detailsY);

    doc.font('Helvetica-Bold')
       .text('Due Date:', 50, detailsY + 15)
       .font('Helvetica')
       .text(data.dueDate, 130, detailsY + 15);

    if (data.poNumber) {
      doc.font('Helvetica-Bold')
         .text('PO Number:', 320, detailsY + 15)
         .font('Helvetica')
         .text(data.poNumber, 400, detailsY + 15);
    }

    doc.moveDown(2);

    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke()
       .moveDown(0.5);
  }

  /**
   * Add line items table
   */
  private addItemsTable(doc: PDFKit.PDFDocument, data: InvoiceData): void {
    const tableTop = doc.y;
    const tableHeaders = ['S.No', 'Description', 'HSN', 'Qty', 'Unit', 'Rate', 'Tax', 'Amount'];
    const columnWidths = [30, 150, 60, 40, 40, 60, 45, 70];
    let xPosition = 50;

    // Table header
    doc.fontSize(9).font('Helvetica-Bold');
    tableHeaders.forEach((header, i) => {
      doc.text(header, xPosition, tableTop, { width: columnWidths[i], align: i === 1 ? 'left' : 'right' });
      xPosition += columnWidths[i];
    });

    // Header line
    doc.moveTo(50, tableTop + 15)
       .lineTo(545, tableTop + 15)
       .stroke();

    // Table rows
    let yPosition = tableTop + 20;
    doc.font('Helvetica');

    data.items.forEach((item, index) => {
      // Check if need new page
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      xPosition = 50;

      // S.No
      doc.text(item.sno.toString(), xPosition, yPosition, { width: columnWidths[0], align: 'right' });
      xPosition += columnWidths[0];

      // Description
      doc.text(item.description, xPosition, yPosition, { width: columnWidths[1], align: 'left' });
      xPosition += columnWidths[1];

      // HSN Code
      doc.text(item.hsnCode || '-', xPosition, yPosition, { width: columnWidths[2], align: 'right' });
      xPosition += columnWidths[2];

      // Quantity
      doc.text(item.quantity.toString(), xPosition, yPosition, { width: columnWidths[3], align: 'right' });
      xPosition += columnWidths[3];

      // Unit
      doc.text(item.unit, xPosition, yPosition, { width: columnWidths[4], align: 'right' });
      xPosition += columnWidths[4];

      // Rate
      doc.text(item.rate.toFixed(2), xPosition, yPosition, { width: columnWidths[5], align: 'right' });
      xPosition += columnWidths[5];

      // Tax
      doc.text(`${item.taxRate}%`, xPosition, yPosition, { width: columnWidths[6], align: 'right' });
      xPosition += columnWidths[6];

      // Amount
      doc.text(`₹${item.amount.toFixed(2)}`, xPosition, yPosition, { width: columnWidths[7], align: 'right' });

      yPosition += 20;
    });

    // Table footer line
    doc.moveTo(50, yPosition)
       .lineTo(545, yPosition)
       .stroke();

    doc.y = yPosition + 10;
  }

  /**
   * Add totals section
   */
  private addTotals(doc: PDFKit.PDFDocument, data: InvoiceData): void {
    const totalsX = 380;
    let yPosition = doc.y;

    doc.fontSize(9).font('Helvetica');

    // Subtotal
    doc.text('Subtotal:', totalsX, yPosition)
       .text(`₹${data.subtotal.toFixed(2)}`, totalsX + 90, yPosition, { align: 'right' });
    yPosition += 15;

    // CGST
    if (data.cgst) {
      doc.text('CGST:', totalsX, yPosition)
         .text(`₹${data.cgst.toFixed(2)}`, totalsX + 90, yPosition, { align: 'right' });
      yPosition += 15;
    }

    // SGST
    if (data.sgst) {
      doc.text('SGST:', totalsX, yPosition)
         .text(`₹${data.sgst.toFixed(2)}`, totalsX + 90, yPosition, { align: 'right' });
      yPosition += 15;
    }

    // IGST
    if (data.igst) {
      doc.text('IGST:', totalsX, yPosition)
         .text(`₹${data.igst.toFixed(2)}`, totalsX + 90, yPosition, { align: 'right' });
      yPosition += 15;
    }

    // Total Tax
    doc.text('Total Tax:', totalsX, yPosition)
       .text(`₹${data.totalTax.toFixed(2)}`, totalsX + 90, yPosition, { align: 'right' });
    yPosition += 15;

    // Line
    doc.moveTo(totalsX, yPosition)
       .lineTo(545, yPosition)
       .stroke();
    yPosition += 5;

    // Total Amount
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .text('Total Amount:', totalsX, yPosition)
       .text(`₹${data.totalAmount.toFixed(2)}`, totalsX + 90, yPosition, { align: 'right' });

    doc.fontSize(9).font('Helvetica');
    doc.y = yPosition + 20;
  }

  /**
   * Add payment details with QR code
   */
  private async addPaymentDetails(doc: PDFKit.PDFDocument, data: InvoiceData): Promise<void> {
    doc.moveDown(1);
    
    const paymentY = doc.y;

    // Bank details
    if (data.bankDetails) {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Bank Details:', 50, paymentY);

      doc.fontSize(9)
         .font('Helvetica')
         .text(`Bank: ${data.bankDetails.bankName}`, 50, paymentY + 15)
         .text(`Account Name: ${data.bankDetails.accountName}`, 50, paymentY + 30)
         .text(`Account Number: ${data.bankDetails.accountNumber}`, 50, paymentY + 45)
         .text(`IFSC Code: ${data.bankDetails.ifscCode}`, 50, paymentY + 60);
    }

    // UPI QR Code
    if (data.upiId) {
      try {
        const upiString = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.companyName)}&am=${data.totalAmount}&cu=INR&tn=Invoice%20${data.invoiceNumber}`;
        const qrCodeDataUrl = await QRCode.toDataURL(upiString, { width: 120 });
        
        doc.image(qrCodeDataUrl, 380, paymentY, { width: 100, height: 100 });
        
        doc.fontSize(8)
           .text('Scan to Pay via UPI', 370, paymentY + 105, { width: 120, align: 'center' })
           .text(data.upiId, 370, paymentY + 115, { width: 120, align: 'center' });
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    }

    doc.moveDown(8);
  }

  /**
   * Add notes and terms & conditions
   */
  private addNotesAndTerms(doc: PDFKit.PDFDocument, data: InvoiceData): void {
    if (data.notes) {
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('Notes:', 50, doc.y)
         .font('Helvetica')
         .text(data.notes, 50, doc.y + 5, { width: 495 })
         .moveDown(1);
    }

    if (data.termsAndConditions) {
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('Terms & Conditions:', 50, doc.y)
         .font('Helvetica')
         .fontSize(8)
         .text(data.termsAndConditions, 50, doc.y + 5, { width: 495 })
         .moveDown(1);
    }
  }

  /**
   * Add footer with signature
   */
  private addFooter(doc: PDFKit.PDFDocument, data: InvoiceData): void {
    // Move to bottom of page
    const footerY = 720;
    
    doc.fontSize(8)
       .font('Helvetica-Italic')
       .text('This is a computer generated invoice and does not require signature', 50, footerY, { 
         align: 'center',
         width: 495
       });

    // Authorized signatory
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .text('For ' + data.companyName, 380, footerY - 40);

    doc.moveTo(380, footerY - 10)
       .lineTo(520, footerY - 10)
       .stroke();

    doc.fontSize(8)
       .font('Helvetica')
       .text('Authorized Signatory', 390, footerY - 5);
  }

  /**
   * Generate simple report PDF
   */
  async generateReport(data: ReportData, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A4',
          margin: 50
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Title
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text(data.title, { align: 'center' })
           .moveDown(0.5);

        if (data.subtitle) {
          doc.fontSize(14)
             .font('Helvetica')
             .text(data.subtitle, { align: 'center' })
             .moveDown(0.5);
        }

        doc.fontSize(10)
           .text(`Period: ${data.period}`, { align: 'center' })
           .text(`Generated: ${data.generatedDate}`, { align: 'center' })
           .moveDown(1);

        // Horizontal line
        doc.moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke()
           .moveDown(1);

        // Sections
        data.sections.forEach(section => {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text(section.title)
             .moveDown(0.5);

          if (section.type === 'text') {
            doc.fontSize(10)
               .font('Helvetica')
               .text(section.data)
               .moveDown(1);
          } else if (section.type === 'table') {
            // Simple table rendering
            doc.fontSize(10).font('Helvetica');
            // Add table data rendering here
          }

          doc.moveDown(1);
        });

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const pdfService = new PDFService();

export default pdfService;
export { PDFService };
