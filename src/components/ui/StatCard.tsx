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
  blue: "bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  green: "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  purple: "bg-purple-50/50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  red: "bg-red-50/50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
  orange: "bg-orange-50/50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

const statusColorClasses = {
  critical: "text-red-600 dark:text-red-400",
  good: "text-emerald-600 dark:text-emerald-400",
};

export function StatCard({ title, value, icon: Icon, color, indicator, detail, status }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-5 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">{title}</p>
          <div className="flex flex-col">
            <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
            {detail && (
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold leading-tight mt-1 opacity-80">{detail}</p>
            )}
            {status && (
              <div className={`mt-2 flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'critical' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                <p className={`text-[10px] font-black uppercase tracking-widest ${statusColorClasses[status]}`}>
                  {status}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${colorClasses[color]}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
      
      {indicator && (
        <div className="mt-5 flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-dark-border/30">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${
            indicator.isPositive 
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
              : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
          }`}>
            {indicator.isPositive ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
            {Math.abs(indicator.value)}%
          </div>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider opacity-60">vs last month</span>
        </div>
      )}
    </div>
  );
}
