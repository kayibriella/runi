import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "../../lib/utils";
import { LucideIcon, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";

// Import Recharts components
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import {
  DollarSign,
  Package,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";

type StatCardData = {
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
};

type ChartPeriod = "daily" | "weekly" | "monthly";

export function Dashboard() {
  const stats = useQuery(api.dashboard.getStats, { period: "monthly" });
  const currentUser = useCurrentUser();
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("monthly");
  const [activeChart, setActiveChart] = useState(0);

  const statsWithPeriod = useQuery(api.dashboard.getStats, { period: chartPeriod });

  if (!stats || !statsWithPeriod) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-pulse">
        <div className="h-20 bg-gray-100 dark:bg-dark-card rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-dark-card rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-100 dark:bg-dark-card rounded-2xl w-full"></div>
      </div>
    );
  }

  const isLowStockCritical = stats.lowStockCount > 5;

  const statCards: StatCardData[] = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "green",
      indicator: {
        value: parseFloat(stats.revenueGrowth.toFixed(1)),
        isPositive: stats.revenueGrowth >= 0
      }
    },
    {
      title: "Products in Stock",
      value: stats.totalProductsInStock.toLocaleString(),
      icon: Package,
      color: "blue",
      detail: `${stats.productTypes} types, ${stats.fishTypes} fish`
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockCount.toString(),
      icon: AlertTriangle,
      color: "red",
      status: isLowStockCritical ? "critical" : "good"
    },
    {
      title: "Damaged Items",
      value: stats.damagedItemsCount.toString(),
      icon: Zap,
      color: "orange",
      detail: "Daily change and disposal"
    }
  ];

  const revenueChartData = statsWithPeriod.revenueData.map((item, index) => ({
    name: item.name,
    profit: item.value,
    investment: statsWithPeriod.expenseData[index]?.value || 0
  }));

  const financialOverviewData = [
    { name: 'Revenue', value: stats.financialOverview.revenue, color: '#10B981' },
    { name: 'Profit', value: stats.financialOverview.profit, color: '#3B82F6' },
    { name: 'Expenses', value: stats.financialOverview.expenses, color: '#F59E0B' },
    { name: 'Damages', value: stats.financialOverview.damages, color: '#EF4444' }
  ];

  const financialTotal = financialOverviewData.reduce((sum, item) => sum + item.value, 0);
  const netPositive = stats.financialOverview.revenue - stats.financialOverview.expenses;
  const totalCosts = stats.financialOverview.expenses + stats.financialOverview.damages;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md p-3 border border-gray-100 dark:border-dark-border rounded-xl shadow-xl ring-1 ring-black/5">
          <p className="font-bold text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
              <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{entry.name}</span>
              <span className="text-[13px] font-bold" style={{ color: entry.color }}>
                ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  }).format(new Date());

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 pb-24 md:pb-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-5 md:p-6 shadow-sm group">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
          <BarChartIcon className="w-32 h-32 text-blue-600" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">Ntwari Brian</span>! 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {formattedDate}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Zap size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200">System Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - 2x2 Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Financial Overview Card */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-50 dark:border-dark-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Financial Performance</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Revenue vs Investment Analytics</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-bg p-1.5 rounded-2xl border border-gray-100 dark:border-dark-border">
            {(['daily', 'weekly', 'monthly'] as ChartPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  chartPeriod === period
                    ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-md shadow-black/5 ring-1 ring-black/5'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {period === 'daily' ? 'Week' : period === 'weekly' ? 'Month' : '6 Months'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Revenue Area Chart */}
            <div className="lg:col-span-8 space-y-6">
              <div className="h-[300px] sm:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#10B981"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                      name="Revenue"
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="investment"
                      stroke="#3B82F6"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorInvestment)"
                      name="Investment"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Revenue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Investment</span>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-8 lg:space-y-0 lg:pl-10 lg:border-l border-gray-50 dark:border-dark-border/50">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Net Position</h3>
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${netPositive >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                    {netPositive >= 0 ? 'Surplus' : 'Deficit'}
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="p-6 rounded-3xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Total Value</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">${financialTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 px-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Net Positive</p>
                      <p className={`text-base font-bold tracking-tight ${netPositive >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ${netPositive.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Costs</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                        ${totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Profit Margin */}
              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Profitability index</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">
                    {Math.round((stats.financialOverview.profit / stats.financialOverview.revenue) * 100)}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 dark:bg-dark-bg rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                    style={{ width: `${(stats.financialOverview.profit / stats.financialOverview.revenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
