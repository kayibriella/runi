import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "../../features/dashboard/Dashboard";
import { Products } from "../../features/products/Products";
import { Sales } from "../../features/sales/Sales";
import { Expenses } from "../../features/expenses/Expenses";
import { Documents } from "../../features/documents/Documents";
import { Reports } from "../../features/reports/Reports";
import { Users } from "../../features/users/Users";
import { Settings } from "../../features/settings/Settings";
import { Transactions } from "../../features/transactions/Transactions";

export type ModuleType =
  | "dashboard"
  | "products"
  | "sales"
  | "expenses"
  | "documents"
  | "reports"
  | "users"
  | "settings"
  | "transactions";

import { Navbar } from "./Navbar";
import { BarChart3, Package, ShoppingCart, Menu, Banknote } from "lucide-react";

export function BusinessDashboard() {
  const [activeModule, setActiveModule] = useState<ModuleType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "sales":
        return <Sales />;
      case "expenses":
        return <Expenses />;
      case "documents":
        return <Documents />;
      case "reports":
        return <Reports />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      case "transactions":
        return <Transactions />;
      default:
        return <Dashboard />;
    }
  };

  // Bottom navigation items for mobile
  const bottomNavItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "expenses", label: "Expenses", icon: Banknote },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:static fixed inset-y-0 left-0 z-30`}>
        <Sidebar activeModule={activeModule} onModuleChange={(module) => {
          setActiveModule(module);
          // Close sidebar on mobile after selection
          if (window.innerWidth < 768) setSidebarOpen(false);
        }} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-auto md:ml-0">
        <Navbar />
        <div className="flex-1 overflow-auto">
          {renderModule()}
        </div>

        {/* Bottom Navigation for mobile */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-lg border border-gray-200/70 dark:border-dark-border/70 rounded-2xl shadow-xl shadow-gray-300/20 dark:shadow-black/30 z-10 transition-all duration-300">
          <div className="flex justify-around items-center py-2.5 px-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id as ModuleType)}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 transform ${isActive
                    ? "text-blue-600 dark:text-blue-400 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30' 
                    : 'bg-gray-100/80 dark:bg-dark-card hover:bg-gray-200/80 dark:hover:bg-dark-card/80'}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs mt-1.5 font-semibold tracking-tight">{item.label}</span>
                </button>
              );
            })}

            {/* More button to open sidebar */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center py-2 px-3 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 group"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
                <Menu size={20} />
              </div>
              <span className="text-xs mt-1.5 font-semibold tracking-tight">More</span>
            </button>
          </div>
        </div>

        {/* Add padding to content to prevent overlap with bottom nav */}
        <div className="md:hidden h-20"></div>
      </main>
    </div>
  );
}