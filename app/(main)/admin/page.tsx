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
import { Users, UserCheck, UserX, Shield } from "lucide-react";

export default async function AdminPage() {
  const session = await getSession();

  if (!session || !["super_admin", "admin"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  // Get user statistics
  const userStats = await sql`
    SELECT
      role,
      COUNT(*) as count,
      COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
    FROM users
    GROUP BY role
    ORDER BY role
  `;

  const totalUsers = await sql`SELECT COUNT(*) as total FROM users`;
  const activeUsers =
    await sql`SELECT COUNT(*) as active FROM users WHERE is_active = true`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage users and system administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers[0].total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeUsers[0].active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
            <UserX className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {Number.parseInt(totalUsers[0].total) -
                Number.parseInt(activeUsers[0].active)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 space-x-2 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userStats
                .filter((stat) => ["super_admin", "admin"].includes(stat.role))
                .reduce((sum, stat) => sum + Number.parseInt(stat.count), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
          <CardDescription>
            Breakdown of users by their assigned roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStats.map((stat) => (
              <div
                key={stat.role}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold capitalize">
                    {stat.role.replace("_", " ")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stat.active_count} active out of {stat.count} total
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <div className="text-sm text-green-600">
                    {Math.round((stat.active_count / stat.count) * 100)}% active
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
