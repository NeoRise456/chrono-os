"use client"

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from "react"
import {
  type MasterCard,
  type ScheduleCard,
  type DragState,
  type EditMode,
  type DayOfWeek,
  DEFAULT_MASTER_CARDS,
  clampDuration,
  cardsOverlap,
} from "./types"

// State shape
interface ChronoState {
  masterCards: MasterCard[]
  scheduleCards: ScheduleCard[]
  selectedCardId: string | null
  selectedMasterCardId: string | null
  editMode: EditMode
  dragState: DragState | null
}

// Action types
type ChronoAction =
  | { type: "SET_EDIT_MODE"; mode: EditMode }
  | { type: "SELECT_CARD"; cardId: string | null }
  | { type: "SELECT_MASTER_CARD"; cardId: string | null }
  | { type: "ADD_MASTER_CARD"; card: MasterCard }
  | { type: "UPDATE_MASTER_CARD"; card: MasterCard; cascade?: boolean }
  | { type: "DELETE_MASTER_CARD"; cardId: string }
  | { type: "ADD_SCHEDULE_CARD"; card: ScheduleCard }
  | { type: "UPDATE_SCHEDULE_CARD"; card: ScheduleCard }
  | { type: "DELETE_SCHEDULE_CARD"; cardId: string }
  | { type: "DUPLICATE_CARD_TO_DAYS"; cardId: string; startDay: DayOfWeek; endDay: DayOfWeek }
  | { type: "SET_DRAG_STATE"; dragState: DragState | null }
  | { type: "LOAD_STATE"; state: Partial<ChronoState> }

