import { cookies } from "next/headers"
import { sql, type User, type UserRole } from "./db"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateSessionId(): string {
  return randomBytes(32).toString("hex")
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt.toISOString()})
  `

  const cookieStore = await cookies()
  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })

  return sessionId
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) {
      return null
    }

    const result = await sql`
      SELECT u.*, s.expires_at
      FROM users u
      JOIN sessions s ON u.id = s.user_id
      WHERE s.id = ${sessionId} AND s.expires_at > NOW() AND u.is_active = true
    `

    if (result.length === 0) {
      return null
    }

    const user = result[0] as User & { expires_at: string }
    return { user }
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (sessionId) {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`
  }

  cookieStore.delete("session")
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
