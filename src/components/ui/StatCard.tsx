import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "red" | "orange";
  indicator?: {
    value: number;
    isPositive: boolean;
  };
  detail?: string;
  status?: "critical" | "good";
}

const colorClasses = {
  blue: "bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
  green: "bg-green-50/50 dark:bg-green-900/10 text-green-600 dark:text-green-400",
  purple: "bg-purple-50/50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400",
  red: "bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400",
  orange: "bg-orange-50/50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400",
};

const iconWrapperClasses = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
};

const statusColorClasses = {
  critical: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  good: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
};

export function StatCard({ title, value, icon: Icon, color, indicator, detail, status }: StatCardProps) {
  return (
    <div className="group relative bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text">{value}</h3>
          </div>
          
          {detail && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1">{detail}</p>
          )}
          
          {status && (
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${statusColorClasses[status]}`}>
              {status}
            </div>
          )}
        </div>
        
        <div className={`p-2.5 rounded-xl transition-colors duration-300 ${iconWrapperClasses[color]}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      
      {indicator && (
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-dark-border/50 flex items-center justify-between">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            indicator.isPositive 
              ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20' 
              : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
          }`}>
            {indicator.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(indicator.value)}%
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">vs last month</span>
        </div>
      )}
    </div>
  );
}
