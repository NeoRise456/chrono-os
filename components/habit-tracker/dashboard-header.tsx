"use client"

import { useState, useEffect } from "react"
import { Search, Moon, Sun, Bell, ChevronDown, User } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8 sticky top-0 z-20">
      <h2 className="text-xl font-bold tracking-tight font-display">
        Dashboard
      </h2>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center h-9 px-3 border border-border bg-secondary w-64">
          <Search className="size-[18px] text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search data..."
            className="bg-transparent border-none text-sm focus-visible:ring-0 placeholder:text-muted-foreground w-full ml-2 font-display h-auto p-0"
            aria-label="Search dashboard data"
          />
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-border">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground border-border hover:bg-accent"
            aria-label="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="size-5" aria-hidden="true" />
              ) : (
                <Moon className="size-5" aria-hidden="true" />
              )
            ) : (
              <span className="size-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="p-2 text-muted-foreground hover:text-foreground border-border hover:bg-accent relative"
            aria-label="Notifications"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span 
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-foreground rounded-full"
              aria-label="New notifications"
            />
          </Button>
          <div className="flex items-center gap-3 ml-2 cursor-pointer group">
            <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center">
              <User className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <span className="text-sm hidden md:block font-display">
              J. Smith
            </span>
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  )
}
