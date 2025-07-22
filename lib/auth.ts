import { cookies } from "next/headers"
import { sql, type User, type UserRole } from "./db"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { redirect } from "next/navigation"

export async function hashPassword(password: string): Promise<string> {
  console.log("🔐 Hashing password with bcrypt...")
  const hash = await bcrypt.hash(password, 10)
  console.log("✅ Password hashed, result length:", hash.length)
  console.log("Hash starts with:", hash.substring(0, 10))
  return hash
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  console.log("🔍 Verifying password...")
  console.log("Input password:", password)
  console.log("Hash to verify against:", hash)
  console.log("Hash length:", hash?.length)

  if (!hash) {
    console.log("❌ No hash provided")
    return false
  }

  try {
    const result = await bcrypt.compare(password, hash)
    console.log("✅ bcrypt.compare result:", result)
    return result
  } catch (error) {
    console.error("❌ Error during password verification:", error)
    return false
  }
}

export function generateSessionId(): string {
  return randomBytes(32).toString("hex")
}

export async function createSession(userId: number): Promise<string> {
  console.log("🎫 Creating session for user ID:", userId)
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  console.log("Session ID:", sessionId)
  console.log("Expires at:", expiresAt)

  try {
    await sql`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()})
    `
    console.log("✅ Session inserted into database")

    const cookieStore = await cookies()
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    })
    console.log("✅ Session cookie set")

    return sessionId
  } catch (error) {
    console.error("❌ Error creating session:", error)
    throw error
  }
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) {
      console.log("🔍 No session cookie found")
      return null
    }

    console.log("🔍 Looking up session:", sessionId)

    const result = await sql`
      SELECT u.*, s.expires_at
      FROM users u
      JOIN sessions s ON u.id = s.user_id
      WHERE s.id = ${sessionId} AND s.expires_at > NOW() AND u.is_active = true
    `

    if (result.length === 0) {
      console.log("❌ No valid session found")
      return null
    }

    const user = result[0] as User & { expires_at: string }
    console.log("✅ Session found for user:", user.email)
    return { user }
  } catch (error) {
    console.error("❌ Session error:", error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (sessionId) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`
    console.log("✅ Session deleted from database")
  }

  cookieStore.delete("session")
  console.log("✅ Session cookie deleted")
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    super_admin: 4,
    admin: 3,
    operator: 2,
    coaching_staff: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  return session
}

export async function requireRole(requiredRole: UserRole) {
  const session = await requireAuth()
  if (!hasPermission(session.user.role, requiredRole)) {
    redirect("/unauthorized")
  }
  return session
}
