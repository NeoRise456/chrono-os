"use client"

const focusData = [
  { primary: 40, secondary: 20 },
  { primary: 25, secondary: 10 },
  { primary: 50, secondary: 30 },
  { primary: 60, secondary: 15 },
  { primary: 40, secondary: 10 },
  { primary: 30, secondary: 40 },
  { primary: 20, secondary: 5 },
]

export function FocusTrendCard() {
  return (
    <div className="col-span-1 md:col-span-4 bg-card p-6 min-h-[300px] flex flex-col tech-border text-muted-foreground">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-display">
            Focus Trend
          </p>
          <h3 className="text-2xl font-bold text-foreground font-display">
            Daily Focus
          </h3>
        </div>
        <span className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 font-display">
          24H
        </span>
      </div>
      <div 
        className="flex-1 flex items-end justify-between gap-2"
        role="img"
        aria-label="Daily focus trend chart showing primary and secondary focus hours"
      >
        {focusData.map((data, index) => (
          <div 
            key={index} 
            className="w-full flex flex-col justify-end gap-[1px] h-48"
            aria-hidden="true"
          >
            <div
              className="w-full bg-muted transition-all duration-300"
              style={{ height: `${data.secondary}%` }}
            />
            <div
              className="w-full bg-foreground transition-all duration-300"
              style={{ height: `${data.primary}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-display uppercase border-t border-border pt-2 border-dashed tabular-nums">
        <span>12:00 PM</span>
        <span>12:10 PM</span>
        <span>12:15 PM</span>
        <span>12:20 PM</span>
      </div>
    </div>
  )
}
