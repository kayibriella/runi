import { useState } from "react";
import { Deposited } from "../../features/cash-tracking/Deposited";
import { Debtors } from "../../features/cash-tracking/Debtors"; // Note: CashTracking.tsx uses Debtors, Sales uses DebtorsList?
// Double check import in CashTracking.tsx: import { Debtors } from "./Debtors";
import { SubTabs } from "../../components/ui/SubTabs";
import { motion, AnimatePresence } from "framer-motion";
import { useStaffPermissions } from "./hooks/useStaffPermissions";

type TabType = "deposited" | "debtors";

export function StaffCashTracking() {
    const { permissions, isLoading } = useStaffPermissions();
    const [activeTab, setActiveTab] = useState<TabType>("deposited");

    if (isLoading) return <div>Loading permissions...</div>;
    if (!permissions.canViewCashTracking) return <div className="p-8 text-center text-gray-500">Access Denied</div>;

    const tabs = [];
    if (permissions.canViewDeposited) tabs.push({ id: "deposited", label: "Deposited" });
    if (permissions.canViewDebtors) tabs.push({ id: "debtors", label: "Unpaid/Debtors" });

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-dark-text tracking-tight">
                    Cash Tracking (Staff)
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-body text-lg">
                    Monitor financial flows.
                </p>
            </div>

            {tabs.length > 0 && (
                <SubTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={(id) => setActiveTab(id as TabType)}
                />
            )}

            <div className="relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {activeTab === "deposited" && permissions.canViewDeposited && (
                            <Deposited
                                canCreate={permissions.canCreateDeposited}
                                canDelete={permissions.canDeleteDeposited}
                            />
                        )}
                        {activeTab === "debtors" && permissions.canViewDebtors && <Debtors />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
