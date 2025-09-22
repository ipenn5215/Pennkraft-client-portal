'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  FileText,
  Calendar,
  Settings,
  LogOut,
  User,
  Bell,
  Plus,
  ArrowRight,
  Briefcase,
  Clock,
  DollarSign,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { EstimateCard } from '@/components/dashboard/EstimateCard';
import {
  mockProjects,
  getProjectsByStatus,
  getOverdueProjects,
  getUpcomingMilestones
} from '@/lib/projects';
import {
  mockEstimateRequests,
  getEstimatesByStatus
} from '@/lib/estimates';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-effect rounded-xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-sm mt-1 ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </p>
        </div>
        <div className="p-3 bg-primary-100 rounded-lg">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, href }) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full text-left glass-effect rounded-xl p-6 border border-white/20 hover:border-primary-200 transition-all cursor-pointer"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
      </motion.div>
    </Link>
  );
};

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Calculate real stats from data
  const activeProjects = mockProjects.filter(p => ['pending', 'in-progress', 'review'].includes(p.status));
  const pendingEstimates = getEstimatesByStatus('submitted').length + getEstimatesByStatus('under-review').length;
  const overdueProjects = getOverdueProjects();
  const upcomingMilestones = getUpcomingMilestones(7);
  const totalValue = activeProjects.reduce((sum, project) => sum + project.estimatedCost, 0);

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjects.length.toString(),
      change: `${mockProjects.filter(p => p.status === 'in-progress').length} in progress`,
      icon: <Briefcase className="h-6 w-6 text-primary-600" />,
      trend: 'up' as const,
    },
    {
      title: 'Pending Estimates',
      value: pendingEstimates.toString(),
      change: `${getEstimatesByStatus('submitted').length} submitted`,
      icon: <FileText className="h-6 w-6 text-primary-600" />,
      trend: 'up' as const,
    },
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      change: `${getProjectsByStatus('completed').length} completed`,
      icon: <DollarSign className="h-6 w-6 text-primary-600" />,
      trend: 'up' as const,
    },
    {
      title: 'Upcoming Milestones',
      value: upcomingMilestones.length.toString(),
      change: `${overdueProjects.length} overdue`,
      icon: <Clock className="h-6 w-6 text-primary-600" />,
      trend: overdueProjects.length > 0 ? 'down' as const : 'up' as const,
    },
  ];

  const quickActions = [
    {
      title: 'New Estimate',
      description: 'Request a new project estimate',
      icon: <Plus className="h-6 w-6 text-primary-600" />,
      href: '/portal/estimates/new',
    },
    {
      title: 'View Projects',
      description: 'Manage your active projects',
      icon: <Briefcase className="h-6 w-6 text-primary-600" />,
      href: '/portal/projects',
    },
    {
      title: 'View Estimates',
      description: 'Track your estimate requests',
      icon: <FileText className="h-6 w-6 text-primary-600" />,
      href: '/portal/estimates',
    },
  ];

  // Get recent projects and estimates for preview
  const recentProjects = [...mockProjects]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  const recentEstimates = [...mockEstimateRequests]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 2);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="glass-effect border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  Pennkraft Portal
                </motion.h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Bell className="h-6 w-6" />
                </motion.button>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.company || 'Individual'}</p>
                  </div>
                  
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your projects today.
            </p>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <QuickAction {...action} />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Alerts and Notifications */}
          {(overdueProjects.length > 0 || upcomingMilestones.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-xl p-6 border border-white/20 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Alerts & Notifications</h3>
              <div className="space-y-4">
                {overdueProjects.length > 0 && (
                  <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">
                        {overdueProjects.length} project{overdueProjects.length > 1 ? 's' : ''} overdue
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        {overdueProjects.slice(0, 2).map(p => p.title).join(', ')}
                        {overdueProjects.length > 2 && ` and ${overdueProjects.length - 2} more`}
                      </p>
                    </div>
                  </div>
                )}
                {upcomingMilestones.length > 0 && (
                  <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        {upcomingMilestones.length} milestone{upcomingMilestones.length > 1 ? 's' : ''} due this week
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        {upcomingMilestones.slice(0, 2).map(m => m.title).join(', ')}
                        {upcomingMilestones.length > 2 && ` and ${upcomingMilestones.length - 2} more`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Projects</h3>
              <Link href="/portal/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {recentProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
            {recentProjects.length === 0 && (
              <div className="glass-effect rounded-xl p-8 border border-white/20 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No projects yet</p>
                <Link href="/portal/estimates/new">
                  <button className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Your First Estimate
                  </button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Estimates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Estimate Requests</h3>
              <Link href="/portal/estimates" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentEstimates.map((estimate, index) => (
                <EstimateCard key={estimate.id} estimate={estimate} index={index} />
              ))}
            </div>
            {recentEstimates.length === 0 && (
              <div className="glass-effect rounded-xl p-8 border border-white/20 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">No estimates requested yet</p>
                <Link href="/portal/estimates/new">
                  <button className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Request New Estimate
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}