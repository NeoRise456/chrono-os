"use client"

import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ChronoSidebar } from "@/components/chrono/chrono-sidebar"
import { HabitsProvider, useHabitsContext } from "./habits-provider"
import { HabitsHeader } from "./habits-header"
import { TodayChecklist } from "./today-checklist"
import { AddHabitSheet } from "./add-habit-sheet"
import { EditHabitSheet } from "./edit-habit-sheet"
import {
  ConsistencyRateCard,
  CurrentStreakCard,
  DailyVolumeCard,
  WeeklyHabitProgressCard,
  FocusTrendCard,
  HabitDensityMap,
} from "./stats"
import { useMutation, useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"

function HabitsDashboardContent() {
  const { isToday } = useHabitsContext()
  const { isAuthenticated } = useConvexAuth()

  //TODO change this to convex function/ database logic
  const createDefaultHabits = useMutation(api.habits.createDefaultHabits)

  useEffect(() => {
    if (isToday && isAuthenticated) {
      createDefaultHabits({}).catch(console.error)
    }
  }, [isToday, isAuthenticated, createDefaultHabits])

  return (
    <>
      <HabitsHeader />
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-border border border-border">
          <ConsistencyRateCard />
          <CurrentStreakCard />
          <DailyVolumeCard />
          <WeeklyHabitProgressCard />
          <FocusTrendCard />
        </div>
        <TodayChecklist />
        <div className="mt-px">
          <HabitDensityMap />
        </div>
      </main>
      <AddHabitSheet />
      <EditHabitSheet />
    </>
  )
}

export function HabitTrackerDashboard() {
  return (
    <SidebarProvider defaultOpen={true}>
      <ChronoSidebar />
      <SidebarInset className="h-screen bg-background overflow-hidden">
        <HabitsProvider>
          <HabitsDashboardContent />
        </HabitsProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
