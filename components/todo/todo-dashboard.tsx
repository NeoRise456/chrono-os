"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TodoProvider, useTodo } from "./todo-context";
import { ChronoSidebar } from "@/components/chrono/chrono-sidebar";
import { TodoHeader } from "./todo-header";
import { ActiveWorkspace } from "./active-workspace";
import { TaskInspector } from "./task-inspector";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

function TodoDashboardContent() {
  const { isInspectorOpen, closeInspector } = useTodo();

  return (
    <SidebarProvider defaultOpen={true}>
      <ChronoSidebar />
      <SidebarInset className="min-h-screen bg-background flex flex-col">
        <TodoHeader />
        <main className="flex-1 overflow-hidden relative">
          <ResizablePanelGroup  className="h-full" suppressHydrationWarning>
            {/* Main content */}
            <ResizablePanel defaultSize={80} minSize={30} suppressHydrationWarning>
              <div className="h-full">
                <ActiveWorkspace />
              </div>
            </ResizablePanel>

            {/* Resizable handle */}
            {isInspectorOpen && (
              <ResizableHandle className="w-px bg-border hover:bg-foreground/50 transition-colors" />
            )}

            {/* Inspector panel */}
            {isInspectorOpen && (
              <ResizablePanel
                defaultSize={20}
                minSize={120}
                maxSize={400}
                collapsible
                collapsedSize={0}
                suppressHydrationWarning
                onResize={(panelSize) => {
                  if (panelSize.inPixels === 0) {
                    closeInspector();
                  }
                }}
              >
                <div className="h-full border-l border-border bg-sidebar">
                  <TaskInspector />
                </div>
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function TodoDashboard() {
  return (
    <TodoProvider>
      <TodoDashboardContent />
    </TodoProvider>
  );
}
