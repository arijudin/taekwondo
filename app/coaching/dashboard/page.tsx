import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Users, Calendar, Trophy, Target, Plus, BookOpen, Star } from "lucide-react"
import { Suspense } from "react"

async function CoachingDashboardContent() {
  const session = await getSession()

  if (!session || session.user.role !== "coaching_staff") {
    redirect("/dashboard")
  }

  // Get coaching-related statistics
  const coachingStats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'coaching_staff') as total_coaches,
      (SELECT COUNT(*) FROM users WHERE role = 'coaching_staff' AND is_active = true) as active_coaches,
      (SELECT COUNT(*) FROM sessions s JOIN users u ON s.user_id = u.id WHERE u.role = 'coaching_staff' AND s.expires_at > NOW()) as coaches_online
  `

  const coachingTeam = await sql`
    SELECT first_name, last_name, email, created_at, is_active
    FROM users 
    WHERE role = 'coaching_staff'
    ORDER BY created_at DESC 
    LIMIT 6
  `

  const stats = coachingStats[0] || {}

  // Mock athlete data (in a real app, this would come from an athletes table)
  const mockAthletes = [
    { name: "Alex Johnson", belt: "Black Belt", progress: "Excellent", sessions: 24 },
    { name: "Sarah Kim", belt: "Brown Belt", progress: "Good", sessions: 18 },
    { name: "Mike Chen", belt: "Blue Belt", progress: "Improving", sessions: 12 },
    { name: "Emma Davis", belt: "Green Belt", progress: "Excellent", sessions: 15 },
    { name: "David Wilson", belt: "Yellow Belt", progress: "Good", sessions: 8 },
    { name: "Lisa Park", belt: "Orange Belt", progress: "Improving", sessions: 10 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Coaching Dashboard</h1>
        <p className="text-gray-600 mt-2">Athlete management and coaching tools</p>
      </div>

      {/* Coaching Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Athletes</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockAthletes.length}</div>
            <p className="text-xs text-muted-foreground">Under your guidance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">Training sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coaches</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active_coaches || 0}</div>
            <p className="text-xs text-muted-foreground">In the system</p>
          </CardContent>
        </Card>
      </div>

      {/* Coaching Tools & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Coaching Tools</CardTitle>
            <CardDescription>Essential tools for athlete management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Athlete
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Training
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                Track Progress
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Training Plans
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Set Goals
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your coaching statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Sessions This Week</span>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  12
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Goals Achieved</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  23
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Belt Promotions</span>
                </div>
                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                  5
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Athletes & Coaching Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Athletes</CardTitle>
            <CardDescription>Athletes under your guidance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAthletes.map((athlete, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{athlete.name}</h4>
                    <p className="text-sm text-gray-600">{athlete.belt}</p>
                    <p className="text-xs text-gray-500">{athlete.sessions} sessions completed</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        athlete.progress === "Excellent"
                          ? "bg-green-100 text-green-700"
                          : athlete.progress === "Good"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {athlete.progress}
                    </Badge>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coaching Team</CardTitle>
            <CardDescription>Other coaches in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coachingTeam.slice(0, 6).map((coach, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">
                      {coach.first_name} {coach.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">{coach.email}</p>
                    <p className="text-xs text-gray-500">Joined {new Date(coach.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={coach.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                    >
                      {coach.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CoachingDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CoachingDashboardContent />
    </Suspense>
  )
}
