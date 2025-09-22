export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager';
  permissions: AdminPermission[];
  createdAt: string;
  lastLogin?: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  resource: 'clients' | 'projects' | 'estimates' | 'users' | 'analytics' | 'settings';
  actions: ('read' | 'write' | 'delete' | 'approve')[];
}

export interface BusinessMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  yearlyRevenue: number;
  revenueGrowth: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingEstimates: number;
  conversionRate: number;
  averageProjectValue: number;
  totalClients: number;
  activeClients: number;
  newClients: number;
  clientRetentionRate: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  projectType: string;
  clientId: string;
}

export interface ProjectAnalytics {
  id: string;
  title: string;
  client: string;
  value: number;
  profitMargin: number;
  daysToComplete: number;
  status: 'on-track' | 'delayed' | 'at-risk' | 'completed';
  completion: number;
}

export interface ClientAnalytics {
  id: string;
  name: string;
  company: string;
  totalProjects: number;
  totalValue: number;
  averageProjectValue: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'prospect';
  acquisition: string;
  retention: number;
}

export interface EstimateAnalytics {
  id: string;
  clientName: string;
  projectType: string;
  value: number;
  submittedAt: string;
  daysInReview: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  complexity: 'simple' | 'moderate' | 'complex';
  winProbability: number;
}

export interface AdminNotification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface AdminFilter {
  dateRange: {
    start: string;
    end: string;
  };
  status?: string[];
  clientIds?: string[];
  projectTypes?: string[];
  valueRange?: {
    min: number;
    max: number;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface AdminDashboardData {
  metrics: BusinessMetrics;
  recentProjects: ProjectAnalytics[];
  pendingEstimates: EstimateAnalytics[];
  topClients: ClientAnalytics[];
  notifications: AdminNotification[];
  revenueChart: RevenueData[];
  alerts: {
    overdue: number;
    atRisk: number;
    newEstimates: number;
    needsApproval: number;
  };
}

export interface CRMClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  source: 'website' | 'referral' | 'marketing' | 'cold_outreach' | 'repeat';
  createdAt: string;
  lastContact?: string;
  nextFollowUp?: string;
  status: 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
  lifetime_value: number;
  projects: Project[];
  communications: CommunicationLog[];
  notes: CRMNote[];
  tags: string[];
}

export interface CommunicationLog {
  id: string;
  type: 'email' | 'phone' | 'meeting' | 'proposal' | 'follow_up';
  subject: string;
  content: string;
  date: string;
  direction: 'inbound' | 'outbound';
  outcome?: string;
  nextAction?: string;
  adminId: string;
}

export interface CRMNote {
  id: string;
  content: string;
  type: 'general' | 'project' | 'sales' | 'support';
  createdAt: string;
  createdBy: string;
  isPrivate: boolean;
}

export interface BulkOperation {
  id: string;
  type: 'status_update' | 'assign_user' | 'send_email' | 'export_data';
  targetType: 'projects' | 'clients' | 'estimates';
  targetIds: string[];
  parameters: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  results?: {
    success: number;
    failed: number;
    errors: string[];
  };
}

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Extended Project interface for admin view
export interface AdminProject extends Project {
  profitMargin: number;
  resourcesAllocated: string[];
  estimatedHours: number;
  actualHours?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  tags: string[];
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
}

// Extended Estimate interface for admin view
export interface AdminEstimate extends EstimateRequest {
  estimatedValue?: number;
  actualValue?: number;
  winProbability: number;
  competitorCount?: number;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  complexity: 'simple' | 'moderate' | 'complex';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  approvedBy?: string;
  approvedAt?: string;
  internalNotes: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  projectId: string;
  client: string;
  trades: TradeWork[];
  totalValue: number;
  startDate: string;
  expectedCompletion: string;
  actualCompletion?: string;
  status: 'not_started' | 'in_progress' | 'delayed' | 'completed' | 'on_hold';
  progress: number;
  criticalPath: CriticalPathItem[];
  milestones: Milestone[];
  risks: Risk[];
}

export interface TradeWork {
  id: string;
  trade: 'painting' | 'tile' | 'flooring' | 'drywall' | 'glass' | 'storefront';
  contractor?: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  value: number;
  dependencies: string[];
}

export interface CriticalPathItem {
  id: string;
  task: string;
  startDate: string;
  endDate: string;
  duration: number;
  dependencies: string[];
  isOnCriticalPath: boolean;
  slack: number;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'current' | 'completed' | 'overdue';
  description: string;
  dependencies: string[];
}

export interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category: 'schedule' | 'budget' | 'quality' | 'safety' | 'regulatory';
  mitigation: string;
  owner: string;
  status: 'identified' | 'monitoring' | 'mitigated' | 'closed';
}