// Initial state
const initialState: ChronoState = {
  masterCards: DEFAULT_MASTER_CARDS,
  scheduleCards: [],
  selectedCardId: null,
  selectedMasterCardId: null,
  editMode: "view",
  dragState: null,
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Reducer
function chronoReducer(state: ChronoState, action: ChronoAction): ChronoState {
  switch (action.type) {
    case "SET_EDIT_MODE":
      return { ...state, editMode: action.mode }

    case "SELECT_CARD":
      // Clear master card selection when selecting a schedule card
      return { ...state, selectedCardId: action.cardId, selectedMasterCardId: null }

    case "SELECT_MASTER_CARD":
      // Clear schedule card selection when selecting a master card
      return { ...state, selectedMasterCardId: action.cardId, selectedCardId: null }

    case "ADD_MASTER_CARD":
      return {
        ...state,
        masterCards: [...state.masterCards, action.card],
      }

    case "UPDATE_MASTER_CARD": {
      const updatedMasterCards = state.masterCards.map((card) =>
        card.id === action.card.id ? action.card : card
      )
      let updatedScheduleCards = state.scheduleCards
      if (action.cascade) {
        updatedScheduleCards = state.scheduleCards.map((card) =>
          card.masterCardId === action.card.id
            ? { ...card, durationMinutes: action.card.defaultDurationMinutes }
            : card
        )
      }
      return {
        ...state,
        masterCards: updatedMasterCards,
        scheduleCards: updatedScheduleCards,
      }
    }

    case "DELETE_MASTER_CARD":
      return {
        ...state,
        masterCards: state.masterCards.filter((card) => card.id !== action.cardId),
        scheduleCards: state.scheduleCards.filter((card) => card.masterCardId !== action.cardId),
      }

    case "ADD_SCHEDULE_CARD": {
      // Check for overlaps
      const hasOverlap = state.scheduleCards.some((existing) =>
        cardsOverlap(existing, action.card)
      )
      if (hasOverlap) return state
      return {
        ...state,
        scheduleCards: [...state.scheduleCards, action.card],
        selectedCardId: action.card.id,
      }
    }

    case "UPDATE_SCHEDULE_CARD": {
      const cardWithClampedDuration = {
        ...action.card,
        durationMinutes: clampDuration(action.card.durationMinutes),
      }
      // Check for overlaps with other cards (not itself)
      const hasOverlap = state.scheduleCards.some(
        (existing) =>
          existing.id !== action.card.id && cardsOverlap(existing, cardWithClampedDuration)
      )
      if (hasOverlap) return state
      return {
        ...state,
        scheduleCards: state.scheduleCards.map((card) =>
          card.id === action.card.id ? cardWithClampedDuration : card
        ),
      }
    }

    case "DELETE_SCHEDULE_CARD":
      return {
        ...state,
        scheduleCards: state.scheduleCards.filter((card) => card.id !== action.cardId),
        selectedCardId: state.selectedCardId === action.cardId ? null : state.selectedCardId,
      }

    case "DUPLICATE_CARD_TO_DAYS": {
      const sourceCard = state.scheduleCards.find((c) => c.id === action.cardId)
      if (!sourceCard) return state

      const newCards: ScheduleCard[] = []
      const minDay = Math.min(action.startDay, action.endDay) as DayOfWeek
      const maxDay = Math.max(action.startDay, action.endDay) as DayOfWeek

      for (let day = minDay; day <= maxDay; day++) {
        if (day === sourceCard.day) continue
        const newCard: ScheduleCard = {
          ...sourceCard,
          id: generateId(),
          day: day as DayOfWeek,
        }
        // Check for overlaps
        const hasOverlap =
          state.scheduleCards.some((existing) => cardsOverlap(existing, newCard)) ||
          newCards.some((existing) => cardsOverlap(existing, newCard))
        if (!hasOverlap) {
          newCards.push(newCard)
        }
      }

      return {
        ...state,
        scheduleCards: [...state.scheduleCards, ...newCards],
      }
    }

    case "SET_DRAG_STATE":
      return { ...state, dragState: action.dragState }

    case "LOAD_STATE":
      return { ...state, ...action.state }

    default:
      return state
  }
}

// Context
interface ChronoContextValue {
  state: ChronoState
  dispatch: Dispatch<ChronoAction>
  // Helper functions
  getMasterCard: (id: string) => MasterCard | undefined
  getScheduleCard: (id: string) => ScheduleCard | undefined
  getCardsForDay: (day: DayOfWeek) => ScheduleCard[]
  addScheduleCard: (masterCardId: string, day: DayOfWeek, startHour: number, startMinute: number) => void
  selectMasterCard: (cardId: string | null) => void
  toggleEditMode: () => void
}

const ChronoContext = createContext<ChronoContextValue | null>(null)

// Provider component
export function ChronoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chronoReducer, initialState)

  const getMasterCard = useCallback(
    (id: string) => state.masterCards.find((card) => card.id === id),
    [state.masterCards]
  )

  const getScheduleCard = useCallback(
    (id: string) => state.scheduleCards.find((card) => card.id === id),
    [state.scheduleCards]
  )

  const getCardsForDay = useCallback(
    (day: DayOfWeek) =>
      state.scheduleCards
        .filter((card) => card.day === day)
        .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute)),
    [state.scheduleCards]
  )

  const addScheduleCard = useCallback(
    (masterCardId: string, day: DayOfWeek, startHour: number, startMinute: number) => {
      const masterCard = getMasterCard(masterCardId)
      if (!masterCard) return

      const newCard: ScheduleCard = {
        id: generateId(),
        masterCardId,
        day,
        startHour,
        startMinute,
        durationMinutes: masterCard.defaultDurationMinutes,
      }
      dispatch({ type: "ADD_SCHEDULE_CARD", card: newCard })
    },
    [getMasterCard]
  )

  const toggleEditMode = useCallback(() => {
    dispatch({
      type: "SET_EDIT_MODE",
      mode: state.editMode === "view" ? "edit" : "view",
    })
  }, [state.editMode])

  const selectMasterCard = useCallback((cardId: string | null) => {
    dispatch({ type: "SELECT_MASTER_CARD", cardId })
  }, [])

  const value: ChronoContextValue = {
    state,
    dispatch,
    getMasterCard,
    getScheduleCard,
    getCardsForDay,
    addScheduleCard,
    selectMasterCard,
    toggleEditMode,
  }

  return <ChronoContext.Provider value={value}>{children}</ChronoContext.Provider>
}

// Hook to use the context
export function useChrono() {
  const context = useContext(ChronoContext)
  if (!context) {
    throw new Error("useChrono must be used within a ChronoProvider")
  }
  return context
}
