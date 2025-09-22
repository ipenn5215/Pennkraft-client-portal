'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FileText,
  Upload,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Briefcase
} from 'lucide-react';

// Mock projects data
const mockProjects = [
  {
    id: '1',
    name: 'Downtown Office Building',
    type: 'Commercial Renovation',
    status: 'active',
    statusLabel: 'In Progress',
    progress: 65,
    dueDate: '2024-12-15',
    budget: '$125,000',
    lastUpdate: '2 hours ago',
    documents: 12,
    messages: 3
  },
  {
    id: '2',
    name: 'Residential Complex A',
    type: 'New Construction',
    status: 'review',
    statusLabel: 'Under Review',
    progress: 30,
    dueDate: '2024-12-28',
    budget: '$450,000',
    lastUpdate: '1 day ago',
    documents: 8,
    messages: 5
  },
  {
    id: '3',
    name: 'Retail Store Renovation',
    type: 'Commercial',
    status: 'pending',
    statusLabel: 'Pending',
    progress: 0,
    dueDate: '2025-01-10',
    budget: '$85,000',
    lastUpdate: '3 days ago',
    documents: 4,
    messages: 1
  },
  {
    id: '4',
    name: 'Historic Building Restoration',
    type: 'Commercial',
    status: 'completed',
    statusLabel: 'Completed',
    progress: 100,
    dueDate: '2024-11-30',
    budget: '$75,000',
    lastUpdate: '1 week ago',
    documents: 18,
    messages: 0
  }
];

export default function PortalPage() {
  const { data: session } = useSession();
  const [filterStatus, setFilterStatus] = useState('all');

  // Use session data or fallback to mock
  const user = session?.user || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'ABC Construction',
    role: 'Client'
  };

  const filteredProjects = filterStatus === 'all'
    ? mockProjects
    : mockProjects.filter(p => p.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'review': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your projects and recent activity.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {mockProjects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {mockProjects.filter(p => p.status === 'review').length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {mockProjects.reduce((acc, p) => acc + p.messages, 0)}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">$735K</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Section */}
      <div id="projects">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
          <div className="flex items-center space-x-4">
            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('review')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'review'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                In Review
              </button>
            </div>

            {/* New Estimate Button */}
            <Link
              href="/portal/new-estimate"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>New Estimate Request</span>
            </Link>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/portal/project/${project.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.type}</p>
                    </div>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span>{project.statusLabel}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Due {project.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{project.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{project.documents} documents</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>{project.messages} messages</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Updated {project.lastUpdate}</p>
                    <span className="text-primary-600 text-sm font-medium hover:text-primary-700">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">
              {filterStatus === 'all'
                ? "You don't have any projects yet."
                : `No ${filterStatus} projects found.`}
            </p>
            {filterStatus === 'all' && (
              <Link
                href="/portal/new-estimate"
                className="mt-4 inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Request Your First Estimate</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}