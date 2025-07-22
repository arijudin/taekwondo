import { Button } from "@/components/ui/button"
import { logoutUser } from "@/app/actions/auth"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import { User, LogOut, Shield, Users } from "lucide-react"
import { Suspense } from "react"

async function NavigationContent() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const { user } = session

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Multi-Auth System
            </Link>

            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>

              {(user.role === "super_admin" || user.role === "admin") && (
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                >
                  <Users className="h-4 w-4" />
                  Admin
                </Link>
              )}

              {user.role === "super_admin" && (
                <Link
                  href="/super-admin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Super Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {user.role.replace("_", " ")}
              </span>
            </div>

            <form action={logoutUser}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function Navigation() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b" />}>
      <NavigationContent />
    </Suspense>
  )
}
