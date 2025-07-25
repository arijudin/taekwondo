import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Trophy, Users, Calendar, Settings, Award, Target, Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

async function TournamentDashboardContent({ params }: { params: { id: string } }) {
  const session = await requireAuth()
  const tournamentId = Number.parseInt(params.id)

  if (isNaN(tournamentId)) {
    notFound()
  }

  // Get tournament details
  const tournamentResult = await sql`
    SELECT 
      id, name, description, start_date, end_date, location, status,
      organizer, chairman, referee_chief, treasurer, admin_tournament, registration_fee,
      created_at, updated_at
    FROM tournaments 
    WHERE id = ${tournamentId}
  `

  if (tournamentResult.length === 0) {
    notFound()
  }

  const tournament = tournamentResult[0]

  // Get tournament statistics
  const statsResult = await sql`
    SELECT 
      (SELECT COUNT(*) FROM participants WHERE tournament_id = ${tournamentId}) as total_participants,
      (SELECT COUNT(*) FROM teams WHERE tournament_id = ${tournamentId}) as total_teams,
      (SELECT COUNT(*) FROM tournament_classes WHERE tournament_id = ${tournamentId}) as total_classes,
      (SELECT COUNT(*) FROM matches WHERE tournament_id = ${tournamentId}) as total_matches,
      (SELECT COUNT(*) FROM matches WHERE tournament_id = ${tournamentId} AND status = 'completed') as completed_matches
  `

  const stats = statsResult[0] || {}

  // Format dates
  const startDate = new Date(tournament.start_date).toLocaleDateString()
  const endDate = new Date(tournament.end_date).toLocaleDateString()
  const createdAt = new Date(tournament.created_at).toLocaleDateString()
  const updatedAt = new Date(tournament.updated_at).toLocaleDateString()

  // Calculate days until tournament
  const daysUntil = Math.ceil((new Date(tournament.start_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  const tournamentStatus =
    daysUntil > 0
      ? `Starts in ${daysUntil} days`
      : new Date() <= new Date(tournament.end_date)
        ? "Currently ongoing"
        : "Completed"

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
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
          <p className="text-gray-600 mt-2">
            {tournament.location} • {startDate} to {endDate}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/tournament/${tournamentId}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total_participants || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.total_teams || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <Trophy className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.total_classes || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.total_matches || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed_matches || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tournament Details */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament Details</CardTitle>
            <CardDescription>Basic information about this tournament</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tournament.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{tournament.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                <p className="mt-1">{startDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                <p className="mt-1">{endDate}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1">{tournament.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">{tournamentStatus}</p>
            </div>

            {tournament.registration_fee && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Registration Fee</h3>
                <p className="mt-1">IDR {tournament.registration_fee.toLocaleString()}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>Created: {createdAt}</div>
              <div>Updated: {updatedAt}</div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Officials */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament Officials</CardTitle>
            <CardDescription>Key personnel for this tournament</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tournament.organizer ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Organizer</h3>
                <p className="mt-1">{tournament.organizer}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span>No organizer specified</span>
              </div>
            )}

            {tournament.chairman && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Chairman</h3>
                <p className="mt-1">{tournament.chairman}</p>
              </div>
            )}

            {tournament.referee_chief && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Chief Referee</h3>
                <p className="mt-1">{tournament.referee_chief}</p>
              </div>
            )}

            {tournament.treasurer && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Treasurer</h3>
                <p className="mt-1">{tournament.treasurer}</p>
              </div>
            )}

            {tournament.admin_tournament && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tournament Admin</h3>
                <p className="mt-1">{tournament.admin_tournament}</p>
              </div>
            )}

            {!tournament.chairman &&
              !tournament.referee_chief &&
              !tournament.treasurer &&
              !tournament.admin_tournament && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>No officials specified</span>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button asChild>
          <Link href={`/tournament/${tournamentId}/setup`}>
            <Settings className="mr-2 h-4 w-4" />
            Tournament Setup
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/tournament/${tournamentId}/participants/all`}>
            <Users className="mr-2 h-4 w-4" />
            Manage Participants
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/tournament/${tournamentId}/tournament-classes`}>
            <Trophy className="mr-2 h-4 w-4" />
            Manage Classes
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function TournamentDashboardPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TournamentDashboardContent params={params} />
    </Suspense>
  )
}
