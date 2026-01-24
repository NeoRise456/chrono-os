"use client"

import { useCallback, useState } from "react"
import { Trash2, Pencil, Check, X, Plus } from "lucide-react"
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

// Palette Card Component
interface PaletteCardProps {
  masterCard: MasterCard
  isSelected: boolean
  onSelect: (card: MasterCard) => void
  onEdit: (card: MasterCard) => void
}

function PaletteCard({ masterCard, isSelected, onSelect, onEdit }: PaletteCardProps) {
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

  const handleClick = useCallback(() => {
    onSelect(masterCard)
  }, [masterCard, onSelect])

  return (
    <div
      draggable={state.editMode === "edit"}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 p-3 border border-border bg-card hover:bg-accent/50 transition-colors group cursor-pointer",
        state.editMode === "edit" && "cursor-grab active:cursor-grabbing",
        isSelected && "ring-2 ring-foreground ring-inset"
      )}
      role="listitem"
      aria-label={`${masterCard.name} - ${formatDuration(masterCard.defaultDurationMinutes)}`}
      aria-selected={isSelected}
    >
      <div
        className="w-4 h-4 flex-shrink-0"
        style={{ backgroundColor: masterCard.color }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate font-display">{masterCard.name}</p>
        <p className="text-[10px] text-muted-foreground font-display">
          {formatDuration(masterCard.defaultDurationMinutes)}
        </p>
      </div>
      {state.editMode === "edit" && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(masterCard)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Edit ${masterCard.name}`}
        >
          <Pencil className="size-3" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

// Master Card Editor (inline)
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
    <div className="p-4 border border-border bg-muted/30 space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold font-display">
          {isNew ? "New Card" : "Edit Card"}
        </h5>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onCancel} aria-label="Cancel">
            <X className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="default" size="icon-sm" onClick={handleSave} aria-label="Save">
            <Check className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="card-name" className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
            Name
          </Label>
          <Input
            id="card-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Card name..."
            className="font-display h-8 text-sm"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="card-duration" className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
            Duration (min)
          </Label>
          <Input
            id="card-duration"
            type="number"
            min={SCHEDULE_CONFIG.MIN_DURATION_MINUTES}
            max={SCHEDULE_CONFIG.MAX_DURATION_MINUTES}
            step={30}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
            className="tabular-nums font-display h-8 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-[10px] text-muted-foreground font-display uppercase mb-1.5 block">
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

      <div className="flex items-center justify-between pt-2">
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
              Apply to all instances
            </Label>
          </div>
        )}
        {!isNew && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(card!.id)}
            className="text-destructive hover:bg-destructive/10 font-display h-7 text-xs"
          >
            <Trash2 className="size-3 mr-1" aria-hidden="true" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}

// Card Collection (Left side)
function CardCollection() {
  const { state, dispatch, selectMasterCard } = useChrono()
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

  const handleSelect = useCallback(
    (card: MasterCard) => {
      selectMasterCard(card.id)
    },
    [selectMasterCard]
  )

  return (
    <div className="flex-1 flex flex-col border-r border-border min-w-0">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
            Activity Palette
          </p>
          <h4 className="text-sm font-bold text-foreground font-display">
            Card Collection
          </h4>
        </div>
        {state.editMode === "edit" && !isCreating && !editingCard && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="font-display h-7 text-xs"
          >
            <Plus className="size-3 mr-1" aria-hidden="true" />
            New
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
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
            <div className="grid grid-cols-2 gap-2" role="list" aria-label="Available schedule cards">
              {state.masterCards.map((card) => (
                <PaletteCard
                  key={card.id}
                  masterCard={card}
                  isSelected={state.selectedMasterCardId === card.id}
                  onSelect={handleSelect}
                  onEdit={setEditingCard}
                />
              ))}
            </div>
          )}

          {state.editMode === "edit" && !isCreating && !editingCard && (
            <p className="text-[10px] text-muted-foreground mt-3 text-center font-display">
              Drag cards to timetable or right-click a time slot
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// Card Info / Inspector (Right side)
function CardInfo() {
  const { state, dispatch, getScheduleCard, getMasterCard } = useChrono()
  
  // Get selected schedule card (if any)
  const selectedScheduleCard = state.selectedCardId ? getScheduleCard(state.selectedCardId) : null
  const scheduleCardMaster = selectedScheduleCard ? getMasterCard(selectedScheduleCard.masterCardId) : null
  
  // Get selected master card (if any)
  const selectedMasterCard = state.selectedMasterCardId ? getMasterCard(state.selectedMasterCardId) : null
  
  // Count instances of selected master card in schedule
  const masterCardInstances = selectedMasterCard
    ? state.scheduleCards.filter((c) => c.masterCardId === selectedMasterCard.id).length
    : 0

  const handleTimeChange = useCallback(
    (field: "startHour" | "startMinute", value: number) => {
      if (!selectedScheduleCard) return
      dispatch({
        type: "UPDATE_SCHEDULE_CARD",
        card: { ...selectedScheduleCard, [field]: value },
      })
    },
    [selectedScheduleCard, dispatch]
  )

  const handleDurationChange = useCallback(
    (minutes: number) => {
      if (!selectedScheduleCard) return
      dispatch({
        type: "UPDATE_SCHEDULE_CARD",
        card: { ...selectedScheduleCard, durationMinutes: minutes },
      })
    },
    [selectedScheduleCard, dispatch]
  )

  const handleDelete = useCallback(() => {
    if (!selectedScheduleCard) return
    dispatch({ type: "DELETE_SCHEDULE_CARD", cardId: selectedScheduleCard.id })
  }, [selectedScheduleCard, dispatch])

  // Show master card info (from palette selection)
  if (selectedMasterCard) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-2 border-b border-border flex items-center gap-3 flex-shrink-0">
          <div
            className="w-4 h-4 flex-shrink-0"
            style={{ backgroundColor: selectedMasterCard.color }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
              Activity Card
            </p>
            <h4 className="text-sm font-bold text-foreground font-display truncate">
              {selectedMasterCard.name}
            </h4>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Default Duration */}
            <div>
              <p className="text-[10px] text-muted-foreground font-display uppercase mb-1">
                Default Duration
              </p>
              <p className="text-sm font-medium font-display">
                {formatDuration(selectedMasterCard.defaultDurationMinutes)}
              </p>
            </div>

            {/* Color */}
            <div>
              <p className="text-[10px] text-muted-foreground font-display uppercase mb-1">
                Color
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 border border-border"
                  style={{ backgroundColor: selectedMasterCard.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium font-display text-muted-foreground">
                  {CARD_COLORS.find((c) => c.value === selectedMasterCard.color)?.name ?? "Custom"}
                </span>
              </div>
            </div>

            {/* Schedule Usage */}
            <div>
              <p className="text-[10px] text-muted-foreground font-display uppercase mb-1">
                Scheduled Instances
              </p>
              <p className="text-sm font-medium font-display">
                {masterCardInstances} {masterCardInstances === 1 ? "time" : "times"} this week
              </p>
            </div>

            {state.editMode === "view" && (
              <p className="text-[10px] text-muted-foreground font-display pt-2 border-t border-border">
                Click &quot;Edit Schedule&quot; to drag this card onto the timetable
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Show schedule card info (from timetable selection)
  if (selectedScheduleCard && scheduleCardMaster) {
    const endTime = getCardEndTime(selectedScheduleCard)

    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-4 h-4 flex-shrink-0"
              style={{ backgroundColor: scheduleCardMaster.color }}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
                Scheduled Card
              </p>
              <h4 className="text-sm font-bold text-foreground font-display truncate">
                {scheduleCardMaster.name}
              </h4>
            </div>
          </div>
          {state.editMode === "edit" && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleDelete}
              className="text-destructive hover:bg-destructive/10 flex-shrink-0"
              aria-label={`Delete ${scheduleCardMaster.name}`}
            >
              <Trash2 className="size-3" aria-hidden="true" />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Day */}
            <div>
              <p className="text-[10px] text-muted-foreground font-display uppercase mb-1">Day</p>
              <p className="text-sm font-medium font-display">
                {DAY_FULL_LABELS[selectedScheduleCard.day]}
              </p>
            </div>

            {/* Time info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
                  Start Time
                </Label>
                {state.editMode === "edit" ? (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={SCHEDULE_CONFIG.START_HOUR}
                      max={SCHEDULE_CONFIG.END_HOUR}
                      value={selectedScheduleCard.startHour}
                      onChange={(e) => handleTimeChange("startHour", parseInt(e.target.value) || 0)}
                      className="w-12 text-center tabular-nums font-display h-8 text-sm"
                      aria-label="Start hour"
                    />
                    <span className="text-muted-foreground">:</span>
                    <Input
                      type="number"
                      min={0}
                      max={30}
                      step={30}
                      value={selectedScheduleCard.startMinute}
                      onChange={(e) => handleTimeChange("startMinute", parseInt(e.target.value) || 0)}
                      className="w-12 text-center tabular-nums font-display h-8 text-sm"
                      aria-label="Start minute"
                    />
                  </div>
                ) : (
                  <p className="text-sm font-medium tabular-nums font-display">
                    {formatTime(selectedScheduleCard.startHour, selectedScheduleCard.startMinute)}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground font-display uppercase mb-1 block">
                  End Time
                </Label>
                <p className="text-sm font-medium tabular-nums font-display">
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
                    value={selectedScheduleCard.durationMinutes}
                    onChange={(e) => handleDurationChange(parseInt(e.target.value) || 30)}
                    className="w-16 tabular-nums font-display h-8 text-sm"
                    aria-label="Duration in minutes"
                  />
                  <span className="text-xs text-muted-foreground font-display">
                    min ({formatDuration(selectedScheduleCard.durationMinutes)})
                  </span>
                </div>
              ) : (
                <p className="text-sm font-medium font-display">
                  {formatDuration(selectedScheduleCard.durationMinutes)}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Empty state - nothing selected
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="px-4 py-2 border-b border-border flex-shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
          Card Inspector
        </p>
        <h4 className="text-sm font-bold text-foreground font-display">
          Selected Card
        </h4>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-xs text-muted-foreground font-display text-center">
          Select a card from the collection or timetable to view its details
        </p>
      </div>
    </div>
  )
}

export function BottomPanel() {
  return (
    <div className="flex h-full">
      <CardCollection />
      <CardInfo />
    </div>
  )
}
