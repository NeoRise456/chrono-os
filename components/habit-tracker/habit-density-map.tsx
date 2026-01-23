"use client"

import { useMemo } from "react"

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function getIntensityClass(value: number): string {
  if (value < 0.3) return "bg-muted"
  if (value < 0.7) return "bg-muted-foreground"
  return "bg-foreground"
}

// Deterministic pseudo-random number generator for consistent SSR/hydration
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

export function HabitDensityMap() {
  const weeks = 52
  const daysPerWeek = 7

  // Use useMemo with a deterministic seed to avoid hydration mismatch
  const densityData = useMemo(() => {
    return Array.from({ length: weeks }, (_, weekIndex) =>
      Array.from({ length: daysPerWeek }, (_, dayIndex) => {
        // Use week and day indices as seed for deterministic values
        const seed = weekIndex * 7 + dayIndex + 1
        return seededRandom(seed)
      })
    )
  }, [])

  return (
    <div className="col-span-1 md:col-span-12 bg-card p-6 flex flex-col tech-border h-64 text-muted-foreground">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-display">
            Annual Consistency
          </p>
          <h3 className="text-2xl font-bold text-foreground font-display">
            Habit Density Map
          </h3>
        </div>
        <div 
          className="flex items-center gap-2 text-xs text-muted-foreground font-display"
          aria-label="Legend"
        >
          <span>Less</span>
          <span className="w-3 h-3 bg-muted" aria-hidden="true" />
          <span className="w-3 h-3 bg-muted-foreground" aria-hidden="true" />
          <span className="w-3 h-3 bg-foreground" aria-hidden="true" />
          <span>More</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div 
          className="flex justify-between gap-1 w-full h-full overflow-hidden"
          role="img"
          aria-label="Habit density heatmap showing activity levels throughout the year"
        >
          {densityData.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="flex flex-col gap-1 h-full justify-between flex-1"
              aria-hidden="true"
            >
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-full flex-1 ${getIntensityClass(day)} transition-colors hover:ring-1 hover:ring-foreground/20`}
                  title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-display uppercase">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  )
}
