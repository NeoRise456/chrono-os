"use client";

import { useCallback, useState, useMemo, useTransition } from "react";
import { Trash2, Repeat, Save, X, Check } from "lucide-react";
import { useTodo } from "./todo-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TaskInspector() {
  const { selectedTaskId, closeInspector, updateTask, terminateTask, deleteTask, completeTask, uncompleteTask } = useTodo();
  const selectedTask = useQuery(api.tasks.getTaskById, { taskId: selectedTaskId! });
  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [recurrence, setRecurrence] = useState<string | undefined>();
  const [priority, setPriority] = useState<string | undefined>();
  const [optimisticCompleted, setOptimisticCompleted] = useState<boolean | null>(null);

  const handleReset = useCallback(() => {
    if (!selectedTask) return;

    setTitle(selectedTask.title);
    setRecurrence(selectedTask.recurrence ?? undefined);
    setPriority(selectedTask.priority ?? undefined);
    setOptimisticCompleted(null);
  }, [selectedTask]);

  const handleSave = useCallback(async () => {
    if (!selectedTask) return;
    
    await updateTask({
      taskId: selectedTask._id,
      title: title.trim() || selectedTask.title,
      recurrence,
      priority,
    });
    setIsEditing(false);
  }, [selectedTask, title, recurrence, priority, updateTask]);

  const handleCancel = useCallback(() => {
    if (!selectedTask) return;

    setTitle(selectedTask.title);
    setRecurrence(selectedTask.recurrence ?? undefined);
    setPriority(selectedTask.priority ?? undefined);
    setOptimisticCompleted(null);
    setIsEditing(false);
  }, [selectedTask]);

  const handleToggleComplete = useCallback(async () => {
    if (!selectedTask) return;

    const isCurrentlyCompleted = optimisticCompleted !== null 
      ? optimisticCompleted 
      : selectedTask.status === "completed" || selectedTask.isTerminated;

    setOptimisticCompleted(!isCurrentlyCompleted);

    startTransition(async () => {
      if (isCurrentlyCompleted) {
        await uncompleteTask(selectedTask._id);
      } else {
        await completeTask(selectedTask._id);
      }
    });
  }, [selectedTask, optimisticCompleted, completeTask, uncompleteTask]);

  const isCompleted = useMemo(() => {
    if (optimisticCompleted !== null) return optimisticCompleted;
    return selectedTask?.status === "completed" || selectedTask?.isTerminated;
  }, [optimisticCompleted, selectedTask?.status, selectedTask?.isTerminated]);

  const completedDate = useMemo(() => {
    if (!selectedTask?.completedAt) return null;
    return new Date(selectedTask.completedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [selectedTask?.completedAt]);

  const createdDate = useMemo(() => {
    if (!selectedTask?.createdAt) return "";
    return new Date(selectedTask.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedTask?.createdAt]);

  if (!selectedTask) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-border shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
            Task Inspector
          </p>
          <h4 className="text-sm font-bold text-foreground font-display">
            No Task Selected
          </h4>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-muted-foreground font-display text-center">
            Select a task to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-6 py-4 flex items-center gap-4 shrink-0">
        <Checkbox
          checked={isCompleted}
          disabled={isPending}
          onCheckedChange={handleToggleComplete}
          className="shrink-0"
          aria-label={`Mark ${selectedTask.title} as ${isCompleted ? "incomplete" : "complete"}`}
        />
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-display font-bold text-lg"
          />
        ) : (
          <h4 className={`text-lg font-bold font-display flex-1 ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {selectedTask.title}
          </h4>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={closeInspector}
          className="shrink-0"
          aria-label="Close inspector"
        >
          <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {isCompleted && completedDate ? (
            <div className="p-4 border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Check className="size-4 text-foreground" />
                <p className="text-sm font-bold text-foreground font-display">
                  Completed
                </p>
              </div>
              <p className="text-xs text-muted-foreground font-display">
                {completedDate}
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground font-display uppercase">
                    Recurrence
                  </Label>
                  <Select value={recurrence ?? "none"} onValueChange={(value) => setRecurrence(value === "none" ? undefined : value)}>
                    <SelectTrigger className="font-display text-sm">
                      <SelectValue placeholder="Select recurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No recurrence</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] text-muted-foreground font-display uppercase mb-1">
                    Recurrence
                  </p>
                  <div className="flex items-center gap-2">
                    {selectedTask.recurrence ? (
                      <>
                        <Repeat className="size-4 text-foreground" />
                        <span className="text-sm text-foreground font-display capitalize">
                          {selectedTask.recurrence}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground font-display">
                        No recurrence
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Label className="text-[10px] text-muted-foreground font-display uppercase">
                    Priority
                  </Label>
                  <Select value={priority ?? "none"} onValueChange={(value) => setPriority(value === "none" ? undefined : value)}>
                    <SelectTrigger className="font-display text-sm">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] text-muted-foreground font-display uppercase mb-1">
                    Priority
                  </p>
                  <div className="flex items-center gap-2">
                    {selectedTask.priority ? (
                      <span className="text-[10px] px-1.5 py-0.5 border border-border font-mono uppercase tracking-wide">
                        {selectedTask.priority}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground font-display">
                        No priority
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground font-display uppercase mb-1">
                Created
              </p>
              <p className="text-sm text-muted-foreground font-display">
                {createdDate}
              </p>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="flex-1 font-display">
                    <Save className="size-3 mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 font-display"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="w-full font-display"
                >
                  Edit Task
                </Button>
              )}

              {selectedTask.recurrence ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => terminateTask(selectedTask._id)}
                  className="w-full font-display text-destructive hover:bg-destructive/10"
                >
                  <Repeat className="size-3 mr-2" />
                  Stop Recurrence
                </Button>
              ) : null}

              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteTask(selectedTask._id)}
                className="w-full font-display text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3 mr-2" />
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
