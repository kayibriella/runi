import { useState } from "react";
import { AddSale } from "../../features/sales/AddSale";
import { ManageSales } from "../../features/sales/ManageSales";
import { AuditSales } from "../../features/sales/AuditSales";
import { SubTabs } from "../../components/ui/SubTabs";
import { motion, AnimatePresence } from "framer-motion";
import { DebtorsList } from "../../components/DebtorsList"; // Assuming this is used in Sales
import { useStaffPermissions } from "./hooks/useStaffPermissions";

type TabType = "add" | "manage" | "audit" | "debtors";

export function StaffSales() {
    const { permissions, isLoading } = useStaffPermissions();
    const [activeTab, setActiveTab] = useState<TabType>("add");

    if (isLoading) return <div>Loading permissions...</div>;
    if (!permissions.canViewSales) return <div className="p-8 text-center text-gray-500">Access Denied</div>;

    const tabs = [];
    // "Add Sale" usually corresponds to general sales access or specific "add" permission? 
    // permissions.md doesn't explicitly list "Add Sale" tab permission, but "Manage Sales" has view/edit/delete.
    // Assuming basic view sales allows adding? Or maybe it needs a key. 
    // For now, I'll allow "Add Sale" if canViewSales is true, as it's the primary function.
    if (permissions.canViewSales) tabs.push({ id: "add", label: "Add Sale" });
    if (permissions.canViewSalesConfig) tabs.push({ id: "manage", label: "Manage Sales" });
    if (permissions.canViewSalesAudit) tabs.push({ id: "audit", label: "Audit Sales" });
    // Debtors might be part of Cash Tracking or Sales. In Sales.tsx it's there. 
    // In permissions.md, Debtors is under Cash Tracking. 
    // I will hide it here if strict adherence to permissions.md, or check canViewDebtors.
    if (permissions.canViewDebtors) tabs.push({ id: "debtors", label: "Debtors" });


    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-dark-text tracking-tight">
                    Sales (Staff)
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-body text-lg">
                    Record and manage sales transactions.
                </p>
            </div>

            <SubTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={(id) => setActiveTab(id as TabType)}
            />

            <div className="relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {activeTab === "add" && <AddSale />}
                        {activeTab === "manage" && permissions.canViewSalesConfig && (
                            <ManageSales
                                canEdit={permissions.canEditSalesConfig}
                                canDelete={permissions.canDeleteSalesConfig}
                            />
                        )}
                        {activeTab === "audit" && permissions.canViewSalesAudit && <AuditSales />}
                        {/* AuditSales might need props for confirm/reject if it has them */}
                        {activeTab === "debtors" && permissions.canViewDebtors && <DebtorsList />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
