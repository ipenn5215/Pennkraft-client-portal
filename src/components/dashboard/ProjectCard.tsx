'use client';

import { motion } from 'framer-motion';
import { Calendar, DollarSign, MapPin, User, Clock, FileText } from 'lucide-react';
import { Project } from '@/lib/projects';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isOverdue = project.status !== 'completed' && project.status !== 'cancelled' &&
                   new Date() > project.endDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-effect rounded-xl p-6 border border-white/20 hover:border-primary-200 transition-all group"
    >
      <Link href={`/portal/projects/${project.id}`}>
        <div className="cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(project.estimatedCost)}
              </div>
              {project.actualCost && (
                <div className="text-sm text-gray-500">
                  Actual: {formatCurrency(project.actualCost)}
                </div>
              )}
            </div>
          </div>

          {/* Client Info */}
          <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{project.clientName}</span>
          </div>

          {/* Address */}
          <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{project.address}</span>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(project.startDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(project.endDate)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>{project.documents.length} docs</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{project.milestones.filter(m => m.completed).length}/{project.milestones.length} milestones</span>
              </div>
            </div>
            <span>Updated {formatDate(project.updatedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};