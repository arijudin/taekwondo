import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface TournamentDay {
  id: number
  tournament_id: number
  day_number: number
  date: string
  name: string
  description?: string
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface DayState {
  days: TournamentDay[]
  currentDay: TournamentDay | null
  loading: boolean
  error: string | null
}

const initialState: DayState = {
  days: [],
  currentDay: null,
  loading: false,
  error: null,
}

const daySlice = createSlice({
  name: "day",
  initialState,
  reducers: {
    setDays: (state, action: PayloadAction<TournamentDay[]>) => {
      state.days = action.payload
    },
    setCurrentDay: (state, action: PayloadAction<TournamentDay | null>) => {
      state.currentDay = action.payload
    },
    addDay: (state, action: PayloadAction<TournamentDay>) => {
      state.days.push(action.payload)
    },
    updateDay: (state, action: PayloadAction<TournamentDay>) => {
      const index = state.days.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.days[index] = action.payload
      }
      if (state.currentDay?.id === action.payload.id) {
        state.currentDay = action.payload
      }
    },
    removeDay: (state, action: PayloadAction<number>) => {
      state.days = state.days.filter((d) => d.id !== action.payload)
      if (state.currentDay?.id === action.payload) {
        state.currentDay = null
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { setDays, setCurrentDay, addDay, updateDay, removeDay, setLoading, setError, clearError } =
  daySlice.actions

export default daySlice.reducer
