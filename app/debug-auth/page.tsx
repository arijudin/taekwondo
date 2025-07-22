import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { sql } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth"
import Link from "next/link"
import { Database, Key, Users, AlertCircle } from "lucide-react"

export default async function DebugAuthPage() {
  let dbStatus = "Unknown"
  let userCount = 0
  let testUsers: any[] = []
  let passwordTest = "Not tested"

  try {
    if (process.env.DATABASE_URL) {
      dbStatus = "Connected"

      // Test database connection
      const countResult = await sql`SELECT COUNT(*) as count FROM users`
      userCount = Number.parseInt(countResult[0].count)

      // Get test users
      testUsers = await sql`
        SELECT email, first_name, last_name, role, is_active, created_at 
        FROM users 
        WHERE email IN ('admin@example.com', 'superadmin@example.com', 'operator@example.com', 'coach@example.com')
        ORDER BY email
      `

      // Test password hashing
      const testPassword = "admin123"
      const hash = await hashPassword(testPassword)
      const isValid = await verifyPassword(testPassword, hash)
      passwordTest = isValid ? "Working" : "Failed"
    } else {
      dbStatus = "Not connected (DATABASE_URL missing)"
    }
  } catch (error) {
    dbStatus = `Error: ${error instanceof Error ? error.message : "Unknown error"}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Authentication Debug Information
          </CardTitle>
          <CardDescription>System status and troubleshooting information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Database Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-lg font-semibold ${dbStatus === "Connected" ? "text-green-600" : "text-red-600"}`}
                >
                  {dbStatus}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{userCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Password System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-lg font-semibold ${passwordTest === "Working" ? "text-green-600" : "text-red-600"}`}
                >
                  {passwordTest}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Users */}
          {testUsers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Test Users (Password: admin123)</h3>
              <div className="grid gap-3">
                {testUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{user.email}</div>
                      <div className="text-sm text-gray-600">
                        {user.first_name} {user.last_name} - {user.role.replace("_", " ")}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Environment Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Environment:</strong> {process.env.NODE_ENV || "development"}
              <br />
              <strong>Database URL:</strong> {process.env.DATABASE_URL ? "Set" : "Not set"}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/login">Test Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Test Registration</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
