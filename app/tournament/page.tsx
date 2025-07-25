import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Trophy, Users, Calendar, MapPin, Plus, Settings, FileText, Award, Target } from "lucide-react"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tournament Management System</h1>
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

      {/* Main Menu Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tournament Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Kejuaraan (Tournament)
            </CardTitle>
            <CardDescription>Tournament setup and management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Kelengkapan
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/organizer">
                  <Users className="h-4 w-4 mr-2" />
                  Penyelenggara
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/officials">
                  <Award className="h-4 w-4 mr-2" />
                  Wasit
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/finance">
                  <FileText className="h-4 w-4 mr-2" />
                  Biaya
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  Acara
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/queue">
                  <Target className="h-4 w-4 mr-2" />
                  Antrian
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Recap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Data Rekap Kejuaraan
            </CardTitle>
            <CardDescription>Tournament data and reporting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/teams">
                  <Users className="h-4 w-4 mr-2" />
                  Teams
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/participants">
                  <Target className="h-4 w-4 mr-2" />
                  Peserta
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/managers">
                  <Users className="h-4 w-4 mr-2" />
                  Manager
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/reports">
                  <FileText className="h-4 w-4 mr-2" />
                  Rekap
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BPJS Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              BPJS Categories
            </CardTitle>
            <CardDescription>Participant categories management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/bpjs/individual">
                  <Target className="h-4 w-4 mr-2" />
                  Individu
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/bpjs/pair">
                  <Users className="h-4 w-4 mr-2" />
                  Pair
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/bpjs/team">
                  <Trophy className="h-4 w-4 mr-2" />
                  Beregu
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/bpjs/freestyle">
                  <Award className="h-4 w-4 mr-2" />
                  Freestyle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Kelas Kejuaraan
            </CardTitle>
            <CardDescription>Tournament class management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/classes">
                  <Trophy className="h-4 w-4 mr-2" />
                  Rekap Kelas
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/classes/pair">
                  <Users className="h-4 w-4 mr-2" />
                  Kelas Pair
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/classes/team">
                  <Target className="h-4 w-4 mr-2" />
                  Kelas Beregu
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/classes/freestyle">
                  <Award className="h-4 w-4 mr-2" />
                  Freestyle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Menu Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cocard (ID Cards) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cocard (ID Cards)
            </CardTitle>
            <CardDescription>ID card generation and management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/cocard/official">
                  <Award className="h-4 w-4 mr-2" />
                  Official
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/cocard/manager">
                  <Users className="h-4 w-4 mr-2" />
                  Manager
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/cocard/coach">
                  <Target className="h-4 w-4 mr-2" />
                  Coach
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/cocard/athlete">
                  <Trophy className="h-4 w-4 mr-2" />
                  Atlet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brackets and Drawing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Bagan dan Drawing
            </CardTitle>
            <CardDescription>Tournament brackets and match drawing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/brackets/schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  Hari
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/brackets/courts">
                  <MapPin className="h-4 w-4 mr-2" />
                  Lapangan
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/brackets/manage">
                  <Settings className="h-4 w-4 mr-2" />
                  Kelola Bagan
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/brackets/athletes">
                  <Users className="h-4 w-4 mr-2" />
                  Atlet Bahan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Hasil Kejuaraan
            </CardTitle>
            <CardDescription>Tournament results and awards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/results/certificates">
                  <FileText className="h-4 w-4 mr-2" />
                  Piagam
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/results/matches">
                  <Trophy className="h-4 w-4 mr-2" />
                  Hasil Pertandingan
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/results/champions">
                  <Award className="h-4 w-4 mr-2" />
                  Daftar Juara
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/results/team-results">
                  <Users className="h-4 w-4 mr-2" />
                  Hasil Tim
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Operator Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Operator
            </CardTitle>
            <CardDescription>Operator and system management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/operators">
                  <Users className="h-4 w-4 mr-2" />
                  Manajemen
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/operators/champions">
                  <Trophy className="h-4 w-4 mr-2" />
                  Juara Partai
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/operators/manual">
                  <Settings className="h-4 w-4 mr-2" />
                  Manual
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/tournament/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </Link>
              </Button>
            </div>
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
            {recentTournaments.map((tournament, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/tournament/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New Tournament
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tournament/reports">
            <FileText className="h-4 w-4 mr-2" />
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
