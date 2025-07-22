import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hashPassword, verifyPassword } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default async function TestBcryptPage() {
  const testPassword = "admin123"
  let hashResult = ""
  let verifyResult = false
  let error = ""

  try {
    // Test hashing
    hashResult = await hashPassword(testPassword)

    // Test verification
    verifyResult = await verifyPassword(testPassword, hashResult)
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error"
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Bcrypt Test</CardTitle>
          <CardDescription>Testing password hashing and verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Test Password:</h3>
            <code className="bg-gray-100 px-2 py-1 rounded">{testPassword}</code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Generated Hash:</h3>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">{hashResult}</code>
          </div>

          <Alert variant={verifyResult ? "default" : "destructive"}>
            {verifyResult ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>
              <strong>Verification Result:</strong> {verifyResult ? "SUCCESS" : "FAILED"}
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-gray-600">
            <p>
              <strong>Hash Length:</strong> {hashResult.length}
            </p>
            <p>
              <strong>Starts with:</strong> {hashResult.substring(0, 10)}
            </p>
            <p>
              <strong>bcrypt version:</strong> {hashResult.substring(0, 4)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
