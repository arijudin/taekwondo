"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetTournamentsQuery } from "@/lib/api/tournamentApi"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux"
import { setTournaments, setLoading, setError } from "@/lib/slices/tournamentSlice"
import { Trophy, Users, Calendar, Plus, Award, Target, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TournamentListPage() {
  const dispatch = useAppDispatch()
  const { tournaments, loading, error } = useAppSelector((state) => state.tournament)

  const { data: tournamentsData, isLoading, error: queryError, refetch } = useGetTournamentsQuery()

  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [isLoading, dispatch])

  useEffect(() => {
    if (queryError) {
      dispatch(setError("Failed to load tournaments"))
    } else {
      dispatch(setError(null))
    }
  }, [queryError, dispatch])

  useEffect(() => {
    if (tournamentsData) {
      dispatch(setTournaments(tournamentsData))
    }
  }, [tournamentsData, dispatch])

  // Calculate statistics
  const stats = {
    total_tournaments: tournaments.length,
    ongoing_tournaments: tournaments.filter((t) => t.status === "ongoing").length,
    total_participants: 0, // This would need to be calculated from API
    total_teams: 0, // This would need to be calculated from API
    completed_matches: 0, // This would need to be calculated from API
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tournaments...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
        <p className="text-gray-600 mt-2">Manage all your Taekwondo tournaments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tournaments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ongoing_tournaments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total_participants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.total_teams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.completed_matches}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Tournament Button */}
      <div className="mb-8">
        <Button asChild size="lg">
          <Link href="/tournament/create">
            <Plus className="mr-2 h-5 w-5" />
            Create New Tournament
          </Link>
        </Button>
      </div>

      {/* Tournament List */}
      <h2 className="text-2xl font-bold mb-4">Your Tournaments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <Card key={tournament.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <Badge
                    variant={
                      tournament.status === "ongoing"
                        ? "default"
                        : tournament.status === "completed"
                          ? "secondary"
                          : tournament.status === "registration"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {tournament.status}
                  </Badge>
                </div>
                <CardDescription>{tournament.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {tournament.description || "No description provided"}
                </p>
                <div className="text-xs text-gray-500">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                  {new Date(tournament.end_date).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t pt-3 pb-3">
                <Button asChild variant="default" className="w-full">
                  <Link href={`/tournament/${tournament.id}`}>
                    Manage Tournament
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 border rounded-lg bg-gray-50">
            <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tournaments yet</h3>
            <p className="text-gray-500 mb-4">Create your first tournament to get started</p>
            <Button asChild>
              <Link href="/tournament/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
