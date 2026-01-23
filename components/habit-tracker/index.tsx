"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { ConsistencyRateCard } from "./consistency-rate-card"
import { CurrentStreakCard } from "./current-streak-card"
import { DailyVolumeCard } from "./daily-volume-card"
import { WeeklyHabitProgressCard } from "./weekly-habit-progress-card"
import { FocusTrendCard } from "./focus-trend-card"
import { HabitDensityMap } from "./habit-density-map"

function SyncTime() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    // Only format time on client to avoid hydration mismatch
    const formatted = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date())
    setTime(formatted)
  }, [])

  if (!time) {
    return <span className="tabular-nums">--:--:-- --</span>
  }

  return (
    <time dateTime={new Date().toISOString()} className="tabular-nums">
      {time}
    </time>
  )
}

export function HabitTrackerDashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 p-0.5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-border border border-border">
            <ConsistencyRateCard />
            <CurrentStreakCard />
            <DailyVolumeCard />
            <WeeklyHabitProgressCard />
            <FocusTrendCard />
            <HabitDensityMap />
          </div>
          <footer className="p-6 text-center text-xs text-muted-foreground font-display uppercase">
            System Status: Operational &bull; Last Sync: <SyncTime />
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
