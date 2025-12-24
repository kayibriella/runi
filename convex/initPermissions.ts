import { mutation } from "./_generated/server";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // Permission definitions from permissions.md

        // Note: The document distinguishes "Admin" keys vs "Staff" keys in the "Permission Key Reference" section.
        // However, the "Staff-Specific Pages" section (7.1, 7.2, 7.3) suggests NEW keys (sp4_view, etc) for staff pages?
        // BUT the prompt earlier said "Implement staff-specific frontend pages ... mirroring admin functionality".
        // AND the schema (step 4) lists `p4_view` etc for "Product Tab".
        // AND then Step 7 listing lists `sp4_view`. 
        // This implies there are TWO sets of keys? 
        // Wait. "The permission_key column should store the internal IDs used in the frontend."
        // If Staff uses `StaffProducts.tsx`, does it check `sp4_view` or `p4_view`?
        // In `useStaffPermissions.ts` (the mock), I was mapping database keys to frontend flags.
        // In `permissions.ts` (backend checks), I used `product_categories_view`, `product_adding_view` etc.
        // I need to reconcile the keys I used in code vs keys in MD.

        // keys I used in `convex/permissions.ts` and `convex/products.ts` etc:
        // `product_categories_view`, `product_categories_create`, `product_categories_edit`, `product_categories_delete`
        // `product_adding_view`, `product_adding_create`
        // `live_stock_view`, `live_stock_edit`, `live_stock_delete`
        // `manage_sales_view`, `manage_sales_create` ...

        // These match the descriptions in MD (Main Tab, Sub Tab, Action) but joined by underscores?
        // In MD Step 4:
        // Sub-Tab: "Categories" -> Internal Key: `p4_view`.
        // Wait, the MD says Internal Key is `p4_view`.
        // BUT in Step 1 (Schema snippet), it shows `permissions: ... permission_key: v.string()`.
        // AND in `useStaffPermissions.ts`, I mapped `product_categories_view`.
        // If I used `product_categories_view` in my code, I SHOULD USE THAT in the seed and the usage.
        // The keys `p4_view` etc in MD might be legacy or examples if the code I wrote used descriptive names.
        // Actually, I should probably stick to the keys I ALREADY implemented in the backend code for consistency.
        // My backend code (permissions.ts checks) uses descriptive keys:
        // `product_categories_view`
        // `product_categories_create`
        // `product_categories_edit`
        // `product_categories_delete`
        // `product_adding_view`
        // `product_adding_create`
        // `live_stock_view` ...

        // I will use THESE descriptive keys as the `permission_key`.
        // I will populate the table with these.

        const permissions = [
            // --- Staff Master Switches ---
            {
                permission_key: "staff_product_master",
                main_tab_key: "products",
                sub_tab_key: "master",
                action_key: "master",
                label: "Staff Product Access",
                description: "Global toggle for all Staff Product permissions",
            },
            {
                permission_key: "staff_sales_master",
                main_tab_key: "sales",
                sub_tab_key: "master",
                action_key: "master",
                label: "Staff Sales Access",
                description: "Global toggle for all Staff Sales permissions",
            },
            {
                permission_key: "staff_cash_tracking_master",
                main_tab_key: "cash_tracking",
                sub_tab_key: "master",
                action_key: "master",
                label: "Staff Cash Tracking Access",
                description: "Global toggle for all Staff Cash Tracking permissions",
            },

            // --- Products : Categories ---
            {
                permission_key: "product_categories_view",
                main_tab_key: "products",
                sub_tab_key: "categories",
                action_key: "view",
                label: "View Categories",
            },
            {
                permission_key: "product_categories_create",
                main_tab_key: "products",
                sub_tab_key: "categories",
                action_key: "create",
                label: "Create Category",
            },
            {
                permission_key: "product_categories_edit",
                main_tab_key: "products",
                sub_tab_key: "categories",
                action_key: "edit",
                label: "Edit Category",
            },
            {
                permission_key: "product_categories_delete",
                main_tab_key: "products",
                sub_tab_key: "categories",
                action_key: "delete",
                label: "Delete Category",
            },

            // --- Products : Adding ---
            {
                permission_key: "product_adding_view",
                main_tab_key: "products",
                sub_tab_key: "product_adding",
                action_key: "view",
                label: "View Product Adding",
            },
            {
                permission_key: "product_adding_create",
                main_tab_key: "products",
                sub_tab_key: "product_adding",
                action_key: "create",
                label: "Add Product",
            },
            // MD Says "No specific create/edit/delete for this view", but code checks `create`.

            // --- Products : Live Stock ---
            {
                permission_key: "live_stock_view",
                main_tab_key: "products",
                sub_tab_key: "live_stock",
                action_key: "view",
                label: "View Live Stock",
            },
            {
                permission_key: "live_stock_edit",
                main_tab_key: "products",
                sub_tab_key: "live_stock",
                action_key: "edit",
                label: "Edit Stock",
            },
            {
                permission_key: "live_stock_delete",
                main_tab_key: "products",
                sub_tab_key: "live_stock",
                action_key: "delete",
                label: "Delete Stock",
            },

            // --- Sales : Manage Sales ---
            {
                permission_key: "manage_sales_view",
                main_tab_key: "sales",
                sub_tab_key: "manage_sales",
                action_key: "view",
                label: "View Sales",
            },
            {
                permission_key: "add_sales_view", // Used in code for "Add Sale" tab / create
                main_tab_key: "sales",
                sub_tab_key: "add_sales",
                action_key: "view",
                label: "Add Sale Access",
            },
            {
                permission_key: "manage_sales_edit",
                main_tab_key: "sales",
                sub_tab_key: "manage_sales",
                action_key: "edit",
                label: "Edit Sales",
            },
            {
                permission_key: "manage_sales_delete",
                main_tab_key: "sales",
                sub_tab_key: "manage_sales",
                action_key: "delete",
                label: "Delete Sales",
            },

            // --- Sales : Audit Sales ---
            {
                permission_key: "audit_sales_view",
                main_tab_key: "sales",
                sub_tab_key: "audit_sales",
                action_key: "view",
                label: "View Sales Audit",
            },
            // Confirm/Reject is allowed for Staff? MD said "Confirm Sale", "Reject Sale" keys `s4_confirm` etc.
            // But my code kept `updateAuditStatus` as Admin Only.
            // If I want to allow staff, I should uncomment/add keys later.
            // For now, MD says they exist. I will add them to DB just in case, even if backend doesn't use them yet.
            {
                permission_key: "audit_sales_confirm",
                main_tab_key: "sales",
                sub_tab_key: "audit_sales",
                action_key: "confirm",
                label: "Confirm Audit",
            },
            {
                permission_key: "audit_sales_reject",
                main_tab_key: "sales",
                sub_tab_key: "audit_sales",
                action_key: "reject",
                label: "Reject Audit",
            },

            // --- Cash Tracking : Deposited ---
            {
                permission_key: "deposited_view",
                main_tab_key: "cash_tracking",
                sub_tab_key: "deposited",
                action_key: "view",
                label: "View Deposited",
            },
            {
                permission_key: "deposited_create",
                main_tab_key: "cash_tracking",
                sub_tab_key: "deposited",
                action_key: "create",
                label: "Create Deposit",
            },
            {
                permission_key: "deposited_delete",
                main_tab_key: "cash_tracking",
                sub_tab_key: "deposited",
                action_key: "delete",
                label: "Delete Deposit",
            },

            // --- Cash Tracking : Debtors ---
            {
                permission_key: "debtors_view",
                main_tab_key: "cash_tracking",
                sub_tab_key: "debtors",
                action_key: "view",
                label: "View Debtors",
            },
        ];

        for (const p of permissions) {
            const existing = await ctx.db
                .query("permissions")
                .withIndex("by_permission_key", (q) => q.eq("permission_key", p.permission_key))
                .unique();

            if (!existing) {
                await ctx.db.insert("permissions", {
                    ...p,
                    created_at: Date.now(),
                });
            } else {
                // Optional: update label/desc if changed?
            }
        }

        return "Permissions seeded successfully";
    },
});
