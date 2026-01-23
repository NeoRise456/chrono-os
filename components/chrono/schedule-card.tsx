"use client"

import { useRef, useCallback, type MouseEvent, type KeyboardEvent } from "react"
import { X, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChrono } from "./chrono-context"
import {
  type ScheduleCard as ScheduleCardType,
  type DayOfWeek,
  SCHEDULE_CONFIG,
  formatTime,
  formatDuration,
  getCardEndTime,
  clampDuration,
} from "./types"

interface ScheduleCardProps {
  card: ScheduleCardType
  isSelected: boolean
}

export function ScheduleCard({ card, isSelected }: ScheduleCardProps) {
  const { state, dispatch, getMasterCard } = useChrono()
  const cardRef = useRef<HTMLDivElement>(null)
  const masterCard = getMasterCard(card.masterCardId)

  const handleSelect = useCallback(() => {
    dispatch({ type: "SELECT_CARD", cardId: card.id })
  }, [dispatch, card.id])

  const handleDelete = useCallback(
    (e: MouseEvent | KeyboardEvent) => {
      e.stopPropagation()
      dispatch({ type: "DELETE_SCHEDULE_CARD", cardId: card.id })
    },
    [dispatch, card.id]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleSelect()
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        handleDelete(e)
      }
    },
    [handleSelect, handleDelete]
  )

  // Vertical resize handler
  const handleVerticalResizeStart = useCallback(
    (e: MouseEvent) => {
      if (state.editMode !== "edit") return
      e.preventDefault()
      e.stopPropagation()

      const startY = e.clientY
      const startDuration = card.durationMinutes

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const deltaY = moveEvent.clientY - startY
        const deltaMinutes = Math.round((deltaY / SCHEDULE_CONFIG.SLOT_HEIGHT_PX) * 60)
        const newDuration = clampDuration(startDuration + deltaMinutes)

        dispatch({
          type: "UPDATE_SCHEDULE_CARD",
          card: { ...card, durationMinutes: newDuration },
        })
      }

      const handleMouseUp = () => {
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
    [state.editMode, card, dispatch]
  )

  // Horizontal resize handler for recurrence
  const handleHorizontalResizeStart = useCallback(
    (e: MouseEvent, direction: "left" | "right") => {
      if (state.editMode !== "edit") return
      e.preventDefault()
      e.stopPropagation()

      const startX = e.clientX
      const startDay = card.day

      // Get the column width dynamically
      const timetable = document.querySelector("[data-timetable]")
      if (!timetable) return
      const columnWidth = timetable.clientWidth / 7

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const deltaDays = Math.round(deltaX / columnWidth)

        if (deltaDays === 0) return

        const targetDay = (startDay + deltaDays) as DayOfWeek
        if (targetDay < 0 || targetDay > 6) return

        // This is handled on mouse up for the full duplication
      }

      const handleMouseUp = (upEvent: globalThis.MouseEvent) => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""

        const deltaX = upEvent.clientX - startX
        const deltaDays = Math.round(deltaX / columnWidth)

        if (deltaDays !== 0) {
          const targetDay = Math.max(0, Math.min(6, startDay + deltaDays)) as DayOfWeek
          dispatch({
            type: "DUPLICATE_CARD_TO_DAYS",
            cardId: card.id,
            startDay: direction === "left" ? targetDay : startDay,
            endDay: direction === "right" ? targetDay : startDay,
          })
        }
      }

      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [state.editMode, card, dispatch]
  )

  // Drag to move handler
  const handleDragStart = useCallback(
    (e: MouseEvent) => {
      if (state.editMode !== "edit") return
      e.preventDefault()

      const startX = e.clientX
      const startY = e.clientY
      const startDay = card.day
      const startHour = card.startHour
      const startMinute = card.startMinute

      const timetable = document.querySelector("[data-timetable]")
      if (!timetable) return
      const columnWidth = timetable.clientWidth / 7
      const rect = timetable.getBoundingClientRect()

      dispatch({
        type: "SET_DRAG_STATE",
        dragState: {
          type: "move",
          cardId: card.id,
          originalCard: { ...card },
        },
      })

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY

        const deltaDays = Math.round(deltaX / columnWidth)
        const deltaMinutes = Math.round((deltaY / SCHEDULE_CONFIG.SLOT_HEIGHT_PX) * 60 / 30) * 30

        const newDay = Math.max(0, Math.min(6, startDay + deltaDays)) as DayOfWeek
        const totalMinutes = startHour * 60 + startMinute + deltaMinutes
        const newHour = Math.max(
          SCHEDULE_CONFIG.START_HOUR,
          Math.min(SCHEDULE_CONFIG.END_HOUR, Math.floor(totalMinutes / 60))
        )
        const newMinute = Math.max(0, totalMinutes % 60)

        dispatch({
          type: "UPDATE_SCHEDULE_CARD",
          card: {
            ...card,
            day: newDay,
            startHour: newHour,
            startMinute: newMinute >= 30 ? 30 : 0,
          },
        })
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
        dispatch({ type: "SET_DRAG_STATE", dragState: null })
      }

      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [state.editMode, card, dispatch]
  )

  if (!masterCard) return null

  const endTime = getCardEndTime(card)
  const topOffset =
    (card.startHour - SCHEDULE_CONFIG.START_HOUR) * SCHEDULE_CONFIG.SLOT_HEIGHT_PX +
    (card.startMinute / 60) * SCHEDULE_CONFIG.SLOT_HEIGHT_PX
  const height = (card.durationMinutes / 60) * SCHEDULE_CONFIG.SLOT_HEIGHT_PX

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      onMouseDown={state.editMode === "edit" ? handleDragStart : undefined}
      className={cn(
        "absolute left-1 right-1 overflow-hidden transition-shadow duration-150",
        "flex flex-col justify-between select-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 outline-none",
        state.editMode === "edit" ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isSelected && "ring-2 ring-foreground ring-offset-1 ring-offset-background z-10"
      )}
      style={{
        top: `${topOffset}px`,
        height: `${height}px`,
        backgroundColor: masterCard.color,
      }}
      aria-label={`${masterCard.name} from ${formatTime(card.startHour, card.startMinute)} to ${formatTime(endTime.hour, endTime.minute)}`}
      aria-selected={isSelected}
      data-card-id={card.id}
    >
      {/* Card content */}
      <div className="p-2 flex flex-col h-full text-white">
        <div className="flex items-start justify-between gap-1 min-h-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider truncate font-display">
              {masterCard.name}
            </p>
            {height >= 50 && (
              <p className="text-[10px] opacity-80 tabular-nums font-display mt-0.5">
                {formatTime(card.startHour, card.startMinute)} - {formatTime(endTime.hour, endTime.minute)}
              </p>
            )}
          </div>
          {state.editMode === "edit" && (
            <button
              onClick={handleDelete}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleDelete(e)
                }
              }}
              className="p-0.5 hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label={`Delete ${masterCard.name}`}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          )}
        </div>
        {height >= 70 && (
          <p className="text-[10px] opacity-70 font-display mt-auto">
            {formatDuration(card.durationMinutes)}
          </p>
        )}
      </div>

      {/* Edit mode handles */}
      {state.editMode === "edit" && (
        <>
          {/* Vertical resize handle (bottom) */}
          <div
            onMouseDown={handleVerticalResizeStart}
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/20 transition-colors group"
            role="slider"
            aria-label="Resize duration"
            aria-valuemin={SCHEDULE_CONFIG.MIN_DURATION_MINUTES}
            aria-valuemax={SCHEDULE_CONFIG.MAX_DURATION_MINUTES}
            aria-valuenow={card.durationMinutes}
            tabIndex={-1}
          >
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/40 group-hover:bg-white/80 transition-colors" />
          </div>

          {/* Horizontal resize handles (left/right for recurrence) */}
          <div
            onMouseDown={(e) => handleHorizontalResizeStart(e, "left")}
            className="absolute top-0 left-0 bottom-2 w-2 cursor-ew-resize hover:bg-white/20 transition-colors flex items-center justify-center"
            role="button"
            aria-label="Extend to previous days"
            tabIndex={-1}
          >
            <GripVertical className="size-3 opacity-0 hover:opacity-60" aria-hidden="true" />
          </div>
          <div
            onMouseDown={(e) => handleHorizontalResizeStart(e, "right")}
            className="absolute top-0 right-0 bottom-2 w-2 cursor-ew-resize hover:bg-white/20 transition-colors flex items-center justify-center"
            role="button"
            aria-label="Extend to next days"
            tabIndex={-1}
          >
            <GripVertical className="size-3 opacity-0 hover:opacity-60" aria-hidden="true" />
          </div>
        </>
      )}
    </div>
  )
}
