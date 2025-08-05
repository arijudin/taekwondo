import { configureStore } from "@reduxjs/toolkit"
import { tournamentApi } from "./api/tournamentApi"
import tournamentSlice from "./slices/tournamentSlice"
import daySlice from "./slices/daySlice"

export const store = configureStore({
  reducer: {
    tournament: tournamentSlice,
    day: daySlice,
    [tournamentApi.reducerPath]: tournamentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(tournamentApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
