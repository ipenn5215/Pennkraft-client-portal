'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FolderOpen,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { adminService, formatCurrency, formatPercentage, getStatusColor } from '@/lib/admin-db';
import { analyticsService } from '@/lib/analytics';
import { AdminDashboardData, KPICard } from '@/types/admin';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [kpiCards, setKpiCards] = useState<KPICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    loadDashboardData();
  }, [timeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardData();
      const kpis = analyticsService.generateKPICards(data.metrics);

      setDashboardData(data);
      setKpiCards(kpis);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const { metrics, recentProjects, pendingEstimates, topClients, notifications, alerts } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Alerts */}
      {(alerts.overdue > 0 || alerts.atRisk > 0 || alerts.needsApproval > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {alerts.overdue > 0 && (
                    <li>{alerts.overdue} overdue project{alerts.overdue > 1 ? 's' : ''}</li>
                  )}
                  {alerts.atRisk > 0 && (
                    <li>{alerts.atRisk} project{alerts.atRisk > 1 ? 's' : ''} at risk</li>
                  )}
                  {alerts.needsApproval > 0 && (
                    <li>{alerts.needsApproval} estimate{alerts.needsApproval > 1 ? 's' : ''} need approval</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiCards.map((kpi) => (
          <div key={kpi.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{kpi.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{kpi.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{kpi.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        kpi.changeType === 'increase' ? 'text-green-600' :
                        kpi.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {kpi.changeType === 'increase' ? (
                          <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                        ) : kpi.changeType === 'decrease' ? (
                          <ArrowDownRight className="self-center flex-shrink-0 h-4 w-4" />
                        ) : null}
                        <span className="sr-only">
                          {kpi.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                        </span>
                        {Math.abs(kpi.change)}%
                      </div>
                    </dd>
                    <dd className="text-xs text-gray-500">{kpi.period}</dd>
                  </dl>
                </div>
              </div>
            </div>
            {kpi.target && (
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Target: {kpi.format === 'currency' ? formatCurrency(kpi.target) : kpi.target}</span>
                    <span>{((parseFloat(kpi.value.replace(/[^0-9.-]+/g, '')) / kpi.target) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{
                        width: `${Math.min((parseFloat(kpi.value.replace(/[^0-9.-]+/g, '')) / kpi.target) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
                <Link
                  href="/admin/projects"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <div key={project.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">{project.title}</h4>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{project.client}</span>
                        <span className="mx-2">•</span>
                        <span>{formatCurrency(project.value)}</span>
                        <span className="mx-2">•</span>
                        <span>{project.completion}% complete</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPercentage(project.profitMargin)} margin
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.daysToComplete} days remaining
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          project.status === 'on-track' ? 'bg-green-500' :
                          project.status === 'delayed' ? 'bg-red-500' :
                          project.status === 'at-risk' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Estimates */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Pending Estimates</h3>
                <Link
                  href="/admin/estimates"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingEstimates.map((estimate) => (
                <div key={estimate.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{estimate.clientName}</h4>
                      <div className="mt-1 text-sm text-gray-500">
                        <div>{estimate.projectType} • {formatCurrency(estimate.value)}</div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {estimate.daysInReview} days in review
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(estimate.priority)}`}>
                        {estimate.priority}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">
                        {estimate.winProbability}% win rate
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Top Clients</h3>
                <Link
                  href="/admin/clients"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {topClients.map((client) => (
                <div key={client.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{client.name}</h4>
                      <div className="mt-1 text-sm text-gray-500">
                        <div>{client.company}</div>
                        <div>{client.totalProjects} projects • {formatCurrency(client.totalValue)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatPercentage(client.retention)} retention
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href="/admin/estimates?status=pending"
                className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition-colors"
              >
                <FileText className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <div className="text-sm font-medium text-yellow-800">
                    Review Estimates ({alerts.needsApproval})
                  </div>
                  <div className="text-xs text-yellow-600">Estimates waiting for approval</div>
                </div>
              </Link>

              <Link
                href="/admin/projects?status=delayed"
                className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <div className="text-sm font-medium text-red-800">
                    Address Delays ({alerts.overdue})
                  </div>
                  <div className="text-xs text-red-600">Projects past due date</div>
                </div>
              </Link>

              <Link
                href="/admin/clients?status=prospect"
                className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <div className="text-sm font-medium text-blue-800">
                    Follow Up Prospects ({metrics.newClients})
                  </div>
                  <div className="text-xs text-blue-600">New clients to contact</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="px-6 py-4">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mt-0.5 ${
                    notification.type === 'urgent' ? 'text-red-500' :
                    notification.type === 'warning' ? 'text-yellow-500' :
                    notification.type === 'success' ? 'text-green-500' : 'text-blue-500'
                  }`}>
                    {notification.type === 'urgent' && <AlertTriangle className="h-5 w-5" />}
                    {notification.type === 'warning' && <Clock className="h-5 w-5" />}
                    {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
                    {notification.type === 'info' && <Target className="h-5 w-5" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    {notification.actionUrl && (
                      <div className="mt-2">
                        <Link
                          href={notification.actionUrl}
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          {notification.actionText || 'View Details'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}