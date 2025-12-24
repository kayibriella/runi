import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { checkPermission } from "./permissions";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new deposit
export const create = mutation({
  args: {
    deposit_id: v.string(),
    user_id: v.string(), // We will overwrite this
    deposit_type: v.string(),
    account_name: v.string(),
    account_number: v.string(),
    amount: v.number(),
    to_recipient: v.string(),
    deposit_image_url: v.string(),
    approval: v.string(),
    created_by: v.string(),
    updated_at: v.number(),
    updated_by: v.string(),
    staffToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await checkPermission(ctx, "deposited_create", args.staffToken);

    // Filter staffToken out
    const { staffToken, user_id, ...depositData } = args;

    return await ctx.db.insert("deposit", {
      ...depositData,
      user_id: userId, // Enforce owner
    });
  },
});

// Get all deposits for a user
export const list = query({
  args: {
    staffToken: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await checkPermission(ctx, "deposited_view", args.staffToken);

    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .order("desc")
      .collect();

    return deposits;
  },
});

// Get deposit by ID
export const getById = query({
  args: {
    deposit_id: v.string(),
    staffToken: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await checkPermission(ctx, "deposited_view", args.staffToken);

    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_deposit_id", (q) => q.eq("deposit_id", args.deposit_id))
      .collect();

    if (deposits.length === 0) {
      throw new Error("Deposit not found");
    }

    // Check ownership
    const deposit = deposits[0];
    if (deposit.user_id !== userId) {
      // user_id is string in schema, userId is Id<"users">. Comparisons work fine usually? 
      // Or string comparison. 
      if (deposit.user_id !== userId) {
        throw new Error("Deposit not found or access denied");
      }
    }

    return deposit;
  },
});

// Update a deposit
export const update = mutation({
  args: {
    deposit_id: v.string(),
    user_id: v.string(),
    deposit_type: v.string(),
    account_name: v.string(),
    account_number: v.string(),
    amount: v.number(),
    to_recipient: v.string(),
    deposit_image_url: v.string(),
    approval: v.string(),
    created_by: v.string(),
    updated_at: v.number(),
    updated_by: v.string(),
    // No staffToken - Admin only
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the deposit by deposit_id
    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_deposit_id", (q) => q.eq("deposit_id", args.deposit_id))
      .collect();

    if (deposits.length === 0) {
      throw new Error("Deposit not found");
    }

    const depositId = deposits[0]._id;

    // Verify ownership
    if (deposits[0].user_id !== userId) {
      throw new Error("Access denied");
    }

    return await ctx.db.replace(depositId, {
      ...args,
    });
  },
});

// Delete a deposit
export const remove = mutation({
  args: {
    deposit_id: v.string(),
    staffToken: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await checkPermission(ctx, "deposited_delete", args.staffToken);

    // Find the deposit by deposit_id
    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_deposit_id", (q) => q.eq("deposit_id", args.deposit_id))
      .collect();

    if (deposits.length === 0) {
      throw new Error("Deposit not found");
    }

    if (deposits[0].user_id !== userId) {
      throw new Error("Access denied");
    }

    const depositId = deposits[0]._id;

    await ctx.db.delete(depositId);
    return depositId;
  },
});