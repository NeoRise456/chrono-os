"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

function SyncTime() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date())
      setTime(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
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

export function ChronoHeader() {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-20">
      <h2 className="text-lg font-bold tracking-tight font-display">
        Weekly Schedule
      </h2>
      <span className="text-xs text-muted-foreground border border-border px-2 py-1 font-display uppercase flex items-center gap-2">
        <Clock className="size-3" aria-hidden="true" />
        <SyncTime />
      </span>
    </header>
  )
}
