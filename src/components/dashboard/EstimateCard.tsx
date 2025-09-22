'use client';

import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, User, Clock, AlertCircle, Paperclip } from 'lucide-react';
import { EstimateRequest } from '@/lib/estimates';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getEstimateStatusColor, getPriorityColor, getEstimateStatusDisplay, getPriorityDisplay } from '@/lib/estimates';
import Link from 'next/link';

interface EstimateCardProps {
  estimate: EstimateRequest;
  index?: number;
}

export const EstimateCard: React.FC<EstimateCardProps> = ({ estimate, index = 0 }) => {
  const isUrgent = estimate.priority === 'urgent';
  const hasAttachments = estimate.attachments.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-effect rounded-xl p-6 border transition-all group ${
        isUrgent ? 'border-red-200 bg-red-50/30' : 'border-white/20 hover:border-primary-200'
      }`}
    >
      <Link href={`/portal/estimates/${estimate.id}`}>
        <div className="cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {isUrgent && <AlertCircle className="h-4 w-4 text-red-500" />}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                  {estimate.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstimateStatusColor(estimate.status)}`}>
                  {getEstimateStatusDisplay(estimate.status)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(estimate.priority)}`}>
                  {getPriorityDisplay(estimate.priority)}
                </span>
              </div>
            </div>
            <div className="text-right">
              {estimate.budget && (
                <div className="text-lg font-bold text-gray-900">
                  Budget: {formatCurrency(estimate.budget)}
                </div>
              )}
              {estimate.estimatedValue && (
                <div className="text-sm text-green-600 font-medium">
                  Est: {formatCurrency(estimate.estimatedValue)}
                </div>
              )}
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{estimate.clientName}</span>
              {estimate.company && (
                <>
                  <span>•</span>
                  <span className="font-medium">{estimate.company}</span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{estimate.address}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {estimate.description}
          </p>

          {/* Timeline & Duration */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            {estimate.preferredStartDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Start: {formatDate(estimate.preferredStartDate)}</span>
              </div>
            )}
            {estimate.estimatedDuration && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{estimate.estimatedDuration} days</span>
              </div>
            )}
          </div>

          {/* Requirements Preview */}
          {estimate.requirements.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Requirements:</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {estimate.requirements.slice(0, 2).map((req, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span className="line-clamp-1">{req}</span>
                  </li>
                ))}
                {estimate.requirements.length > 2 && (
                  <li className="text-gray-500 italic">
                    +{estimate.requirements.length - 2} more requirements
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {hasAttachments && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{estimate.attachments.length} files</span>
                </div>
              )}
              {estimate.assignedTo && (
                <span>Assigned to: {estimate.assignedTo}</span>
              )}
            </div>
            <span>Created {formatDate(estimate.createdAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};