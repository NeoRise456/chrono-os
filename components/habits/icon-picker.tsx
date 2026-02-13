"use client"

import { useState } from "react"
import * as Icons from "lucide-react"
import { HABIT_ICONS } from "./utils"
import { ChevronDown, ChevronUp } from "lucide-react"

interface IconPickerProps {
  value: string | undefined
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const SelectedIcon = value
    ? (Icons[value as keyof typeof Icons] as React.ComponentType<{ className?: string }>)
    : null

  const handleIconSelect = (iconName: string) => {
    onChange(iconName)
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground font-display">
        Icon
      </label>

      {isExpanded ? (
        <div className="space-y-2">
          <div className="grid grid-cols-10 gap-1.5 max-h-32 overflow-y-auto border border-border p-2">
            {HABIT_ICONS.map((iconName) => {
              const Icon = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>
              if (!Icon) return null
              const isSelected = value === iconName

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleIconSelect(iconName)}
                  className={`h-9 flex items-center justify-center border transition-colors ${
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card hover:bg-accent text-foreground"
                  }`}
                  aria-label={`Select ${iconName} icon`}
                  aria-pressed={isSelected}
                >
                  <Icon className="size-4" />
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={toggleExpanded}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            <ChevronUp className="size-3" />
            Collapse
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={toggleExpanded}
          className="flex items-center gap-3 h-10 px-3 border border-border bg-card hover:bg-accent text-foreground transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          aria-label={value ? `Change icon from ${value}` : "Select an icon"}
        >
          {SelectedIcon ? (
            <SelectedIcon className="size-4 shrink-0" />
          ) : (
            <div className="size-4 shrink-0 border border-border border-dashed" />
          )}
          <span className="text-sm text-left flex-1 font-display">
            {value || "Select icon"}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}
