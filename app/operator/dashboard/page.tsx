import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import {
  Settings,
  Activity,
  Database,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react"
import { Suspense } from "react"

async function OperatorDashboardContent() {
  const session = await getSession()

  if (!session || session.user.role !== "operator") {
    redirect("/dashboard")
  }

  // Get operational statistics
  const operationalStats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
      (SELECT COUNT(*) FROM sessions WHERE expires_at > NOW()) as active_sessions,
      (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24 hours') as new_users_today,
      (SELECT COUNT(*) FROM users WHERE role = 'coaching_staff') as coaching_staff_count
  `

  const systemActivity = await sql`
    SELECT 
      u.first_name, 
      u.last_name, 
      u.role, 
      u.created_at,
      'user_registered' as activity_type
    FROM users u
    WHERE u.created_at > NOW() - INTERVAL '7 days'
    ORDER BY u.created_at DESC
    LIMIT 6
  `

  const stats = operationalStats[0] || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Operator Dashboard</h1>
        <p className="text-gray-600 mt-2">System operations and data management</p>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active_users || 0}</div>
            <p className="text-xs text-muted-foreground">System wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.new_users_today || 0}</div>
            <p className="text-xs text-muted-foreground">Registered today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coaching Staff</CardTitle>
            <Settings className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.coaching_staff_count || 0}</div>
            <p className="text-xs text-muted-foreground">Total coaches</p>
          </CardContent>
        </Card>
      </div>

      {/* Operational Tools & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Operational Tools</CardTitle>
            <CardDescription>Data management and system operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Database Operations
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Data Export
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics Dashboard
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                System Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Database</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Authentication</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">User Sessions</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Backup System</span>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  Scheduled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent System Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest system events and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">New {activity.role.replace("_", " ")} registered</h4>
                    <p className="text-sm text-gray-600">
                      {activity.first_name} {activity.last_name} joined the system
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{activity.role.replace("_", " ")}</Badge>
                  <p className="text-sm text-gray-500 mt-1">{new Date(activity.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">{new Date(activity.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OperatorDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OperatorDashboardContent />
    </Suspense>
  )
}
