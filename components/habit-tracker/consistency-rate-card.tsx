"use client"

import { useMemo } from "react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { time: "12:00", current: 70, previous: 65 },
  { time: "12:05", current: 75, previous: 68 },
  { time: "12:10", current: 72, previous: 70 },
  { time: "12:15", current: 85, previous: 72 },
  { time: "12:20", current: 80, previous: 75 },
  { time: "12:25", current: 90, previous: 78 },
  { time: "12:30", current: 82, previous: 80 },
  { time: "12:35", current: 88, previous: 82 },
  { time: "12:40", current: 85, previous: 84 },
  { time: "12:45", current: 95, previous: 86 },
  { time: "12:50", current: 92, previous: 88 },
]

const chartConfig = {
  current: {
    label: "Current",
    color: "var(--chart-1)",
  },
  previous: {
    label: "Previous",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ConsistencyRateCard() {
  const consistencyRate = useMemo(() => {
    const lastValue = chartData[chartData.length - 1].current
    return lastValue.toFixed(1)
  }, [])

  return (
    <div className="col-span-1 md:col-span-4 bg-card p-6 h-80 flex flex-col justify-between tech-border text-muted-foreground">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-display">
            Consistency Rate
          </p>
          <h3 className="text-3xl font-bold text-foreground font-display">
            {consistencyRate}%
          </h3>
        </div>
        <span className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 font-display">
          24H
        </span>
      </div>
      <div className="flex-1 mt-6 relative">
        <ChartContainer config={chartConfig} className="h-32 w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis domain={[60, 100]} hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="font-display"
                  indicator="dot"
                />
              }
            />
            <Area
              type="linear"
              dataKey="current"
              stroke="var(--chart-1)"
              strokeWidth={1}
              fill="url(#fillCurrent)"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-display">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-foreground" aria-hidden="true" />
          Current
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-muted-foreground" aria-hidden="true" />
          Previous
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-display uppercase tabular-nums">
        <span>12:00 PM</span>
        <span>12:10 PM</span>
        <span>12:15 PM</span>
        <span>12:20 PM</span>
      </div>
    </div>
  )
}
