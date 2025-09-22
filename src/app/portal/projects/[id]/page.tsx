'use client';

import { useState, useEffect } from 'react';
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
  MessageSquare,
  Settings,
  Edit,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProjectTimeline } from '@/components/dashboard/ProjectTimeline';
import { DocumentManager } from '@/components/dashboard/DocumentManager';
import { CommunicationHub } from '@/components/dashboard/CommunicationHub';
import { getProjectById, getServiceTypeDisplay } from '@/lib/projects';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'communication'>('overview');

  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const isOverdue = project.status !== 'completed' && project.status !== 'cancelled' &&
                   new Date() > project.endDate;

  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const totalMilestones = project.milestones.length;
  const progressFromMilestones = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: FileText },
    { id: 'timeline' as const, label: 'Timeline', icon: Calendar },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'communication' as const, label: 'Messages', icon: MessageSquare }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Link href="/portal/projects">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                  </span>
                  {isOverdue && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Overdue
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {getServiceTypeDisplay(project.serviceType)}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
            </div>

            {/* Project Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-effect rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <User className="h-8 w-8 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-semibold text-gray-900">{project.clientName}</p>
                    <p className="text-xs text-gray-500">{project.clientEmail}</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Project Value</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(project.estimatedCost)}</p>
                    {project.actualCost && (
                      <p className="text-xs text-gray-500">Actual: {formatCurrency(project.actualCost)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Timeline</p>
                    <p className="font-semibold text-gray-900">{formatDate(project.startDate)}</p>
                    <p className="text-xs text-gray-500">to {formatDate(project.endDate)}</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="font-semibold text-gray-900">{project.progress}%</p>
                    <p className="text-xs text-gray-500">{completedMilestones}/{totalMilestones} milestones</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl border border-white/20 mb-8"
          >
            <div className="flex space-x-8 p-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'communication' && project.communications.some(c => !c.read) && (
                      <span className="inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6 border border-white/20"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{project.address}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{project.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <a href={`mailto:${project.clientEmail}`} className="text-primary-600 hover:text-primary-700">
                        {project.clientEmail}
                      </a>
                    </div>
                    {project.clientPhone && (
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <a href={`tel:${project.clientPhone}`} className="text-primary-600 hover:text-primary-700">
                          {project.clientPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{project.documents.length}</div>
                      <div className="text-sm text-gray-600">Documents</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{project.milestones.length}</div>
                      <div className="text-sm text-gray-600">Milestones</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{project.communications.length}</div>
                      <div className="text-sm text-gray-600">Messages</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline</h3>
                <ProjectTimeline project={project} />
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Documents</h3>
                <DocumentManager
                  documents={project.documents}
                  projectId={project.id}
                  readonly={project.status === 'completed' || project.status === 'cancelled'}
                  onUpload={(files) => {
                    console.log('Upload files:', files);
                    // Handle file upload
                  }}
                  onDelete={(docId) => {
                    console.log('Delete document:', docId);
                    // Handle document deletion
                  }}
                />
              </div>
            )}

            {activeTab === 'communication' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Communication</h3>
                <CommunicationHub
                  communications={project.communications}
                  projectId={project.id}
                  currentUser="Current User" // This should come from auth context
                  readonly={project.status === 'completed' || project.status === 'cancelled'}
                  onSendMessage={(message) => {
                    console.log('Send message:', message);
                    // Handle sending message
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}