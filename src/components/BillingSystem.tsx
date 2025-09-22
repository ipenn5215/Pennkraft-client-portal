'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  FileText,
  Send,
  Edit,
  Trash2,
  Download,
  Eye,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Receipt,
  TrendingUp,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Calculator,
  Percent,
  PlusCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Archive
} from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  total: number;
  category?: string;
}

interface Quote {
  id: string;
  quoteNumber: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  items: LineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  notes?: string;
  terms?: string;
  validUntil: string;
  createdAt: string;
  sentAt?: string;
  acceptedAt?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  items: LineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  amountPaid: number;
  amountDue: number;
  notes?: string;
  terms?: string;
  dueDate: string;
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
  stripeInvoiceId?: string;
  stripePaymentIntentId?: string;
  paymentMethod?: 'card' | 'bank_transfer' | 'check' | 'cash';
}

interface ChangeOrder {
  id: string;
  orderNumber: string;
  projectId: string;
  projectName: string;
  invoiceId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'invoiced';
  description: string;
  reason: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

interface BillingSystemProps {
  projectId: string;
  clientId: string;
  onQuoteCreate?: (quote: Quote) => void;
  onInvoiceCreate?: (invoice: Invoice) => void;
  onChangeOrderCreate?: (changeOrder: ChangeOrder) => void;
  onPayment?: (invoiceId: string, amount: number) => void;
  stripePublishableKey?: string;
}

export default function BillingSystem({
  projectId,
  clientId,
  onQuoteCreate,
  onInvoiceCreate,
  onChangeOrderCreate,
  onPayment,
  stripePublishableKey
}: BillingSystemProps) {
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices' | 'change-orders'>('quotes');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'quote' | 'invoice' | 'change-order'>('quote');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedChangeOrder, setSelectedChangeOrder] = useState<ChangeOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - will be replaced with database
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: '1',
      quoteNumber: 'Q-2024-001',
      projectId,
      projectName: 'Downtown Office Building',
      clientId,
      clientName: 'ABC Construction',
      status: 'accepted',
      items: [
        {
          id: '1',
          description: 'Painting - Interior Walls',
          quantity: 5000,
          unitPrice: 3.50,
          unit: 'sq ft',
          total: 17500,
          category: 'Painting'
        },
        {
          id: '2',
          description: 'Painting - Exterior Walls',
          quantity: 3000,
          unitPrice: 4.50,
          unit: 'sq ft',
          total: 13500,
          category: 'Painting'
        }
      ],
      subtotal: 31000,
      tax: 2480,
      taxRate: 8,
      discount: 1500,
      discountType: 'fixed',
      total: 31980,
      validUntil: '2024-12-01',
      createdAt: '2024-11-01',
      sentAt: '2024-11-02',
      acceptedAt: '2024-11-05',
      notes: 'Price includes all materials and labor',
      terms: 'Payment due within 30 days of invoice'
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      quoteId: '1',
      projectId,
      projectName: 'Downtown Office Building',
      clientId,
      clientName: 'ABC Construction',
      status: 'partial',
      items: [
        {
          id: '1',
          description: 'Painting - Interior Walls (Phase 1)',
          quantity: 2500,
          unitPrice: 3.50,
          unit: 'sq ft',
          total: 8750,
          category: 'Painting'
        }
      ],
      subtotal: 8750,
      tax: 700,
      taxRate: 8,
      discount: 0,
      discountType: 'fixed',
      total: 9450,
      amountPaid: 5000,
      amountDue: 4450,
      dueDate: '2024-12-15',
      createdAt: '2024-11-10',
      sentAt: '2024-11-10',
      notes: 'Phase 1 completion - 50% payment received',
      terms: 'Net 30'
    }
  ]);

  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([
    {
      id: '1',
      orderNumber: 'CO-2024-001',
      projectId,
      projectName: 'Downtown Office Building',
      status: 'pending',
      description: 'Additional painting for new conference room',
      reason: 'Client requested additional work after project start',
      items: [
        {
          id: '1',
          description: 'Conference Room - Premium Paint',
          quantity: 800,
          unitPrice: 5.00,
          unit: 'sq ft',
          total: 4000,
          category: 'Painting'
        }
      ],
      subtotal: 4000,
      tax: 320,
      total: 4320,
      requestedBy: 'John Doe',
      requestedDate: '2024-11-12',
      notes: 'Rush job - needs completion within 1 week'
    }
  ]);

  // Form state for creating new items
  const [formData, setFormData] = useState({
    items: [] as LineItem[],
    taxRate: 8,
    discount: 0,
    discountType: 'fixed' as 'percentage' | 'fixed',
    notes: '',
    terms: 'Net 30',
    dueDate: '',
    validUntil: ''
  });

  const [newLineItem, setNewLineItem] = useState<Partial<LineItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    unit: 'unit'
  });

  const calculateTotals = (items: LineItem[], taxRate: number, discount: number, discountType: 'percentage' | 'fixed') => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = discountType === 'percentage' ? (subtotal * discount / 100) : discount;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * (taxRate / 100);
    const total = taxableAmount + tax;

    return { subtotal, tax, total, discountAmount };
  };

  const addLineItem = () => {
    if (!newLineItem.description || !newLineItem.quantity || !newLineItem.unitPrice) return;

    const item: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: newLineItem.description,
      quantity: newLineItem.quantity,
      unitPrice: newLineItem.unitPrice,
      unit: newLineItem.unit || 'unit',
      total: newLineItem.quantity * newLineItem.unitPrice,
      category: newLineItem.category
    };

    setFormData({
      ...formData,
      items: [...formData.items, item]
    });

    setNewLineItem({
      description: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'unit'
    });
  };

  const removeLineItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  const handleCreateQuote = () => {
    const { subtotal, tax, total } = calculateTotals(
      formData.items,
      formData.taxRate,
      formData.discount,
      formData.discountType
    );

    const quote: Quote = {
      id: Math.random().toString(36).substr(2, 9),
      quoteNumber: `Q-2024-${(quotes.length + 1).toString().padStart(3, '0')}`,
      projectId,
      projectName: 'Downtown Office Building',
      clientId,
      clientName: 'ABC Construction',
      status: 'draft',
      items: formData.items,
      subtotal,
      tax,
      taxRate: formData.taxRate,
      discount: formData.discount,
      discountType: formData.discountType,
      total,
      validUntil: formData.validUntil,
      createdAt: new Date().toISOString().split('T')[0],
      notes: formData.notes,
      terms: formData.terms
    };

    setQuotes([...quotes, quote]);
    setShowCreateModal(false);
    resetForm();

    if (onQuoteCreate) {
      onQuoteCreate(quote);
    }
  };

  const convertQuoteToInvoice = (quote: Quote) => {
    const invoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-2024-${(invoices.length + 1).toString().padStart(3, '0')}`,
      quoteId: quote.id,
      projectId: quote.projectId,
      projectName: quote.projectName,
      clientId: quote.clientId,
      clientName: quote.clientName,
      status: 'draft',
      items: quote.items,
      subtotal: quote.subtotal,
      tax: quote.tax,
      taxRate: quote.taxRate,
      discount: quote.discount,
      discountType: quote.discountType,
      total: quote.total,
      amountPaid: 0,
      amountDue: quote.total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      notes: quote.notes,
      terms: quote.terms
    };

    setInvoices([...invoices, invoice]);

    if (onInvoiceCreate) {
      onInvoiceCreate(invoice);
    }
  };

  const handleCreateChangeOrder = () => {
    const { subtotal, tax, total } = calculateTotals(
      formData.items,
      formData.taxRate,
      0,
      'fixed'
    );

    const changeOrder: ChangeOrder = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: `CO-2024-${(changeOrders.length + 1).toString().padStart(3, '0')}`,
      projectId,
      projectName: 'Downtown Office Building',
      status: 'pending',
      description: formData.notes,
      reason: 'Additional work requested',
      items: formData.items,
      subtotal,
      tax,
      total,
      requestedBy: 'John Doe',
      requestedDate: new Date().toISOString().split('T')[0],
      notes: formData.notes
    };

    setChangeOrders([...changeOrders, changeOrder]);
    setShowCreateModal(false);
    resetForm();

    if (onChangeOrderCreate) {
      onChangeOrderCreate(changeOrder);
    }
  };

  const resetForm = () => {
    setFormData({
      items: [],
      taxRate: 8,
      discount: 0,
      discountType: 'fixed',
      notes: '',
      terms: 'Net 30',
      dueDate: '',
      validUntil: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-600',
      sent: 'bg-blue-100 text-blue-600',
      viewed: 'bg-purple-100 text-purple-600',
      accepted: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600',
      expired: 'bg-gray-100 text-gray-600',
      paid: 'bg-green-100 text-green-600',
      partial: 'bg-yellow-100 text-yellow-600',
      overdue: 'bg-red-100 text-red-600',
      cancelled: 'bg-gray-100 text-gray-600',
      pending: 'bg-yellow-100 text-yellow-600',
      approved: 'bg-green-100 text-green-600',
      invoiced: 'bg-blue-100 text-blue-600'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Billing & Invoicing</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => {
                setCreateType(activeTab === 'quotes' ? 'quote' : activeTab === 'invoices' ? 'invoice' : 'change-order');
                setShowCreateModal(true);
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b -mb-6">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'quotes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Quotes</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {quotes.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'invoices'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Invoices</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {invoices.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('change-orders')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'change-orders'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Change Orders</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {changeOrders.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{quote.quoteNumber}</h3>
                      {getStatusBadge(quote.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{quote.projectName} • {quote.clientName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Created: {quote.createdAt}</span>
                      <span>Valid Until: {quote.validUntil}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(quote.total)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => setSelectedQuote(quote)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Send className="h-4 w-4" />
                      </button>
                      {quote.status === 'accepted' && (
                        <button
                          onClick={() => convertQuoteToInvoice(quote)}
                          className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700"
                        >
                          Convert to Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{invoice.projectName} • {invoice.clientName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Created: {invoice.createdAt}</span>
                      <span>Due: {invoice.dueDate}</span>
                    </div>
                    {invoice.amountPaid > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">Paid:</span>
                          <span className="font-medium text-green-600">{formatCurrency(invoice.amountPaid)}</span>
                          <span className="text-gray-600">Due:</span>
                          <span className="font-medium text-orange-600">{formatCurrency(invoice.amountDue)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(invoice.amountPaid / invoice.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Send className="h-4 w-4" />
                      </button>
                      {invoice.status !== 'paid' && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center space-x-1">
                          <CreditCard className="h-3 w-3" />
                          <span>Pay with Stripe</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Change Orders Tab */}
        {activeTab === 'change-orders' && (
          <div className="space-y-4">
            {changeOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Reason: {order.reason}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Requested by: {order.requestedBy}</span>
                      <span>Date: {order.requestedDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => setSelectedChangeOrder(order)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                            Reject
                          </button>
                        </>
                      )}
                      {order.status === 'approved' && !order.invoiceId && (
                        <button className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700">
                          Create Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New {createType === 'quote' ? 'Quote' : createType === 'invoice' ? 'Invoice' : 'Change Order'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {/* Line Items */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Line Items</h3>

              {/* Add Item Form */}
              <div className="grid grid-cols-12 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Description"
                  value={newLineItem.description}
                  onChange={(e) => setNewLineItem({ ...newLineItem, description: e.target.value })}
                  className="col-span-5 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newLineItem.quantity}
                  onChange={(e) => setNewLineItem({ ...newLineItem, quantity: parseFloat(e.target.value) })}
                  className="col-span-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={newLineItem.unit}
                  onChange={(e) => setNewLineItem({ ...newLineItem, unit: e.target.value })}
                  className="col-span-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newLineItem.unitPrice}
                  onChange={(e) => setNewLineItem({ ...newLineItem, unitPrice: parseFloat(e.target.value) })}
                  className="col-span-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={addLineItem}
                  className="col-span-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mx-auto" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {formData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <p className="font-medium text-gray-900">{formatCurrency(item.total)}</p>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="fixed">$</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calculateTotals(formData.items, 0, 0, 'fixed').subtotal)}</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(calculateTotals(formData.items, 0, formData.discount, formData.discountType).discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({formData.taxRate}%)</span>
                  <span>{formatCurrency(calculateTotals(formData.items, formData.taxRate, formData.discount, formData.discountType).tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotals(formData.items, formData.taxRate, formData.discount, formData.discountType).total)}</span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (createType === 'quote') handleCreateQuote();
                  else if (createType === 'change-order') handleCreateChangeOrder();
                }}
                disabled={formData.items.length === 0}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create {createType === 'quote' ? 'Quote' : createType === 'invoice' ? 'Invoice' : 'Change Order'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}