import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkPermission } from "./permissions";

// Create a new product category
export const create = mutation({
    args: {
        category_name: v.string(),
        staffToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await checkPermission(ctx, "product_categories_create", args.staffToken);

        // Check if category already exists for this user
        const existing = await ctx.db
            .query("productcategory")
            .withIndex("by_user_and_name", (q) =>
                q.eq("user_id", userId).eq("category_name", args.category_name)
            )
            .first();

        if (existing) {
            throw new Error("Category already exists");
        }

        const now = Date.now();
        const categoryId = await ctx.db.insert("productcategory", {
            user_id: userId,
            category_name: args.category_name,
            updated_at: now,
        });

        return categoryId;
    },
});

// List all categories for the current user
export const list = query({
    args: {
        staffToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Staff can list if they have view permission
        // Note: checkPermission returns the business userId, effectively scoping the query
        let userId;
        try {
            userId = await checkPermission(ctx, "product_categories_view", args.staffToken);
        } catch (e) {
            // Access check failed - return empty for queries usually or throw? 
            // Better to return empty list for frontend safety unless it's an explicit error?
            // Existing pattern was: if (!userId) return [].
            // But checkPermission throws if permission denied. 
            // Logic: if Admin not logged in AND Staff check fails -> throw.
            // If just not logged in (e.g. public site), we want []? 
            // But this app is authenticated. So throwing is correct if they SHOULD be logged in. 
            // If checkPermission doesn't find ANY header, it throws "Please log in".
            // That's fine.
            return [];
        }

        const categories = await ctx.db
            .query("productcategory")
            .withIndex("by_user", (q) => q.eq("user_id", userId))
            .collect();

        return categories;
    },
});

// Update a category
export const update = mutation({
    args: {
        id: v.id("productcategory"),
        category_name: v.string(),
        staffToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await checkPermission(ctx, "product_categories_edit", args.staffToken);

        const category = await ctx.db.get(args.id);
        if (!category) {
            throw new Error("Category not found");
        }

        if (category.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        const now = Date.now();
        await ctx.db.patch(args.id, {
            category_name: args.category_name,
            updated_at: now,
        });

        return args.id;
    },
});

// Delete a category
export const remove = mutation({
    args: {
        id: v.id("productcategory"),
        staffToken: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await checkPermission(ctx, "product_categories_delete", args.staffToken);

        const category = await ctx.db.get(args.id);
        if (!category) {
            throw new Error("Category not found");
        }

        if (category.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        // Check if there are any products associated with this category
        const productsInCategory = await ctx.db
            .query("products")
            .withIndex("by_user_and_category", (q) =>
                q.eq("user_id", userId).eq("category_id", args.id)
            )
            .take(1);

        if (productsInCategory.length > 0) {
            throw new Error("Cannot delete category that has products. Please move or delete all products in this category first.");
        }

        await ctx.db.delete(args.id);
        return args.id;
    },
});
