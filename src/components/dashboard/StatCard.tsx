'use client';

import { TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  onClick?: () => void;
  href?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, color, onClick, href }: StatCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-6 rounded-xl border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/80 transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 hover:shadow-xl"
    >
      {/* Hover gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
              trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-slate-100 mb-2">{value}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function EnhancedDashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Employees"
        value="285"
        subtitle="↑ 12 this month"
        icon={<Users className="text-blue-200" size={24} />}
        trend={8}
        color="from-blue-500 to-cyan-500"
        href="/employees"
      />
      <StatCard
        title="Present Today"
        value="268"
        subtitle="93.7% attendance rate"
        icon={<Clock className="text-emerald-200" size={24} />}
        trend={2}
        color="from-emerald-500 to-teal-500"
        href="/attendance"
      />
      <StatCard
        title="On Leave"
        value="12"
        subtitle="2 approved, 3 pending"
        icon={<AlertCircle className="text-amber-200" size={24} />}
        trend={-5}
        color="from-amber-500 to-orange-500"
        href="/attendance"
      />
      <StatCard
        title="This Month"
        value="78:45"
        subtitle="Avg hours/employee"
        icon={<TrendingUp className="text-purple-200" size={24} />}
        trend={3}
        color="from-purple-500 to-pink-500"
        href="/attendance"
      />
    </div>
  );
}
