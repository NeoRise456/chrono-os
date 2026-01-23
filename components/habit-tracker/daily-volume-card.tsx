"use client"

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { day: "MON", tasks: 40, isHighlight: false },
  { day: "TUE", tasks: 70, isHighlight: true },
  { day: "WED", tasks: 55, isHighlight: false },
  { day: "THU", tasks: 30, isHighlight: false },
  { day: "FRI", tasks: 85, isHighlight: true },
  { day: "SAT", tasks: 60, isHighlight: false },
  { day: "SUN", tasks: 45, isHighlight: false },
  { day: "MON2", tasks: 90, isHighlight: true },
  { day: "TUE2", tasks: 20, isHighlight: false },
  { day: "WED2", tasks: 65, isHighlight: false },
]

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function DailyVolumeCard() {
  const totalTasks = 14

  return (
    <div className="col-span-1 md:col-span-4 bg-card p-6 h-80 flex flex-col tech-border text-muted-foreground">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-display">
            Daily Volume
          </p>
          <h3 className="text-3xl font-bold text-foreground font-display">
            {totalTasks} Tasks
          </h3>
        </div>
        <span className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 font-display">
          7 DAYS
        </span>
      </div>
      <div className="flex-1 mt-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap="8%"
          >
            <XAxis dataKey="day" hide />
            <YAxis domain={[0, 100]} hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="font-display"
                  hideLabel
                  formatter={(value) => [`${value}%`, "Completion"]}
                />
              }
            />
            <Bar
              dataKey="tasks"
              radius={0}
              fill="var(--chart-2)"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isHighlight ? "var(--chart-1)" : "var(--chart-2)"}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-display uppercase">
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
        <span>SUN</span>
      </div>
    </div>
  )
}
