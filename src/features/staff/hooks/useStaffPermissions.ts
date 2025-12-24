import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// Define the structure of our permissions
export interface StaffPermissions {
    // Products
    canViewProducts: boolean;
    canManageVariables: boolean;
    canViewCategories: boolean;
    canCreateCategories: boolean;
    canEditCategories: boolean;
    canDeleteCategories: boolean;
    canViewProductList: boolean;
    canAddProducts: boolean;
    canViewStock: boolean;
    canEditStock: boolean;
    canDeleteStock: boolean;

    // Sales
    canViewSales: boolean;
    canViewSalesConfig: boolean;
    canEditSalesConfig: boolean;
    canDeleteSalesConfig: boolean;
    canViewSalesAudit: boolean;
    canConfirmSales: boolean;
    canRejectSales: boolean;

    // Cash Tracking
    canViewCashTracking: boolean;
    canViewDeposited: boolean;
    canCreateDeposited: boolean;
    canEditDeposited: boolean;
    canDeleteDeposited: boolean;
    canViewDebtors: boolean;
}

export function useStaffPermissions() {
    const staffToken = localStorage.getItem('staff_session_token');

    // Fetch permissions using the same query as the layout
    // If we passed permissions via Context, we could avoid this dup fetch, 
    // but Convex handles deduping/caching well so this is fine for now.
    const staffPermissions = useQuery(api.staff.getStaffPermissionsByToken, staffToken ? { token: staffToken } : "skip");

    const permissions: StaffPermissions = {
        // Default to false
        canViewProducts: false,
        canManageVariables: false,
        canViewCategories: false,
        canCreateCategories: false,
        canEditCategories: false,
        canDeleteCategories: false,
        canViewProductList: false,
        canAddProducts: false,
        canViewStock: false,
        canEditStock: false,
        canDeleteStock: false,
        canViewSales: false,
        canViewSalesConfig: false,
        canEditSalesConfig: false,
        canDeleteSalesConfig: false,
        canViewSalesAudit: false,
        canConfirmSales: false,
        canRejectSales: false,
        canViewCashTracking: false,
        canViewDeposited: false,
        canCreateDeposited: false,
        canEditDeposited: false,
        canDeleteDeposited: false,
        canViewDebtors: false,
    };

    if (staffPermissions) {
        staffPermissions.forEach((p) => {
            // Map permission keys to our interface keys if they match
            // Assuming permission_key in DB matches exactly or we map them manually
            // In permissions.md, keys like "canViewProducts" are not directly listed as DB keys.
            // DB keys are like "view_products", "create_category", etc.
            // I need to MAP them.

            // Mapping Logic based on permissions.md:

            // Products
            if (p.permission_key === 'staff_product_master') permissions.canViewProducts = p.is_enabled; // Master switch

            // Categories
            if (p.permission_key === 'product_categories_view') permissions.canViewCategories = p.is_enabled;
            if (p.permission_key === 'product_categories_create') permissions.canCreateCategories = p.is_enabled;
            if (p.permission_key === 'product_categories_edit') permissions.canEditCategories = p.is_enabled;
            if (p.permission_key === 'product_categories_delete') permissions.canDeleteCategories = p.is_enabled;

            // Product List / Add
            if (p.permission_key === 'product_adding_view') {
                permissions.canViewProductList = p.is_enabled;
                // Assuming viewing "Product Adding" tab implies adding access? 
                // Or create permission is separate? md says "No specific create/edit/delete for this view". 
                // Wait, "Product Adding" view allows adding.
                permissions.canAddProducts = p.is_enabled;
            }

            // Stock
            if (p.permission_key === 'live_stock_view') permissions.canViewStock = p.is_enabled;
            // No edit/delete stock in permissions.md explicitly? 
            // "Live Stock ... View Only"

            // Sales
            if (p.permission_key === 'staff_sales_master') permissions.canViewSales = p.is_enabled;
            // Add Sale... "view only"?

            // Manage Sales
            if (p.permission_key === 'manage_sales_view') permissions.canViewSalesConfig = p.is_enabled; // config/manage
            if (p.permission_key === 'manage_sales_edit') permissions.canEditSalesConfig = p.is_enabled;
            if (p.permission_key === 'manage_sales_delete') permissions.canDeleteSalesConfig = p.is_enabled;

            // Audit
            if (p.permission_key === 'audit_sales_view') permissions.canViewSalesAudit = p.is_enabled;

            // Cash Tracking
            if (p.permission_key === 'staff_cash_tracking_master') permissions.canViewCashTracking = p.is_enabled;

            // Deposited
            if (p.permission_key === 'deposited_view') permissions.canViewDeposited = p.is_enabled;
            if (p.permission_key === 'deposited_create') permissions.canCreateDeposited = p.is_enabled;
            // edit? md says "Edit: (Not applicable)"
            if (p.permission_key === 'deposited_delete') permissions.canDeleteDeposited = p.is_enabled;

            // Debtors
            if (p.permission_key === 'debtors_view') permissions.canViewDebtors = p.is_enabled;
        });
    }

    const hasPermission = (permission: keyof StaffPermissions) => {
        return !!permissions[permission];
    };

    return {
        permissions: permissions,
        hasPermission,
        isLoading: staffPermissions === undefined,
    };
}
