'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  DollarSign,
  Clock,
  FileText,
  Building,
  AlertCircle,
  CheckCircle,
  Paperclip,
  Download,
  Eye
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  getEstimateById,
  getEstimateStatusColor,
  getPriorityColor,
  getEstimateStatusDisplay,
  getPriorityDisplay
} from '@/lib/estimates';
import { getServiceTypeDisplay } from '@/lib/projects';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';

export default function EstimateDetailPage() {
  const params = useParams();
  const estimateId = params.id as string;

  const estimate = getEstimateById(estimateId);

  if (!estimate) {
    notFound();
  }

  const isUrgent = estimate.priority === 'urgent';
  const hasAttachments = estimate.attachments.length > 0;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/portal/estimates">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </Link>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {isUrgent && <AlertCircle className="h-5 w-5 text-red-500" />}
                  <h1 className="text-3xl font-bold text-gray-900">{estimate.title}</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstimateStatusColor(estimate.status)}`}>
                    {getEstimateStatusDisplay(estimate.status)}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(estimate.priority)}`}>
                    {getPriorityDisplay(estimate.priority)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getServiceTypeDisplay(estimate.serviceType)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-effect rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-semibold text-gray-900">{estimate.clientName}</p>
                    {estimate.company && (
                      <p className="text-sm text-gray-500">{estimate.company}</p>
                    )}
                  </div>
                </div>
              </div>

              {estimate.budget && (
                <div className="glass-effect rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(estimate.budget)}</p>
                      {estimate.estimatedValue && (
                        <p className="text-sm text-green-600">Est: {formatCurrency(estimate.estimatedValue)}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {estimate.preferredStartDate && (
                <div className="glass-effect rounded-xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Preferred Start</p>
                      <p className="font-semibold text-gray-900">{formatDate(estimate.preferredStartDate)}</p>
                      {estimate.estimatedDuration && (
                        <p className="text-sm text-blue-600">{estimate.estimatedDuration} days</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h3>
              <p className="text-gray-700 leading-relaxed">{estimate.description}</p>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Location</h3>
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{estimate.address}</span>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{estimate.clientName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <a
                    href={`mailto:${estimate.clientEmail}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {estimate.clientEmail}
                  </a>
                </div>
                {estimate.clientPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <a
                      href={`tel:${estimate.clientPhone}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {estimate.clientPhone}
                    </a>
                  </div>
                )}
                {estimate.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{estimate.company}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Requirements */}
            {estimate.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-effect rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Requirements</h3>
                <ul className="space-y-2">
                  {estimate.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Attachments */}
            {hasAttachments && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-effect rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                <div className="space-y-3">
                  {estimate.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(attachment.size)} • Uploaded {formatDate(attachment.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(attachment.url, '_blank')}
                          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          title="View attachment"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.url;
                            link.download = attachment.name;
                            link.click();
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Download attachment"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Additional Notes */}
            {estimate.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-effect rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{estimate.notes}</p>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Request Created</p>
                    <p className="text-sm text-gray-500">{formatDate(estimate.createdAt)}</p>
                  </div>
                </div>
                {estimate.reviewedAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Under Review</p>
                      <p className="text-sm text-gray-500">{formatDate(estimate.reviewedAt)}</p>
                      {estimate.assignedTo && (
                        <p className="text-xs text-gray-400">Assigned to {estimate.assignedTo}</p>
                      )}
                    </div>
                  </div>
                )}
                {estimate.status === 'approved' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Estimate Approved</p>
                      <p className="text-sm text-gray-500">Ready to proceed with project</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}