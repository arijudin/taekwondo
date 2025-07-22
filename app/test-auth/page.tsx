"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function TestAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
          <CardDescription>Test different authentication scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              This page helps you test the authentication system with different scenarios.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Test Login Scenarios</h3>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Invalid Credentials</h4>
                <p className="text-sm text-gray-600 mb-3">Try logging in with: test@example.com / wrongpassword</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/login">Test Login</Link>
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Valid Test Account</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use: admin@example.com / admin123 (if database is connected)
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/login">Test Login</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Test Registration Scenarios</h3>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Weak Password</h4>
                <p className="text-sm text-gray-600 mb-3">Try registering with a password less than 6 characters</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/register">Test Registration</Link>
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Invalid Email</h4>
                <p className="text-sm text-gray-600 mb-3">Try registering with an invalid email format</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/register">Test Registration</Link>
                </Button>
              </div>
            </div>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Database Status:</strong>{" "}
              {process.env.DATABASE_URL ? "Connected" : "Using stub (errors expected)"}
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
