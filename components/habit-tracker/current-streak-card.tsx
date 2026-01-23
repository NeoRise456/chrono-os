"use client"

const habits = [
  { name: "Meditation", status: "Active", isActive: true },
  { name: "Reading", status: "Done", isActive: false },
  { name: "Workout", status: "Active", isActive: true },
  { name: "Hydration", status: "Inactive", isActive: false, isInactive: true },
]

const streakProgress = [
  { filled: true },
  { filled: true },
  { filled: true },
  { filled: true },
  { filled: false },
  { filled: false },
  { filled: false },
  { filled: false },
  { filled: false },
  { filled: false },
]

export function CurrentStreakCard() {
  const currentStreak = 12
  const goalDays = 30
  const progressPercent = Math.round((currentStreak / goalDays) * 100)

  return (
    <div className="col-span-1 md:col-span-4 bg-card p-6 h-80 flex flex-col tech-border text-muted-foreground">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-display">
            Current Streak
          </p>
          <h3 className="text-3xl font-bold text-foreground font-display">
            {currentStreak} Days
          </h3>
        </div>
        <span className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 font-display">
          RUNNING
        </span>
      </div>
      <div className="flex justify-between text-xs mb-2 font-display">
        <span className="text-foreground">Goal: {goalDays} Days</span>
        <span className="text-muted-foreground tabular-nums">{progressPercent}%</span>
      </div>
      <div 
        className="h-8 w-full flex gap-[2px] mb-8" 
        role="progressbar" 
        aria-valuenow={progressPercent} 
        aria-valuemin={0} 
        aria-valuemax={100}
        aria-label={`Streak progress: ${progressPercent}%`}
      >
        {streakProgress.map((segment, index) => (
          <div
            key={index}
            className={`flex-1 ${segment.filled ? "bg-foreground" : "bg-muted"}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="space-y-3" role="list" aria-label="Habit statuses">
        {habits.map((habit) => (
          <div
            key={habit.name}
            className={`flex justify-between text-xs items-center ${
              habit.isInactive ? "opacity-50" : ""
            }`}
            role="listitem"
          >
            <span
              className={`flex items-center gap-2 ${
                habit.isActive ? "text-foreground" : "text-muted-foreground"
              } font-display`}
            >
              <span
                className={`w-1.5 h-1.5 ${
                  habit.isActive ? "bg-foreground" : habit.isInactive ? "bg-secondary" : "bg-muted-foreground"
                }`}
                aria-hidden="true"
              />
              {habit.name}
            </span>
            <span className="text-muted-foreground font-display">{habit.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
