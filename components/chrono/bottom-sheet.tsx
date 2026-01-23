"use client"

import { useState, useCallback, useRef, useEffect, type ReactNode, createContext, useContext } from "react"
import { ChevronUp, ChevronDown, GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Context to share sheet height with parent
interface SheetContextValue {
  height: number
  isCollapsed: boolean
}

const SheetContext = createContext<SheetContextValue>({ height: 320, isCollapsed: false })

export function useSheetHeight() {
  return useContext(SheetContext)
}

interface BottomSheetProps {
  children: ReactNode
  defaultHeight?: number
  minHeight?: number
  maxHeight?: number
  collapsedHeight?: number
  expanded?: boolean  // Controlled expansion state
  onHeightChange?: (height: number, isCollapsed: boolean) => void
}

export function BottomSheet({
  children,
  defaultHeight = 320,
  minHeight = 200,
  maxHeight = 600,
  collapsedHeight = 48,
  expanded,
  onHeightChange,
}: BottomSheetProps) {
  const [height, setHeight] = useState(defaultHeight)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousHeight = useRef(defaultHeight)

  // Handle external expansion control
  useEffect(() => {
    if (expanded === undefined) return

    if (expanded === true) {
      // Force open to previously stored height (or default)
      const target = previousHeight.current || defaultHeight
      setIsCollapsed(false)
      setHeight(target)
      onHeightChange?.(target, false)
    } else {
      // If controller says collapse isn't requested, just sync parent with current state
      onHeightChange?.(isCollapsed ? collapsedHeight : height, isCollapsed)
    }
  }, [expanded, defaultHeight, collapsedHeight, isCollapsed, height, onHeightChange])

  const updateHeight = useCallback((newHeight: number, collapsed: boolean) => {
    setHeight(newHeight)
    setIsCollapsed(collapsed)
    onHeightChange?.(collapsed ? collapsedHeight : newHeight, collapsed)
  }, [collapsedHeight, onHeightChange])

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCollapsed) {
      updateHeight(previousHeight.current, false)
    } else {
      previousHeight.current = height
      updateHeight(height, true)
    }
  }, [isCollapsed, height, updateHeight])

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (isCollapsed) return
      e.preventDefault()

      const startY = e.clientY
      const startHeight = height

      setIsDragging(true)

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = startY - moveEvent.clientY
        const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight + deltaY))
        setHeight(newHeight)
        onHeightChange?.(newHeight, false)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }

      document.body.style.cursor = "ns-resize"
      document.body.style.userSelect = "none"
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [isCollapsed, height, minHeight, maxHeight, onHeightChange]
  )

  // Handle keyboard resize
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isCollapsed) return
      
      if (e.key === "ArrowUp") {
        e.preventDefault()
        const newHeight = Math.min(maxHeight, height + 20)
        setHeight(newHeight)
        onHeightChange?.(newHeight, false)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        const newHeight = Math.max(minHeight, height - 20)
        setHeight(newHeight)
        onHeightChange?.(newHeight, false)
      }
    },
    [isCollapsed, height, minHeight, maxHeight, onHeightChange]
  )

  const currentHeight = isCollapsed ? collapsedHeight : height

  return (
    <div
      ref={sheetRef}
      className={cn(
        "absolute bottom-0 left-0 right-0 z-30 bg-card border-t border-border flex flex-col",
        "transition-[height] duration-200 ease-out",
        isDragging && "transition-none"
      )}
      style={{ height: `${currentHeight}px` }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="Resize panel"
        aria-valuemin={minHeight}
        aria-valuemax={maxHeight}
        aria-valuenow={height}
        aria-orientation="vertical"
        tabIndex={isCollapsed ? -1 : 0}
        className={cn(
          "h-8 flex items-center justify-center border-b border-border bg-muted/30 group flex-shrink-0",
          !isCollapsed && "cursor-ns-resize hover:bg-accent/50",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset outline-none"
        )}
      >
        <div className="flex items-center gap-4">
          <GripHorizontal 
            className={cn(
              "size-4 text-muted-foreground",
              !isCollapsed && "group-hover:text-foreground"
            )} 
            aria-hidden="true" 
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-6 px-3 text-xs font-display gap-1.5"
            aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? (
              <>
                <ChevronUp className="size-3" aria-hidden="true" />
                Expand Panel
              </>
            ) : (
              <>
                <ChevronDown className="size-3" aria-hidden="true" />
                Collapse
              </>
            )}
          </Button>
          <GripHorizontal 
            className={cn(
              "size-4 text-muted-foreground",
              !isCollapsed && "group-hover:text-foreground"
            )} 
            aria-hidden="true" 
          />
        </div>
      </div>

      {/* Content */}
      <div 
        className={cn(
          "flex-1 overflow-hidden",
          isCollapsed && "invisible"
        )}
      >
        {children}
      </div>
    </div>
  )
}
