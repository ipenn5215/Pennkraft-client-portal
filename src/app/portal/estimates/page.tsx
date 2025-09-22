'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EstimateCard } from '@/components/dashboard/EstimateCard';
import {
  mockEstimateRequests,
  EstimateStatus,
  Priority,
  getEstimatesByStatus,
  getPriorityDisplay
} from '@/lib/estimates';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function EstimatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEstimates = mockEstimateRequests.filter(estimate => {
    const matchesSearch = estimate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estimate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estimate.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (estimate.company && estimate.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || estimate.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusOptions: Array<{ value: EstimateStatus | 'all'; label: string; count: number }> = [
    { value: 'all', label: 'All Estimates', count: mockEstimateRequests.length },
    { value: 'draft', label: 'Draft', count: getEstimatesByStatus('draft').length },
    { value: 'submitted', label: 'Submitted', count: getEstimatesByStatus('submitted').length },
    { value: 'under-review', label: 'Under Review', count: getEstimatesByStatus('under-review').length },
    { value: 'approved', label: 'Approved', count: getEstimatesByStatus('approved').length },
    { value: 'rejected', label: 'Rejected', count: getEstimatesByStatus('rejected').length },
    { value: 'expired', label: 'Expired', count: getEstimatesByStatus('expired').length }
  ];

  const priorityOptions: Array<{ value: Priority | 'all'; label: string }> = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const submittedEstimates = getEstimatesByStatus('submitted');
  const underReviewEstimates = getEstimatesByStatus('under-review');
  const approvedEstimates = getEstimatesByStatus('approved');
  const urgentEstimates = mockEstimateRequests.filter(e => e.priority === 'urgent');

  const totalEstimatedValue = mockEstimateRequests
    .filter(e => e.estimatedValue)
    .reduce((sum, estimate) => sum + (estimate.estimatedValue || 0), 0);

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Estimate Requests</h1>
                <p className="text-gray-600 mt-1">Manage your project estimate requests</p>
              </div>
              <Link href="/portal/estimates/new">
                <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Plus className="h-5 w-5 mr-2" />
                  New Request
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="glass-effect rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Submitted</p>
                  <p className="text-2xl font-bold text-gray-900">{submittedEstimates.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900">{underReviewEstimates.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedEstimates.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-gray-900">{urgentEstimates.length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6 border border-white/20 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search estimates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as EstimateStatus | 'all')}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white min-w-[150px]"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label} ({option.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white min-w-[150px]"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Estimates Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {filteredEstimates.map((estimate, index) => (
              <EstimateCard
                key={estimate.id}
                estimate={estimate}
                index={index}
              />
            ))}
          </motion.div>

          {filteredEstimates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <div className="glass-effect rounded-xl p-8 border border-white/20">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No estimates found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by submitting your first estimate request'
                  }
                </p>
                <Link href="/portal/estimates/new">
                  <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="h-5 w-5 mr-2" />
                    New Request
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}