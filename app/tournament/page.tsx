import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Trophy, Users, Calendar, Plus, FileText, Award, Target } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

async function TournamentDashboardContent() {
  const session = await requireAuth()

  // Get tournament statistics
  const tournamentStats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM tournaments) as total_tournaments,
      (SELECT COUNT(*) FROM tournaments WHERE status = 'ongoing') as ongoing_tournaments,
      (SELECT COUNT(*) FROM participants) as total_participants,
      (SELECT COUNT(*) FROM teams) as total_teams,
      (SELECT COUNT(*) FROM matches WHERE status = 'completed') as completed_matches
  `

  const recentTournaments = await sql`
    SELECT id, name, start_date, end_date, status, location
    FROM tournaments 
    ORDER BY created_at DESC 
    LIMIT 5
  `

  const stats = tournamentStats[0] || {}

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tournament Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive Taekwondo tournament management</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tournaments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ongoing_tournaments || 0}</div>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Matches</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.completed_matches || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tournaments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tournaments</CardTitle>
          <CardDescription>Latest tournament activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTournaments.length > 0 ? (
              recentTournaments.map((tournament, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{tournament.name}</h4>
                    <p className="text-sm text-gray-600">{tournament.location}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tournament.start_date).toLocaleDateString()} -{" "}
                      {new Date(tournament.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
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
                    <div className="mt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/tournament/${tournament.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No tournaments found</p>
                <Button asChild className="mt-4">
                  <Link href="/tournament/setup">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Tournament
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/tournament/setup">
            <Plus className="mr-2 h-4 w-4" />
            Create New Tournament
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tournament/reports">
            <FileText className="mr-2 h-4 w-4" />
            View Reports
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function TournamentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TournamentDashboardContent />
    </Suspense>
  )
}
