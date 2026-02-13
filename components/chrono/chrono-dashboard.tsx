"use client"

import { useState, useCallback } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ChronoProvider } from "./chrono-context"
import { ChronoSidebar } from "./chrono-sidebar"
import { ChronoHeader } from "./chrono-header"
import { Timetable } from "./timetable"
import { BottomSheet } from "./bottom-sheet"
import { BottomPanel } from "./bottom-panel"

const DEFAULT_SHEET_HEIGHT = 320
const COLLAPSED_HEIGHT = 48

export function ChronoDashboard() {
  const [sheetHeight, setSheetHeight] = useState(DEFAULT_SHEET_HEIGHT)

  const handleSheetHeightChange = useCallback((height: number, isCollapsed: boolean) => {
    setSheetHeight(isCollapsed ? COLLAPSED_HEIGHT : height)
  }, [])

  const handleEditModeChange = useCallback(() => {
    // Sheet can be collapsed/expanded independently in both modes
  }, [])

  return (
    <ChronoProvider>
      <SidebarProvider defaultOpen={true}>
        <ChronoSidebar />
        <SidebarInset className="min-h-screen bg-background flex flex-col">
          <ChronoHeader />
          {/* Main content area - relative container for bottom sheet */}
          <main className="flex-1 overflow-hidden relative">
            {/* Timetable - full width, adjusts to sheet height */}
            <div 
              className="absolute inset-0  overflow-hidden transition-[bottom] duration-200 ease-out"
              style={{ bottom: `${sheetHeight}px` }}
            >
              <div className="h-full border border-border">
                <Timetable onEditModeChange={handleEditModeChange} />
              </div>
            </div>
             
            {/* Bottom sheet - positioned inside main area */}
            <BottomSheet
              defaultHeight={DEFAULT_SHEET_HEIGHT}
              minHeight={200}
              maxHeight={600}
              collapsedHeight={COLLAPSED_HEIGHT}
              onHeightChange={handleSheetHeightChange}
            >
              <BottomPanel />
            </BottomSheet>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ChronoProvider>
  )
}
