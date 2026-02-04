import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "active" | "completed"
    recurrence: v.optional(v.string()), // null | "daily" | "weekly" | "monthly"
    dueDate: v.optional(v.number()), // Unix timestamp
    completedAt: v.optional(v.number()), // Unix timestamp
    isTerminated: v.optional(v.boolean()), // For terminated recurring tasks
    userId: v.string(), // Owner of task
    createdAt: v.number(), // Unix timestamp
    tags: v.optional(v.array(v.string())), // Task tags
    priority: v.optional(v.string()), // "low" | "medium" | "high"
  })
    .index("by_status", ["status"])
    .index("by_status_recurrence", ["status", "recurrence"])
    .index("by_user", ["userId"])
    .index("by_due_date", ["dueDate"]),
});
