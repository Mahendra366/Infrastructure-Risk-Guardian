import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'error';
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  trend,
  status,
  icon: Icon
}) => {
  const statusStyles = {
    good: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    warning: 'text-amber-600 bg-amber-50 border-amber-100',
    error: 'text-rose-600 bg-rose-50 border-rose-100'
  };

  const trendIcon = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    stable: <Minus className="w-4 h-4" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5 group hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg border", statusStyles[status])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {trendIcon[trend]}
          {trend.toUpperCase()}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{value}</h3>
          {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: status === 'good' ? '100%' : '60%' }}
          className={cn("h-full",
            status === 'good' ? 'bg-emerald-500' :
            status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
          )}
        />
      </div>
    </motion.div>
  );
};
