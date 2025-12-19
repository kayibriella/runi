import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "../../lib/utils";
import { LucideIcon, ChevronLeft, ChevronRight, Calendar, Filter, Download } from "lucide-react";
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

// Define the type for our stat cards
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
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
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
      title: "Inventory Status",
      value: stats.totalProductsInStock.toLocaleString(),
      icon: Package,
      color: "blue",
      detail: `${stats.productTypes} categories, ${stats.fishTypes} species`
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockCount.toString(),
      icon: AlertTriangle,
      color: "red",
      status: isLowStockCritical ? "critical" : "good"
    },
    {
      title: "Asset Protection",
      value: stats.damagedItemsCount.toString(),
      icon: Zap,
      color: "orange",
      detail: "Daily breakage & losses report"
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

  const nextChart = () => setActiveChart((prev) => (prev === 1 ? 0 : prev + 1));
  const prevChart = () => setActiveChart((prev) => (prev === 0 ? 1 : prev - 1));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm p-4 border border-gray-100 dark:border-dark-border rounded-xl shadow-xl ring-1 ring-black/5">
          <p className="font-bold text-gray-900 dark:text-dark-text mb-2 text-sm">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{entry.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-dark-text">
                  ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-text tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Welcome back, <span className="text-blue-600 dark:text-blue-400">{currentUser?.fullName || currentUser?.name || "Member"}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">
            <Download size={16} />
            <span className="hidden sm:inline">Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Main Insights Card */}
      <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Filter size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">Financial Performance</h2>
              <p className="text-sm text-gray-500 font-medium">Tracking revenue and operational costs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-dark-bg/50 p-1 rounded-xl border border-gray-100 dark:border-dark-border/50">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  chartPeriod === period 
                    ? 'bg-white dark:bg-dark-card text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-[350px] w-100%">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-dark-border/50" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="Gross Profit"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="investment"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorInvestment)"
                    name="Total Investment"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Resource Allocation</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialOverviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {financialOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {financialOverviewData.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.name}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-dark-text">
                      ${item.value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-dark-border/50">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-dark-bg/50 rounded-2xl border border-gray-100 dark:border-dark-border/50">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Net Position</p>
                  <p className={`text-xl font-black ${netPositive >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${netPositive.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Liability</p>
                  <p className="text-xl font-black text-gray-900 dark:text-dark-text">
                    ${totalCosts.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
