"use client";

import { useCallback, type KeyboardEvent } from "react";
import { Clock, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodo } from "./todo-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Id } from "@/convex/_generated/dataModel";

export type TaskStatus = "active" | "completed" | "terminated";

export interface TaskCardProps {
  id: Id<"tasks">;
  title: string;
  description?: string;
  status: TaskStatus;
  recurrence?: string;
  dueDate?: number;
  tags?: string[];
  priority?: string;
  isPastTask?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-zinc-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

const RECURRENCE_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export function TaskCard({
  id,
  title,
  description,
  status,
  recurrence,
  dueDate,
  tags,
  priority,
  isPastTask = false,
}: TaskCardProps) {
  const { selectTask, completeTask, uncompleteTask } = useTodo();

  const handleClick = useCallback(() => {
    selectTask(id);
  }, [id, selectTask]);

  const handleComplete = useCallback(
    (checked: boolean) => {
      if (checked && status === "active" && !isPastTask) {
        completeTask(id);
      } else if (!checked && status === "completed" && !isPastTask) {
        uncompleteTask(id);
      }
    },
    [id, status, isPastTask, completeTask, uncompleteTask]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const isCompleted = status === "completed" || status === "terminated";
  const opacityClass = isCompleted || isPastTask ? "opacity-50" : "opacity-100";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex items-center gap-4 p-4 tech-full-border border cursor-pointer transition-all",
        "hover:bg-zinc-900/40",
        isCompleted ? "" : "",
        opacityClass
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleComplete}
        disabled={isPastTask}
        className="shrink-0"
        aria-label={`Mark ${title} as ${isCompleted ? "incomplete" : "complete"}`}
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate font-display transition-colors",
            isCompleted ? "text-muted-foreground line-through" : "text-foreground"
          )}
        >
          {title}
        </p>
        {description && !isPastTask && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {recurrence && !isPastTask && (
          <div className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 border border-border text-muted-foreground font-display uppercase tracking-wide">
            <Repeat className="size-3" />
            <span>{RECURRENCE_LABELS[recurrence] || recurrence}</span>
          </div>
        )}

        {dueDate && !isPastTask && !recurrence && (
          <div className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 border border-border text-muted-foreground font-display uppercase tracking-wide">
            <Clock className="size-3" />
            <span>
              {new Date(dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}

        {priority && !isPastTask && (
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 border border-border font-mono uppercase tracking-wide",
              PRIORITY_COLORS[priority] || "text-muted-foreground"
            )}
          >
            {priority}
          </span>
        )}

        {tags && tags.length > 0 && !isPastTask && (
          <div className="flex items-center gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 border border-border text-muted-foreground font-mono uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground font-mono">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
