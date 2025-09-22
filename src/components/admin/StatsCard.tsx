'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  format?: 'currency' | 'percentage' | 'number';
  target?: number;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  period,
  icon,
  color = 'blue',
  format = 'number',
  target,
  loading = false
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      text: 'text-gray-600'
    }
  };

  const changeColors = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const calculateProgress = (): number => {
    if (!target || typeof value !== 'number') return 0;
    return Math.min((value / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 ${colorClasses[color].bg} rounded-lg flex items-center justify-center`}>
                <div className={colorClasses[color].icon}>
                  {icon}
                </div>
              </div>
            </div>
          )}
          <div className={`${icon ? 'ml-5' : ''} w-0 flex-1`}>
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatValue(value)}
                </div>
                {change !== undefined && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColors[changeType]}`}>
                    {changeType === 'increase' && <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />}
                    {changeType === 'decrease' && <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />}
                    {changeType === 'neutral' && <Minus className="self-center flex-shrink-0 h-4 w-4" />}
                    <span className="sr-only">
                      {changeType === 'increase' ? 'Increased' : changeType === 'decrease' ? 'Decreased' : 'No change'} by
                    </span>
                    {Math.abs(change)}%
                  </div>
                )}
              </dd>
              {period && (
                <dd className="text-xs text-gray-500">
                  {period}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Progress bar for targets */}
      {target && typeof value === 'number' && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-xs">
            <div className="flex items-center justify-between text-gray-600 mb-1">
              <span>Target: {formatValue(target)}</span>
              <span>{calculateProgress().toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  calculateProgress() >= 100 ? 'bg-green-500' :
                  calculateProgress() >= 75 ? colorClasses[color].text.replace('text-', 'bg-') :
                  'bg-gray-400'
                }`}
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}