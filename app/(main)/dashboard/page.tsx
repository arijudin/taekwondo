import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Shield, Users, Settings, Activity, Trophy } from "lucide-react"
import { Suspense } from "react"
import Link from "next/link"

async function DashboardContent() {
  const session = await requireAuth()
  const { user } = session

  // Get tournament statistics
  const tournamentStats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM tournaments) as total_tournaments,
      (SELECT COUNT(*) FROM tournaments WHERE status = 'ongoing') as ongoing_tournaments,
      (SELECT COUNT(*) FROM participants) as total_participants
  `

  const stats = tournamentStats[0] || {}

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Full system access and user management"
      case "admin":
        return "Administrative access and user oversight"
      case "operator":
        return "Operational tasks and data management"
      case "coaching_staff":
        return "Coaching tools and athlete management"
      default:
        return "Standard user access"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Shield className="h-8 w-8 text-red-500" />
      case "admin":
        return <Users className="h-8 w-8 text-blue-500" />
      case "operator":
        return <Settings className="h-8 w-8 text-green-500" />
      case "coaching_staff":
        return <Activity className="h-8 w-8 text-purple-500" />
      default:
        return <Users className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user.first_name} {user.last_name}
        </h1>
        <p className="text-gray-600 mt-2">You are logged in as {user.role.replace("_", " ")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            {getRoleIcon(user.role)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user.role.replace("_", " ")}</div>
            <p className="text-xs text-muted-foreground mt-2">{getRoleDescription(user.role)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground mt-2">Your account is active and verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.total_tournaments || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Total tournaments in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total_participants || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">Total participants across all tournaments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tournament System</CardTitle>
            <CardDescription>Comprehensive Taekwondo tournament management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg border-amber-200 bg-amber-50">
                <h3 className="font-semibold text-amber-600">Tournament Management</h3>
                <p className="text-sm text-gray-600 mt-1">Create and manage multiple tournaments</p>
                <div className="mt-3 space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/tournament">
                      <Trophy className="mr-2 h-4 w-4" />
                      View All Tournaments
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/tournament/create">Create New Tournament</Link>
                  </Button>
                </div>
              </div>

              {stats.ongoing_tournaments > 0 && (
                <div className="p-4 border rounded-lg border-green-200 bg-green-50">
                  <h3 className="font-semibold text-green-600">Ongoing Tournaments</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.ongoing_tournaments} tournament(s) currently active
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Actions available based on your role permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {user.role === "super_admin" && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-red-600">Super Admin Access</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage all users, system settings, and configurations</p>
                </div>
              )}

              {(user.role === "super_admin" || user.role === "admin") && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-blue-600">Admin Access</h3>
                  <p className="text-sm text-gray-600 mt-1">User management and administrative functions</p>
                </div>
              )}

              {user.role === "operator" && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-green-600">Operator Access</h3>
                  <p className="text-sm text-gray-600 mt-1">Operational tasks and data management</p>
                </div>
              )}

              {user.role === "coaching_staff" && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-purple-600">Coaching Access</h3>
                  <p className="text-sm text-gray-600 mt-1">Athlete management and coaching tools</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
