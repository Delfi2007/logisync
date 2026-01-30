import { Order } from '@/types';
import { FileText, Download, Printer, X } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  // Company details (would come from settings/config in production)
  const companyDetails = {
    name: 'LogiSync Solutions Pvt Ltd',
    address: '123 Business Park, MG Road',
    city: 'Bangalore, Karnataka - 560001',
    gstin: '29ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    phone: '+91 80 1234 5678',
    email: 'billing@logisync.com',
    website: 'www.logisync.com',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Calculate tax breakdown (assuming intra-state: CGST + SGST, or inter-state: IGST)
  const isIntraState = order.shippingAddress.state === 'Karnataka'; // Company state
  const taxRate = 0.18; // 18% GST
  const cgstRate = isIntraState ? taxRate / 2 : 0;
  const sgstRate = isIntraState ? taxRate / 2 : 0;
  const igstRate = isIntraState ? 0 : taxRate;

  const cgstAmount = order.subtotal * cgstRate;
  const sgstAmount = order.subtotal * sgstRate;
  const igstAmount = order.subtotal * igstRate;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In production, this would generate a PDF
    alert('PDF download functionality would be implemented here using libraries like jsPDF or react-pdf');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-minimal-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header - Hidden in Print */}
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10 print:hidden">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-neutral-600" />
              <h2 className="text-xl font-bold text-neutral-900">Tax Invoice</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="btn-secondary flex items-center gap-2"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={handlePrint}
                className="btn-secondary flex items-center gap-2"
                title="Print Invoice"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Invoice Content - Printable */}
          <div className="p-8 print:p-12" id="invoice-content">
            {/* Company Header */}
            <div className="border-b-2 border-neutral-900 pb-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    {companyDetails.name}
                  </h1>
                  <p className="text-sm text-neutral-600">{companyDetails.address}</p>
                  <p className="text-sm text-neutral-600">{companyDetails.city}</p>
                  <p className="text-sm text-neutral-600 mt-2">
                    <span className="font-semibold">GSTIN:</span> {companyDetails.gstin}
                  </p>
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold">PAN:</span> {companyDetails.pan}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-neutral-900 text-white px-4 py-2 rounded">
                    <p className="text-sm font-semibold">TAX INVOICE</p>
                  </div>
                  <p className="text-sm text-neutral-600 mt-4">
                    <span className="font-semibold">Phone:</span> {companyDetails.phone}
                  </p>
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold">Email:</span> {companyDetails.email}
                  </p>
                  <p className="text-sm text-neutral-600">{companyDetails.website}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details & Customer Info */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Invoice Details */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase">
                  Invoice Details
                </h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">Invoice No:</span>{' '}
                    <span className="font-mono">{order.orderNumber}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Invoice Date:</span>{' '}
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Payment Status:</span>{' '}
                    <span className="capitalize">{order.paymentStatus}</span>
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm">
                      <span className="font-semibold">Tracking No:</span>{' '}
                      <span className="font-mono">{order.trackingNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Bill To */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase">
                  Bill To
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{order.customerName}</p>
                  <p className="text-sm">{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && (
                    <p className="text-sm">{order.shippingAddress.line2}</p>
                  )}
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="text-sm">PIN: {order.shippingAddress.pincode}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <table className="w-full border border-neutral-300">
                <thead className="bg-neutral-900 text-white">
                  <tr>
                    <th className="text-left text-xs font-semibold px-3 py-2 border-r border-neutral-700">
                      #
                    </th>
                    <th className="text-left text-xs font-semibold px-3 py-2 border-r border-neutral-700">
                      Item Description
                    </th>
                    <th className="text-left text-xs font-semibold px-3 py-2 border-r border-neutral-700">
                      HSN/SAC
                    </th>
                    <th className="text-right text-xs font-semibold px-3 py-2 border-r border-neutral-700">
                      Qty
                    </th>
                    <th className="text-right text-xs font-semibold px-3 py-2 border-r border-neutral-700">
                      Rate
                    </th>
                    <th className="text-right text-xs font-semibold px-3 py-2">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.productId} className="border-b border-neutral-300">
                      <td className="text-sm px-3 py-2 border-r border-neutral-300">
                        {index + 1}
                      </td>
                      <td className="text-sm px-3 py-2 border-r border-neutral-300">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-neutral-600">SKU: {item.sku}</p>
                        </div>
                      </td>
                      <td className="text-sm px-3 py-2 border-r border-neutral-300 font-mono">
                        {/* HSN code would come from product data */}
                        {item.productId.includes('PRD-001') || item.productId.includes('PRD-002')
                          ? '1001' // Food items
                          : item.productId.includes('PRD-003')
                          ? '6109' // Apparel
                          : item.productId.includes('PRD-004')
                          ? '1508' // Oils
                          : '4202'} {/* Bags/Accessories */}
                      </td>
                      <td className="text-sm text-right px-3 py-2 border-r border-neutral-300">
                        {item.quantity}
                      </td>
                      <td className="text-sm text-right px-3 py-2 border-r border-neutral-300">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="text-sm text-right px-3 py-2 font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-2 gap-8">
              {/* Payment Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase">
                  Payment Details
                </h3>
                <p className="text-sm">
                  <span className="font-semibold">Delivery Type:</span>{' '}
                  <span className="capitalize">{order.deliveryType}</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Payment Method:</span> To be updated
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Payment Status:</span>{' '}
                  <span className="capitalize font-semibold">{order.paymentStatus}</span>
                </p>
              </div>

              {/* Amount Breakdown */}
              <div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>

                  {isIntraState ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">CGST @ {cgstRate * 100}%:</span>
                        <span className="font-medium">{formatCurrency(cgstAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">SGST @ {sgstRate * 100}%:</span>
                        <span className="font-medium">{formatCurrency(sgstAmount)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">IGST @ {igstRate * 100}%:</span>
                      <span className="font-medium">{formatCurrency(igstAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping Charges:</span>
                    <span className="font-medium">{formatCurrency(order.shippingCost)}</span>
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t border-neutral-300">
                    <span className="text-neutral-600">Round Off:</span>
                    <span className="font-medium">
                      {formatCurrency(Math.round(order.total) - order.total)}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900 text-white px-4 py-3 rounded flex justify-between items-center">
                  <span className="font-bold">Total Amount:</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(Math.round(order.total))}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 mt-2 text-right italic">
                  (Amount in words: {/* Would implement number-to-words conversion */}
                  Rupees {Math.round(order.total)} Only)
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-8 pt-6 border-t border-neutral-300">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase">
                Terms & Conditions
              </h3>
              <div className="space-y-1 text-xs text-neutral-600">
                <p>1. Payment is due within 30 days from the date of invoice.</p>
                <p>2. Late payments will attract 18% per annum interest.</p>
                <p>3. Goods once sold will not be taken back or exchanged.</p>
                <p>4. All disputes are subject to Bangalore jurisdiction only.</p>
                <p>5. This is a computer-generated invoice and does not require a signature.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t-2 border-neutral-900 text-center">
              <p className="text-sm font-semibold text-neutral-900">
                {companyDetails.name}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                Thank you for your business!
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                This is a system-generated invoice. For any queries, contact:{' '}
                {companyDetails.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-12 {
            padding: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
