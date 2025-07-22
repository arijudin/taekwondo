import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { Shield, Users, Settings, Activity } from "lucide-react"
import { Suspense } from "react"

async function DashboardContent() {
  const session = await requireAuth()
  const { user } = session

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(user.created_at).toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground mt-2">Account creation date</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Actions available based on your role permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
