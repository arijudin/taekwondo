import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { Shield, Database, Settings, Activity } from "lucide-react";

export default async function SuperAdminPage() {
  const session = await getSession();

  if (!session || session.user.role !== "super_admin") {
    redirect("/dashboard");
  }

  // Get system statistics
  const systemStats = await sql`
    SELECT
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM sessions WHERE expires_at > NOW()) as active_sessions,
      (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
      (SELECT COUNT(*) FROM users WHERE role = 'super_admin') as super_admins
  `;

  const recentUsers = await sql`
    SELECT first_name, last_name, email, role, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const stats = systemStats[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          System-wide administration and management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Database className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Activity className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active_sessions}
            </div>
            <p className="text-xs text-muted-foreground">Currently logged in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">
              New Users (7d)
            </CardTitle>
            <Settings className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.new_users_week}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.super_admins}
            </div>
            <p className="text-xs text-muted-foreground">
              System administrators
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">
                      {user.first_name} {user.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {user.role.replace("_", " ")}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
            <CardDescription>Super admin exclusive functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h3 className="font-semibold text-red-800">User Management</h3>
                <p className="text-sm text-red-600 mt-1">
                  Create, modify, and deactivate user accounts
                </p>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="font-semibold text-blue-800">System Settings</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Configure system-wide settings and preferences
                </p>
              </div>

              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-semibold text-green-800">
                  Database Management
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  Backup, restore, and maintain database integrity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
