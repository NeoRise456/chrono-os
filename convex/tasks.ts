import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    recurrence: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "active",
      createdAt: Date.now(),
      userId: userId.tokenIdentifier,
    });

    return taskId;
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    recurrence: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId.tokenIdentifier) {
      throw new Error("Task not found or unauthorized");
    }

    const { taskId, ...updates } = args;
    await ctx.db.patch(taskId, updates);
  },
});

export const completeTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId.tokenIdentifier) {
      throw new Error("Task not found or unauthorized");
    }

    // Mark task as completed with timestamp
    await ctx.db.patch(args.taskId, {
      status: "completed",
      completedAt: Date.now(),
    });
  },
});

export const uncompleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId.tokenIdentifier) {
      throw new Error("Task not found or unauthorized");
    }

    // Mark task as active and clear completedAt
    await ctx.db.patch(args.taskId, {
      status: "active",
      completedAt: undefined,
    });
  },
});

export const terminateTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId.tokenIdentifier) {
      throw new Error("Task not found or unauthorized");
    }

    await ctx.db.patch(args.taskId, {
      isTerminated: true,
      status: "completed",
      completedAt: Date.now(),
    });
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId.tokenIdentifier) {
      throw new Error("Task not found or unauthorized");
    }

    await ctx.db.delete(args.taskId);
  },
});

export const resetCompletedRecurringTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) throw new Error("Unauthorized");

    const now = Date.now();

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId.tokenIdentifier),
          q.neq(q.field("recurrence"), null),
          q.eq(q.field("status"), "completed"),
          q.neq(q.field("completedAt"), null)
        )
      )
      .collect();

    let resetCount = 0;
    for (const task of tasks) {
      if (task.completedAt && shouldTaskBeReset(task.recurrence!, task.completedAt, now)) {
        await ctx.db.patch(task._id, {
          status: "active",
          completedAt: undefined,
        });
        resetCount++;
      }
    }

    return resetCount;
  },
});

export const getActiveTasks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return [];

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.eq(q.field("userId"), userId.tokenIdentifier))
      .collect();

    return tasks.filter((task) => !task.isTerminated);
  },
});

export const getRoutineTasks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return [];

    const now = Date.now();

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId.tokenIdentifier),
          q.neq(q.field("recurrence"), null),
          q.or(
            q.eq(q.field("status"), "active"),
            q.eq(q.field("status"), "completed")
          )
        )
      )
      .collect();

    return tasks.filter((task) => {
      if (task.isTerminated) return false;

      return true;
    });
  },
});

export const getInboxTasks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimestamp = tomorrow.getTime();

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId.tokenIdentifier),
          q.eq(q.field("recurrence"), null),
          q.or(
            q.eq(q.field("status"), "active"),
            q.and(
              q.eq(q.field("status"), "completed"),
              q.gte(q.field("completedAt"), todayTimestamp),
              q.lt(q.field("completedAt"), tomorrowTimestamp)
            )
          )
        )
      )
      .collect();

    return tasks;
  },
});

export const getTaskById = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) return null;

    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== userId.tokenIdentifier) {
      return null;
    }

    return task;
  },
});

function calculateNextDueDate(recurrence: string, currentDueDate: number): number {
  const date = new Date(currentDueDate);

  switch (recurrence) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      return currentDueDate;
  }

  return date.getTime();
}

function shouldTaskBeReset(recurrence: string, completedAt: number, now: number): boolean {
  const completedDate = new Date(completedAt);
  const nowDate = new Date(now);

  switch (recurrence) {
    case "daily":
      // Reset if it's the next calendar day
      const completedDay = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate());
      const nowDay = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
      return nowDay.getTime() > completedDay.getTime();
    case "weekly":
      // Reset if 7 days have passed
      const weekLater = new Date(completedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      return nowDate.getTime() >= weekLater.getTime();
    case "monthly":
      // Reset if next month has arrived
      const completedMonth = new Date(completedDate.getFullYear(), completedDate.getMonth(), 1);
      const nowMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
      return nowMonth.getTime() > completedMonth.getTime();
    default:
      return false;
  }
}
