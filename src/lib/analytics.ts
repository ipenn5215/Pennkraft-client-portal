import { RevenueData, BusinessMetrics } from '@/types/admin';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  metrics: string[];
  comparison?: {
    period: 'previous' | 'last_year';
    enabled: boolean;
  };
}

export interface KPICard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  format: 'currency' | 'percentage' | 'number';
  target?: number;
  icon: string;
}

export interface TrendData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  forecast?: number[];
}

export const analyticsService = {
  // Revenue Analytics
  generateRevenueChart(data: RevenueData[], granularity: 'monthly' | 'quarterly' = 'monthly'): ChartData {
    const grouped = this.groupDataByPeriod(data, granularity);

    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'Revenue',
          data: Object.values(grouped),
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2
        }
      ]
    };
  },

  // Project Analytics
  generateProjectStatusChart(projects: any[]): ChartData {
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: 'Projects',
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',   // completed - green
            'rgba(59, 130, 246, 0.8)',  // in-progress - blue
            'rgba(245, 158, 11, 0.8)',  // pending - yellow
            'rgba(239, 68, 68, 0.8)',   // delayed - red
            'rgba(156, 163, 175, 0.8)'  // cancelled - gray
          ]
        }
      ]
    };
  },

  // Client Analytics
  generateClientValueChart(clients: any[]): ChartData {
    const topClients = clients
      .sort((a, b) => b.lifetime_value - a.lifetime_value)
      .slice(0, 10);

    return {
      labels: topClients.map(c => c.company || c.name),
      datasets: [
        {
          label: 'Lifetime Value',
          data: topClients.map(c => c.lifetime_value),
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 1
        }
      ]
    };
  },

  // KPI Generation
  generateKPICards(metrics: BusinessMetrics): KPICard[] {
    return [
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        value: this.formatCurrency(metrics.totalRevenue),
        change: metrics.revenueGrowth,
        changeType: metrics.revenueGrowth > 0 ? 'increase' : 'decrease',
        period: 'vs last year',
        format: 'currency',
        target: 3000000,
        icon: '💰'
      },
      {
        id: 'monthly-revenue',
        title: 'Monthly Revenue',
        value: this.formatCurrency(metrics.monthlyRevenue),
        change: 12.3,
        changeType: 'increase',
        period: 'vs last month',
        format: 'currency',
        target: 300000,
        icon: '📈'
      },
      {
        id: 'active-projects',
        title: 'Active Projects',
        value: metrics.activeProjects.toString(),
        change: 8.7,
        changeType: 'increase',
        period: 'vs last month',
        format: 'number',
        target: 30,
        icon: '🏗️'
      },
      {
        id: 'conversion-rate',
        title: 'Conversion Rate',
        value: `${metrics.conversionRate}%`,
        change: 3.2,
        changeType: 'increase',
        period: 'vs last quarter',
        format: 'percentage',
        target: 70,
        icon: '🎯'
      },
      {
        id: 'client-retention',
        title: 'Client Retention',
        value: `${metrics.clientRetentionRate}%`,
        change: -1.2,
        changeType: 'decrease',
        period: 'vs last year',
        format: 'percentage',
        target: 85,
        icon: '🤝'
      },
      {
        id: 'avg-project-value',
        title: 'Avg Project Value',
        value: this.formatCurrency(metrics.averageProjectValue),
        change: 15.8,
        changeType: 'increase',
        period: 'vs last quarter',
        format: 'currency',
        target: 20000,
        icon: '💼'
      }
    ];
  },

  // Trend Analysis
  calculateTrends(currentData: any[], historicalData: any[], metric: string): TrendData {
    const current = this.calculateMetricValue(currentData, metric);
    const previous = this.calculateMetricValue(historicalData, metric);
    const change = ((current - previous) / previous) * 100;

    return {
      metric,
      current,
      previous,
      change,
      trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      forecast: this.generateForecast(currentData, metric)
    };
  },

  // Forecasting
  generateForecast(data: any[], metric: string, periods: number = 3): number[] {
    // Simple linear regression for forecasting
    const values = data.map(d => this.calculateMetricValue([d], metric));
    const n = values.length;

    if (n < 2) return [];

    const xSum = values.reduce((sum, _, i) => sum + i, 0);
    const ySum = values.reduce((sum, val) => sum + val, 0);
    const xxSum = values.reduce((sum, _, i) => sum + i * i, 0);
    const xySum = values.reduce((sum, val, i) => sum + i * val, 0);

    const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    const forecast = [];
    for (let i = 1; i <= periods; i++) {
      const futureValue = slope * (n + i - 1) + intercept;
      forecast.push(Math.max(0, futureValue));
    }

    return forecast;
  },

  // Performance Metrics
  calculatePerformanceMetrics(projects: any[], timeframe: string) {
    const now = new Date();
    const startDate = this.getStartDate(timeframe);

    const filteredProjects = projects.filter(p =>
      new Date(p.createdAt) >= startDate && new Date(p.createdAt) <= now
    );

    const completed = filteredProjects.filter(p => p.status === 'completed');
    const delayed = filteredProjects.filter(p => p.status === 'delayed');
    const onTime = completed.filter(p =>
      new Date(p.actualCompletion || p.updatedAt) <= new Date(p.dueDate)
    );

    return {
      totalProjects: filteredProjects.length,
      completedProjects: completed.length,
      onTimeDelivery: completed.length > 0 ? (onTime.length / completed.length) * 100 : 0,
      delayedProjects: delayed.length,
      averageCompletionTime: this.calculateAverageCompletionTime(completed),
      productivityScore: this.calculateProductivityScore(filteredProjects)
    };
  },

  // Risk Analytics
  assessProjectRisks(projects: any[]) {
    return projects.map(project => {
      const riskScore = this.calculateRiskScore(project);
      const riskFactors = this.identifyRiskFactors(project);

      return {
        projectId: project.id,
        title: project.title,
        riskScore,
        riskLevel: this.getRiskLevel(riskScore),
        riskFactors,
        recommendations: this.generateRiskRecommendations(riskFactors)
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  },

  // Financial Analytics
  calculateProfitability(projects: any[], expenses: any[] = []) {
    return projects.map(project => {
      const revenue = project.estimateAmount || 0;
      const projectExpenses = expenses.filter(e => e.projectId === project.id);
      const totalExpenses = projectExpenses.reduce((sum, e) => sum + e.amount, 0);

      const profit = revenue - totalExpenses;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        projectId: project.id,
        title: project.title,
        revenue,
        expenses: totalExpenses,
        profit,
        margin,
        roi: totalExpenses > 0 ? (profit / totalExpenses) * 100 : 0
      };
    });
  },

  // Utility Functions
  groupDataByPeriod(data: RevenueData[], granularity: 'monthly' | 'quarterly'): Record<string, number> {
    return data.reduce((acc, item) => {
      const date = new Date(item.date);
      let key: string;

      if (granularity === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
      }

      acc[key] = (acc[key] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);
  },

  calculateMetricValue(data: any[], metric: string): number {
    switch (metric) {
      case 'revenue':
        return data.reduce((sum, item) => sum + (item.amount || item.revenue || 0), 0);
      case 'projects':
        return data.length;
      case 'clients':
        return new Set(data.map(item => item.clientId)).size;
      default:
        return 0;
    }
  },

  getStartDate(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  },

  calculateAverageCompletionTime(projects: any[]): number {
    if (projects.length === 0) return 0;

    const completionTimes = projects.map(p => {
      const start = new Date(p.createdAt);
      const end = new Date(p.actualCompletion || p.updatedAt);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
    });

    return completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
  },

  calculateProductivityScore(projects: any[]): number {
    if (projects.length === 0) return 0;

    const completed = projects.filter(p => p.status === 'completed').length;
    const onTime = projects.filter(p =>
      p.status === 'completed' &&
      new Date(p.actualCompletion || p.updatedAt) <= new Date(p.dueDate)
    ).length;

    const qualityScore = projects.reduce((sum, p) => sum + (p.qualityScore || 80), 0) / projects.length;

    return (completed / projects.length * 40) + (onTime / projects.length * 40) + (qualityScore / 100 * 20);
  },

  calculateRiskScore(project: any): number {
    let score = 0;

    // Timeline risk
    const daysUntilDue = (new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntilDue < 7) score += 30;
    else if (daysUntilDue < 14) score += 20;
    else if (daysUntilDue < 30) score += 10;

    // Budget risk
    if (project.actualCost > project.estimateAmount * 1.1) score += 25;
    else if (project.actualCost > project.estimateAmount) score += 15;

    // Complexity risk
    if (project.complexity === 'complex') score += 20;
    else if (project.complexity === 'moderate') score += 10;

    // Status risk
    if (project.status === 'delayed') score += 30;
    else if (project.status === 'at-risk') score += 20;

    return Math.min(score, 100);
  },

  identifyRiskFactors(project: any): string[] {
    const factors = [];

    const daysUntilDue = (new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysUntilDue < 7) factors.push('Tight deadline');

    if (project.actualCost > project.estimateAmount) factors.push('Budget overrun');
    if (project.complexity === 'complex') factors.push('High complexity');
    if (project.status === 'delayed') factors.push('Current delays');
    if (project.resourcesAllocated?.length < 2) factors.push('Limited resources');

    return factors;
  },

  generateRiskRecommendations(riskFactors: string[]): string[] {
    const recommendations = [];

    if (riskFactors.includes('Tight deadline')) {
      recommendations.push('Consider expediting critical path tasks');
    }
    if (riskFactors.includes('Budget overrun')) {
      recommendations.push('Review and optimize resource allocation');
    }
    if (riskFactors.includes('High complexity')) {
      recommendations.push('Assign senior team members');
    }
    if (riskFactors.includes('Current delays')) {
      recommendations.push('Implement recovery plan');
    }
    if (riskFactors.includes('Limited resources')) {
      recommendations.push('Consider additional resource allocation');
    }

    return recommendations;
  },

  getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    return 'high';
  },

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
};