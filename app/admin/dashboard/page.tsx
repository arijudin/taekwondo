import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { Users, UserCheck, UserX, UserPlus, Settings, Activity, BarChart3 } from "lucide-react"
import { Suspense } from "react"

async function AdminDashboardContent() {
  const session = await getSession()

  if (!session || !["super_admin", "admin"].includes(session.user.role)) {
    redirect("/dashboard")
  }

  // Get admin-relevant statistics
  const adminStats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role != 'super_admin') as manageable_users,
      (SELECT COUNT(*) FROM users WHERE role != 'super_admin' AND is_active = true) as active_users,
      (SELECT COUNT(*) FROM users WHERE role != 'super_admin' AND is_active = false) as inactive_users,
      (SELECT COUNT(*) FROM users WHERE role != 'super_admin' AND created_at::date = CURRENT_DATE) as new_today
  `

  const usersByRole = await sql`
    SELECT 
      role,
      COUNT(*) as count,
      COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
    FROM users 
    WHERE role != 'super_admin'
    GROUP BY role
    ORDER BY role
  `

  const recentUsers = await sql`
    SELECT first_name, last_name, email, role, created_at, is_active
    FROM users 
    WHERE role != 'super_admin'
    ORDER BY created_at DESC 
    LIMIT 8
  `

  const stats = adminStats[0] || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">User management and administrative oversight</p>
      </div>

      {/* Admin Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manageable Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.manageable_users || 0}</div>
            <p className="text-xs text-muted-foreground">Under your oversight</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active_users || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive_users || 0}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Today</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new_today || 0}</div>
            <p className="text-xs text-muted-foreground">Registered today</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools & Role Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
            <CardDescription>User management and administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage All Users
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                User Permissions
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                User Analytics
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Activity Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Role distribution and activity status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersByRole.map((roleData) => (
                <div key={roleData.role} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold capitalize">{roleData.role.replace("_", " ")}</h3>
                    <p className="text-sm text-gray-600">
                      {roleData.active_count} active of {roleData.count} total
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {roleData.count}
                    </Badge>
                    <div className="text-sm text-green-600">
                      {roleData.count > 0 ? Math.round((roleData.active_count / roleData.count) * 100) : 0}% active
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Management */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest user registrations requiring oversight</CardDescription>
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
                  <Badge variant="secondary">{user.role.replace("_", " ")}</Badge>
                  <div className="flex gap-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}
