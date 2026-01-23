"use client"

import { useCallback, useState } from "react"
import { Trash2, Clock, Palette, Pencil, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChrono } from "./chrono-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  type MasterCard,
  CARD_COLORS,
  formatTime,
  formatDuration,
  getCardEndTime,
  SCHEDULE_CONFIG,
  DAY_FULL_LABELS,
} from "./types"

// Card Inspector Component
function CardInspector() {
  const { state, dispatch, getScheduleCard, getMasterCard } = useChrono()
  const selectedCard = state.selectedCardId ? getScheduleCard(state.selectedCardId) : null
  const masterCard = selectedCard ? getMasterCard(selectedCard.masterCardId) : null

  const handleTimeChange = useCallback(
    (field: "startHour" | "startMinute", value: number) => {
      if (!selectedCard) return
      dispatch({
        type: "UPDATE_SCHEDULE_CARD",
        card: { ...selectedCard, [field]: value },
      })
    },
    [selectedCard, dispatch]
  )

  const handleDurationChange = useCallback(
    (minutes: number) => {
      if (!selectedCard) return
      dispatch({
        type: "UPDATE_SCHEDULE_CARD",
        card: { ...selectedCard, durationMinutes: minutes },
      })
    },
    [selectedCard, dispatch]
  )

  const handleDelete = useCallback(() => {
    if (!selectedCard) return
    dispatch({ type: "DELETE_SCHEDULE_CARD", cardId: selectedCard.id })
  }, [selectedCard, dispatch])

  if (!selectedCard || !masterCard) {
    return (
      <div className="border-b border-border p-3 flex flex-col min-h-[140px]">
        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
            Card Inspector
          </p>
          <h4 className="text-sm font-bold text-foreground font-display">
            Selected Card
          </h4>
        </div>
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-xs text-muted-foreground font-display px-2">
            Select a card from the timetable to inspect its properties
          </p>
        </div>
      </div>
    )
  }

  const endTime = getCardEndTime(selectedCard)

  return (
    <div className="border-b border-border p-3 flex flex-col">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
            Card Inspector
          </p>
          <h4 className="text-sm font-bold text-foreground font-display">
            {masterCard.name}
          </h4>
        </div>
        {state.editMode === "edit" && (
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10"
            aria-label={`Delete ${masterCard.name}`}
          >
            <Trash2 className="size-3" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {/* Color preview and day */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 flex-shrink-0"
            style={{ backgroundColor: masterCard.color }}
            aria-label={`Color: ${masterCard.color}`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground font-display uppercase">Day</p>
            <p className="text-xs font-medium font-display truncate">
              {DAY_FULL_LABELS[selectedCard.day]}
            </p>
          </div>
        </div>

        {/* Time info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
              Start
            </Label>
            {state.editMode === "edit" ? (
              <div className="flex items-center gap-0.5">
                <Input
                  type="number"
                  min={SCHEDULE_CONFIG.START_HOUR}
                  max={SCHEDULE_CONFIG.END_HOUR}
                  value={selectedCard.startHour}
                  onChange={(e) => handleTimeChange("startHour", parseInt(e.target.value) || 0)}
                  className="w-10 h-7 text-xs text-center tabular-nums font-display px-1"
                  aria-label="Start hour"
                />
                <span className="text-muted-foreground text-xs">:</span>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  step={30}
                  value={selectedCard.startMinute}
                  onChange={(e) => handleTimeChange("startMinute", parseInt(e.target.value) || 0)}
                  className="w-10 h-7 text-xs text-center tabular-nums font-display px-1"
                  aria-label="Start minute"
                />
              </div>
            ) : (
              <p className="text-xs font-medium tabular-nums font-display">
                {formatTime(selectedCard.startHour, selectedCard.startMinute)}
              </p>
            )}
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
              End
            </Label>
            <p className="text-xs font-medium tabular-nums font-display h-7 flex items-center">
              {formatTime(endTime.hour, endTime.minute)}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div>
          <Label className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
            Duration
          </Label>
          {state.editMode === "edit" ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={SCHEDULE_CONFIG.MIN_DURATION_MINUTES}
                max={SCHEDULE_CONFIG.MAX_DURATION_MINUTES}
                step={30}
                value={selectedCard.durationMinutes}
                onChange={(e) => handleDurationChange(parseInt(e.target.value) || 30)}
                className="w-16 h-7 text-xs tabular-nums font-display"
                aria-label="Duration in minutes"
              />
              <span className="text-xs text-muted-foreground font-display">
                ({formatDuration(selectedCard.durationMinutes)})
              </span>
            </div>
          ) : (
            <p className="text-xs font-medium font-display">
              {formatDuration(selectedCard.durationMinutes)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Palette Card Component
interface PaletteCardProps {
  masterCard: MasterCard
  onEdit: (card: MasterCard) => void
}

function PaletteCard({ masterCard, onEdit }: PaletteCardProps) {
  const { state } = useChrono()

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (state.editMode !== "edit") {
        e.preventDefault()
        return
      }
      e.dataTransfer.setData("masterCardId", masterCard.id)
      e.dataTransfer.effectAllowed = "copy"
    },
    [masterCard.id, state.editMode]
  )

  return (
    <div
      draggable={state.editMode === "edit"}
      onDragStart={handleDragStart}
      className={cn(
        "flex items-center gap-2 p-2 border border-border bg-card hover:bg-accent/50 transition-colors group",
        state.editMode === "edit" && "cursor-grab active:cursor-grabbing"
      )}
      role="listitem"
      aria-label={`${masterCard.name} - ${formatDuration(masterCard.defaultDurationMinutes)}`}
    >
      <div
        className="w-3 h-3 flex-shrink-0"
        style={{ backgroundColor: masterCard.color }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate font-display">{masterCard.name}</p>
        <p className="text-[10px] text-muted-foreground font-display">
          {formatDuration(masterCard.defaultDurationMinutes)}
        </p>
      </div>
      {state.editMode === "edit" && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(masterCard)}
          className="opacity-0 group-hover:opacity-100 transition-opacity size-6"
          aria-label={`Edit ${masterCard.name}`}
        >
          <Pencil className="size-3" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

// Master Card Editor
interface MasterCardEditorProps {
  card: MasterCard | null
  onSave: (card: MasterCard, cascade: boolean) => void
  onCancel: () => void
  onDelete?: (cardId: string) => void
  isNew?: boolean
}

function MasterCardEditor({ card, onSave, onCancel, onDelete, isNew }: MasterCardEditorProps) {
  const [name, setName] = useState(card?.name ?? "")
  const [color, setColor] = useState(card?.color ?? CARD_COLORS[0].value)
  const [duration, setDuration] = useState(card?.defaultDurationMinutes ?? 60)
  const [cascade, setCascade] = useState(false)

  const handleSave = useCallback(() => {
    if (!name.trim()) return
    onSave(
      {
        id: card?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: name.trim(),
        color,
        defaultDurationMinutes: duration,
      },
      cascade
    )
  }, [card, name, color, duration, cascade, onSave])

  return (
    <div className="p-3 border border-border bg-muted/30 space-y-3 mb-2">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-bold font-display">
          {isNew ? "New Master Card" : "Edit Master Card"}
        </h5>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onCancel} aria-label="Cancel" className="size-6">
            <X className="size-3" aria-hidden="true" />
          </Button>
          <Button variant="default" size="icon-sm" onClick={handleSave} aria-label="Save" className="size-6">
            <Check className="size-3" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <Label htmlFor="card-name" className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
            Name
          </Label>
          <Input
            id="card-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Card name..."
            className="font-display h-7 text-xs"
            autoComplete="off"
          />
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
            Color
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {CARD_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={cn(
                  "w-5 h-5 transition-transform hover:scale-110",
                  color === c.value && "ring-2 ring-foreground ring-offset-1 ring-offset-background"
                )}
                style={{ backgroundColor: c.value }}
                aria-label={c.name}
                aria-pressed={color === c.value}
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="card-duration" className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
            Default Duration (min)
          </Label>
          <Input
            id="card-duration"
            type="number"
            min={SCHEDULE_CONFIG.MIN_DURATION_MINUTES}
            max={SCHEDULE_CONFIG.MAX_DURATION_MINUTES}
            step={30}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
            className="w-20 tabular-nums font-display h-7 text-xs"
          />
        </div>

        {!isNew && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cascade-changes"
              checked={cascade}
              onChange={(e) => setCascade(e.target.checked)}
              className="w-3 h-3"
            />
            <Label htmlFor="cascade-changes" className="text-[10px] text-muted-foreground font-display">
              Apply duration to all instances
            </Label>
          </div>
        )}

        {!isNew && onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(card!.id)}
            className="w-full text-destructive hover:bg-destructive/10 font-display h-7 text-xs"
          >
            <Trash2 className="size-3 mr-1" aria-hidden="true" />
            Delete Master Card
          </Button>
        )}
      </div>
    </div>
  )
}

// Activity Palette Component
function ActivityPalette() {
  const { state, dispatch } = useChrono()
  const [editingCard, setEditingCard] = useState<MasterCard | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSave = useCallback(
    (card: MasterCard, cascade: boolean) => {
      if (isCreating) {
        dispatch({ type: "ADD_MASTER_CARD", card })
      } else {
        dispatch({ type: "UPDATE_MASTER_CARD", card, cascade })
      }
      setEditingCard(null)
      setIsCreating(false)
    },
    [dispatch, isCreating]
  )

  const handleDelete = useCallback(
    (cardId: string) => {
      dispatch({ type: "DELETE_MASTER_CARD", cardId })
      setEditingCard(null)
    },
    [dispatch]
  )

  const handleCancel = useCallback(() => {
    setEditingCard(null)
    setIsCreating(false)
  }, [])

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
            Activity Palette
          </p>
          <h4 className="text-sm font-bold text-foreground font-display">
            Master Cards
          </h4>
        </div>
        {state.editMode === "edit" && !isCreating && !editingCard && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="font-display h-7 text-xs"
          >
            <Palette className="size-3 mr-1" aria-hidden="true" />
            New
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {(isCreating || editingCard) && (
            <MasterCardEditor
              card={editingCard}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              isNew={isCreating}
            />
          )}

          {!isCreating && !editingCard && (
            <div className="space-y-1" role="list" aria-label="Available schedule cards">
              {state.masterCards.map((card) => (
                <PaletteCard key={card.id} masterCard={card} onEdit={setEditingCard} />
              ))}
            </div>
          )}

          {state.editMode === "edit" && !isCreating && !editingCard && (
            <p className="text-[10px] text-muted-foreground mt-3 text-center font-display">
              Drag cards to the timetable or right-click a time slot
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Main Control Panel
export function ControlPanel() {
  return (
    <div className="flex flex-col h-full bg-card tech-border">
      <CardInspector />
      <ActivityPalette />
    </div>
  )
}
