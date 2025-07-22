import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireRole } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Shield, Database, Settings, Activity, Users, UserPlus, AlertTriangle, TrendingUp } from "lucide-react"
import { Suspense } from "react"

async function SuperAdminDashboardContent() {
  const session = await requireRole("super_admin")

  // Get system statistics
  const systemStats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM sessions WHERE expires_at > NOW()) as active_sessions,
      (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
      (SELECT COUNT(*) FROM users WHERE role = 'super_admin') as super_admins,
      (SELECT COUNT(*) FROM users WHERE role = 'admin') as admins,
      (SELECT COUNT(*) FROM users WHERE role = 'operator') as operators,
      (SELECT COUNT(*) FROM users WHERE role = 'coaching_staff') as coaches,
      (SELECT COUNT(*) FROM users WHERE is_active = false) as inactive_users
  `

  const recentUsers = await sql`
    SELECT first_name, last_name, email, role, created_at, is_active
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 6
  `

  const stats = systemStats[0] || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Complete system oversight and management</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (7d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new_users_week || 0}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Optimal</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution & System Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>User breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Super Admins</span>
                </div>
                <Badge variant="destructive">{stats.super_admins || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Admins</span>
                </div>
                <Badge variant="secondary">{stats.admins || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Operators</span>
                </div>
                <Badge variant="outline">{stats.operators || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Coaching Staff</span>
                </div>
                <Badge variant="outline">{stats.coaches || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
            <CardDescription>Super admin exclusive functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Create New User
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Database Management
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Security Audit
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                System Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
          <CardDescription>Latest user registrations and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">
                    {user.first_name} {user.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right space-y-2">
                  <Badge variant={user.is_active ? "default" : "destructive"}>{user.role.replace("_", " ")}</Badge>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuperAdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuperAdminDashboardContent />
    </Suspense>
  )
}
