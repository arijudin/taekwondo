import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Tournament {
  id: number
  name: string
  description?: string
  start_date: string
  end_date: string
  location: string
  status: "planning" | "registration" | "ongoing" | "completed"
  organizer?: string
  chairman?: string
  referee_chief?: string
  treasurer?: string
  admin_tournament?: string
  registration_fee?: number
  created_at: string
  updated_at: string
}

interface TournamentState {
  currentTournament: Tournament | null
  tournaments: Tournament[]
  loading: boolean
  error: string | null
}

const initialState: TournamentState = {
  currentTournament: null,
  tournaments: [],
  loading: false,
  error: null,
}

const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    setCurrentTournament: (state, action: PayloadAction<Tournament>) => {
      state.currentTournament = action.payload
    },
    setTournaments: (state, action: PayloadAction<Tournament[]>) => {
      state.tournaments = action.payload
    },
    addTournament: (state, action: PayloadAction<Tournament>) => {
      state.tournaments.push(action.payload)
    },
    updateTournament: (state, action: PayloadAction<Tournament>) => {
      const index = state.tournaments.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.tournaments[index] = action.payload
      }
      if (state.currentTournament?.id === action.payload.id) {
        state.currentTournament = action.payload
      }
    },
    removeTournament: (state, action: PayloadAction<number>) => {
      state.tournaments = state.tournaments.filter((t) => t.id !== action.payload)
      if (state.currentTournament?.id === action.payload) {
        state.currentTournament = null
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

export const {
  setCurrentTournament,
  setTournaments,
  addTournament,
  updateTournament,
  removeTournament,
  setLoading,
  setError,
  clearError,
} = tournamentSlice.actions

export default tournamentSlice.reducer
