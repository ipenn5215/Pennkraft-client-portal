'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Image,
  File,
  Download,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Document, DocumentType, getDocumentTypeDisplay } from '@/lib/projects';
import { formatDate } from '@/lib/utils';

interface DocumentManagerProps {
  documents: Document[];
  projectId: string;
  onUpload?: (files: FileList) => void;
  onDelete?: (documentId: string) => void;
  readonly?: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  projectId,
  onUpload,
  onDelete,
  readonly = false
}) => {
  const [filter, setFilter] = useState<DocumentType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.type === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFileIcon = (fileName: string, type: DocumentType) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (type === 'photos' || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }

    if (['pdf'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }

    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0] && onUpload) {
      onUpload(e.dataTransfer.files);
    }
  };

  const documentTypes: Array<{ value: DocumentType | 'all'; label: string }> = [
    { value: 'all', label: 'All Documents' },
    { value: 'plans', label: 'Plans & Drawings' },
    { value: 'specs', label: 'Specifications' },
    { value: 'photos', label: 'Photos' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'invoices', label: 'Invoices' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!readonly && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Documents
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Select Files
          </button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onUpload && onUpload(e.target.files)}
          />
        </motion.div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as DocumentType | 'all')}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocuments.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-effect rounded-lg p-4 border border-white/20 hover:border-primary-200 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(doc.name, doc.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{getDocumentTypeDisplay(doc.type)}</span>
                    <span>•</span>
                    <span>{formatFileSize(doc.size)}</span>
                    <span>•</span>
                    <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(doc.url, '_blank')}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="View document"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = doc.url;
                    link.download = doc.name;
                    link.click();
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Download document"
                >
                  <Download className="h-4 w-4" />
                </button>
                {!readonly && onDelete && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>
              {searchTerm || filter !== 'all'
                ? 'No documents match your search criteria'
                : 'No documents uploaded yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};