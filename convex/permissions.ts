import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

/**
 * Checks if the caller has permission to perform an action.
 * 
 * 1. If caller is an authenticated Admin (via Auth), access is granted.
 * 2. If caller provides a valid `staffToken`, checks if the staff member has `permissionKey`.
 * 3. Returns the `userId` (Business Owner ID) to be used for data scoping.
 * 
 * @param ctx Convex Query or Mutation Context
 * @param permissionKey The specific permission key to check (e.g., 'product_categories_view')
 * @param staffToken Optional staff session token
 * @returns The `userId` of the business owner.
 */
export async function checkPermission(
    ctx: QueryCtx | MutationCtx,
    permissionKey: string,
    staffToken?: string
) {
    // 1. Check if Admin
    const userId = await getAuthUserId(ctx);
    if (userId) {
        return userId; // Admins have full access
    }

    // 2. Check Staff Token
    if (!staffToken) {
        // If no user ID and no staff token, it's an unauthenticated request
        // However, some public queries might exist? 
        // For this app, everything seems protected.
        throw new ConvexError("Unauthorized: Please log in");
    }

    // 3. Validate Staff Session
    // We can't use index lookup easily on token unless we have one, but checking by filter is okay for now 
    // or we rely on the fact that we might have an index or just scan (staff table is small per business usually, but global?)
    // Staff table is global. Filter by token is O(N).
    // Ideally, we should add an index on session_token in schema.ts, but for now filtering is existing pattern.
    const staff = await ctx.db
        .query("staff")
        .filter((q) => q.eq(q.field("session_token"), staffToken))
        .first();

    if (!staff) throw new ConvexError("Unauthorized: Invalid session");

    if (staff.session_expiry && staff.session_expiry < Date.now()) {
        throw new ConvexError("Unauthorized: Session expired");
    }

    // 4. Check Business Status (Staff must be active)
    if (staff.is_active === false) {
        throw new ConvexError("Unauthorized: Account disabled");
    }

    // 5. Check Specific Permission
    const hasPermission = await ctx.db
        .query("staff_permissions")
        .withIndex("by_staff_key", (q) =>
            q.eq("staff_id", staff._id).eq("permission_key", permissionKey)
        )
        .unique();

    if (!hasPermission || !hasPermission.is_enabled) {
        throw new ConvexError(`Access Denied: You do not have permission to perform this action (${permissionKey})`);
    }

    // 6. Return the Business Owner's User ID
    return staff.user_id;
}
