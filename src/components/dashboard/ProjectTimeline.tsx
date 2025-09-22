'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { Project, Milestone } from '@/lib/projects';
import { formatDate } from '@/lib/utils';

interface ProjectTimelineProps {
  project: Project;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project }) => {
  const sortedMilestones = [...project.milestones].sort((a, b) => a.order - b.order);

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.completed) return 'completed';
    if (new Date() > milestone.dueDate) return 'overdue';
    if (new Date() > new Date(milestone.dueDate.getTime() - 2 * 24 * 60 * 60 * 1000)) return 'upcoming';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'upcoming':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'overdue': return 'border-red-200 bg-red-50';
      case 'upcoming': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {sortedMilestones.map((milestone, index) => {
        const status = getMilestoneStatus(milestone);

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex items-start space-x-4 p-4 rounded-lg border ${getStatusColor(status)}`}
          >
            {/* Timeline connector */}
            {index < sortedMilestones.length - 1 && (
              <div className="absolute left-7 top-12 w-0.5 h-8 bg-gray-300"></div>
            )}

            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(status)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`text-lg font-semibold ${
                  milestone.completed ? 'text-green-800' : 'text-gray-900'
                }`}>
                  {milestone.title}
                </h4>
                <div className="text-sm text-gray-500">
                  {milestone.completed && milestone.completedAt ? (
                    <span className="text-green-600 font-medium">
                      Completed {formatDate(milestone.completedAt)}
                    </span>
                  ) : (
                    <span className={status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                      Due {formatDate(milestone.dueDate)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mt-1">
                {milestone.description}
              </p>

              {/* Status Badge */}
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status === 'completed' ? 'bg-green-100 text-green-800' :
                  status === 'overdue' ? 'bg-red-100 text-red-800' :
                  status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}

      {sortedMilestones.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No milestones defined for this project</p>
        </div>
      )}
    </div>
  );
};