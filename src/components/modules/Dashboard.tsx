import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

import {
  DollarSign,
  Package,
  AlertTriangle,
  Zap,
  ShoppingCart,
  TrendingUp,
  Receipt,
  Plus
} from "lucide-react";
import { StatCard } from "../ui/StatCard";
import { Button } from "../ui/Button";

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

export function Dashboard() {
  const stats = useQuery(api.dashboard.getStats, { period: "monthly" });
  const currentUser = useCurrentUser();

  if (!stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate if low stock is critical (more than 5 items)
  const isLowStockCritical = stats.lowStockCount > 5;

  // Create stat cards data
  const statCards: StatCardData[] = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "green",
      indicator: {
        value: parseFloat(stats.revenueGrowth.toFixed(1)),
        isPositive: stats.revenueGrowth >= 0
      }
    },
    {
      title: "Products in Stock",
      value: stats.totalProductsInStock.toString(),
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
      detail: "Daily change and disposal status"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-white">
        <h1 className="text-2xl font-bold">Hello {currentUser?.fullName || currentUser?.name || "there"} 👋</h1>
        <p className="text-blue-100 mt-1">Welcome back to your dashboard overview</p>
      </div>

      {/* Stats Cards - Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Stats Cards - Mobile Horizontal Scroll with Auto Animation */}
      <div className="md:hidden auto-scroll-container">
        <div className="auto-scroll-content">
          {/* First set of cards */}
          {statCards.map((card, index) => (
            <div key={`first-${index}`} className="flex-none w-64">
              <StatCard {...card} />
            </div>
          ))}
          {/* Duplicate set for seamless looping */}
          {statCards.map((card, index) => (
            <div key={`second-${index}`} className="flex-none w-64">
              <StatCard {...card} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            Add Sale
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Package size={16} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        {stats.lowStockCount > 0 && (
          <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-amber-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Stock Alerts</h2>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded-full">
                {stats.lowStockCount}
              </span>
            </div>
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-dark-text">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      {product.stock} left
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Min: {product.minStock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Sales */}
        <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">Recent Sales</h2>
          <div className="space-y-3">
            {stats.recentSales.map((sale) => (
              <div key={sale._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-card/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-dark-text">{sale.customerName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(sale._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-dark-text">${sale.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${sale.status === "completed"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : sale.status === "partial"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}