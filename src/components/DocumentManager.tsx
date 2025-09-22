'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Download,
  FileText,
  File,
  Image,
  Trash2,
  Eye,
  Search,
  Filter,
  FolderOpen,
  FolderPlus,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  Archive,
  Paperclip
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'word' | 'image' | 'cad' | 'archive' | 'other';
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  category: 'client-upload' | 'deliverable';
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  description?: string;
  projectId: string;
  downloadUrl?: string;
}

interface DocumentManagerProps {
  projectId: string;
  onUpload?: (files: File[], category: 'client-upload' | 'deliverable') => void;
  onDownload?: (document: Document) => void;
  onDelete?: (documentId: string) => void;
  onStatusChange?: (documentId: string, status: Document['status']) => void;
}

export default function DocumentManager({
  projectId,
  onUpload,
  onDownload,
  onDelete,
  onStatusChange
}: DocumentManagerProps) {
  const [activeTab, setActiveTab] = useState<'client-uploads' | 'deliverables'>('client-uploads');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Document['status']>('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'client-upload' | 'deliverable'>('client-upload');

  // Mock documents data - will be replaced with database
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Project_Requirements.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'John Doe',
      uploadedDate: '2024-11-10',
      category: 'client-upload',
      status: 'reviewed',
      description: 'Initial project requirements document',
      projectId
    },
    {
      id: '2',
      name: 'Site_Photos.zip',
      type: 'archive',
      size: '45.6 MB',
      uploadedBy: 'John Doe',
      uploadedDate: '2024-11-12',
      category: 'client-upload',
      status: 'pending',
      description: 'Current site condition photos',
      projectId
    },
    {
      id: '3',
      name: 'Final_Estimate.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadedBy: 'Mike Johnson',
      uploadedDate: '2024-11-14',
      category: 'deliverable',
      status: 'approved',
      description: 'Detailed project estimate with breakdown',
      projectId
    },
    {
      id: '4',
      name: 'Progress_Report_Week1.pdf',
      type: 'pdf',
      size: '3.2 MB',
      uploadedBy: 'Mike Johnson',
      uploadedDate: '2024-11-15',
      category: 'deliverable',
      status: 'approved',
      description: 'Weekly progress report with photos',
      projectId
    }
  ]);

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = activeTab === 'client-uploads'
      ? doc.category === 'client-upload'
      : doc.category === 'deliverable';

    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;

    return matchesCategory && matchesSearch && matchesStatus;
  });

  const getFileIcon = (type: Document['type']) => {
    switch(type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'excel': return <File className="h-5 w-5 text-green-500" />;
      case 'word': return <File className="h-5 w-5 text-blue-500" />;
      case 'image': return <Image className="h-5 w-5 text-yellow-500" />;
      case 'cad': return <File className="h-5 w-5 text-purple-500" />;
      case 'archive': return <Archive className="h-5 w-5 text-gray-500" />;
      default: return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch(status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'reviewed':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            <Eye className="h-3 w-3" />
            <span>Reviewed</span>
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </span>
        );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, category: 'client-upload' | 'deliverable') => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onUpload) {
      onUpload(files, category);
      simulateUpload(files, category);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, category: 'client-upload' | 'deliverable') => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onUpload) {
      onUpload(files, category);
      simulateUpload(files, category);
    }
  };

  const simulateUpload = (files: File[], category: 'client-upload' | 'deliverable') => {
    files.forEach(file => {
      const fileId = Math.random().toString(36).substr(2, 9);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));

        if (progress >= 100) {
          clearInterval(interval);

          // Add document to list
          const newDoc: Document = {
            id: fileId,
            name: file.name,
            type: getFileType(file.name),
            size: formatFileSize(file.size),
            uploadedBy: category === 'client-upload' ? 'John Doe' : 'Mike Johnson',
            uploadedDate: new Date().toISOString().split('T')[0],
            category,
            status: 'pending',
            projectId
          };

          setDocuments(prev => [...prev, newDoc]);

          // Clean up progress
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 1000);
        }
      }, 200);
    });
  };

  const getFileType = (filename: string): Document['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch(ext) {
      case 'pdf': return 'pdf';
      case 'xls': case 'xlsx': return 'excel';
      case 'doc': case 'docx': return 'word';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'image';
      case 'dwg': case 'dxf': return 'cad';
      case 'zip': case 'rar': case '7z': return 'archive';
      default: return 'other';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => {
                setShowUploadModal(true);
                setUploadCategory(activeTab === 'client-uploads' ? 'client-upload' : 'deliverable');
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b -mb-6">
          <button
            onClick={() => setActiveTab('client-uploads')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'client-uploads'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span>Client Uploads</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {documents.filter(d => d.category === 'client-upload').length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'deliverables'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Deliverables</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {documents.filter(d => d.category === 'deliverable').length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, activeTab === 'client-uploads' ? 'client-upload' : 'deliverable')}
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
          <p className="text-sm text-gray-500 mb-4">
            {activeTab === 'client-uploads'
              ? 'Upload documents for project review'
              : 'Upload deliverables for client'}
          </p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, activeTab === 'client-uploads' ? 'client-upload' : 'deliverable')}
            />
            <span className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 cursor-pointer inline-block">
              Browse Files
            </span>
          </label>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mb-6 space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Uploading...</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-2">
          <AnimatePresence>
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocuments([...selectedDocuments, doc.id]);
                      } else {
                        setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                      }
                    }}
                    className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  {getFileIcon(doc.type)}
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{doc.size}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {doc.uploadedBy}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {doc.uploadedDate}
                      </span>
                    </div>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(doc.status)}
                  {activeTab === 'client-uploads' && doc.status === 'pending' && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onStatusChange?.(doc.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onStatusChange?.(doc.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => onDownload?.(doc)}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No documents found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery ? 'Try adjusting your search' : 'Upload documents to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}