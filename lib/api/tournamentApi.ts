import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Tournament } from "../slices/tournamentSlice"
import type { TournamentDay } from "../slices/daySlice"

export const tournamentApi = createApi({
  reducerPath: "tournamentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Tournament", "TournamentDay"],
  endpoints: (builder) => ({
    // Tournament endpoints
    getTournaments: builder.query<Tournament[], void>({
      query: () => "/tournaments",
      providesTags: ["Tournament"],
    }),
    getTournament: builder.query<Tournament, number>({
      query: (id) => `/tournaments/${id}`,
      providesTags: (result, error, id) => [{ type: "Tournament", id }],
    }),
    createTournament: builder.mutation<Tournament, Partial<Tournament>>({
      query: (tournament) => ({
        url: "/tournaments",
        method: "POST",
        body: tournament,
      }),
      invalidatesTags: ["Tournament"],
    }),
    updateTournament: builder.mutation<Tournament, { id: number; data: Partial<Tournament> }>({
      query: ({ id, data }) => ({
        url: `/tournaments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Tournament", id }],
    }),
    deleteTournament: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tournaments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tournament"],
    }),

    // Tournament Day endpoints
    getTournamentDays: builder.query<TournamentDay[], number>({
      query: (tournamentId) => `/tournaments/${tournamentId}/days`,
      providesTags: (result, error, tournamentId) =>
        result
          ? [...result.map(({ id }) => ({ type: "TournamentDay" as const, id })), { type: "TournamentDay", id: "LIST" }]
          : [{ type: "TournamentDay", id: "LIST" }],
    }),
    getTournamentDay: builder.query<TournamentDay, { tournamentId: number; dayId: number }>({
      query: ({ tournamentId, dayId }) => `/tournaments/${tournamentId}/days/${dayId}`,
      providesTags: (result, error, { dayId }) => [{ type: "TournamentDay", id: dayId }],
    }),
    createTournamentDay: builder.mutation<TournamentDay, { tournamentId: number; data: Partial<TournamentDay> }>({
      query: ({ tournamentId, data }) => ({
        url: `/tournaments/${tournamentId}/days`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "TournamentDay", id: "LIST" }],
    }),
    updateTournamentDay: builder.mutation<
      TournamentDay,
      { tournamentId: number; dayId: number; data: Partial<TournamentDay> }
    >({
      query: ({ tournamentId, dayId, data }) => ({
        url: `/tournaments/${tournamentId}/days/${dayId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { dayId }) => [{ type: "TournamentDay", id: dayId }],
    }),
    deleteTournamentDay: builder.mutation<void, { tournamentId: number; dayId: number }>({
      query: ({ tournamentId, dayId }) => ({
        url: `/tournaments/${tournamentId}/days/${dayId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "TournamentDay", id: "LIST" }],
    }),
  }),
})

export const {
  useGetTournamentsQuery,
  useGetTournamentQuery,
  useCreateTournamentMutation,
  useUpdateTournamentMutation,
  useDeleteTournamentMutation,
  useGetTournamentDaysQuery,
  useGetTournamentDayQuery,
  useCreateTournamentDayMutation,
  useUpdateTournamentDayMutation,
  useDeleteTournamentDayMutation,
} = tournamentApi
