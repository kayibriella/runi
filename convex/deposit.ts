import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new deposit
export const create = mutation({
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("deposit", {
      ...args,
    });
  },
});

// Get all deposits for a user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

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
  args: { deposit_id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const deposits = await ctx.db
      .query("deposit")
      .withIndex("by_deposit_id", (q) => q.eq("deposit_id", args.deposit_id))
      .collect();

    if (deposits.length === 0) {
      throw new Error("Deposit not found");
    }

    return deposits[0];
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

    return await ctx.db.replace(depositId, {
      ...args,
    });
  },
});

// Delete a deposit
export const remove = mutation({
  args: { deposit_id: v.string() },
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

    await ctx.db.delete(depositId);
    return depositId;
  },
});