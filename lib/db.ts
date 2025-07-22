import { neon } from "@neondatabase/serverless"

/**
 * In the v0 preview sandbox `process.env.DATABASE_URL` is undefined.
 * We provide an in-memory stub so the app can compile and render.
 * When you deploy (or run locally) and the variable is set,
 * the real Neon connection will be used automatically.
 */
function createStub() {
  return async (...args: any[]) => {
    // eslint-disable-next-line no-console
    console.warn("[DB-STUB] No DATABASE_URL – returning empty result for query:", args[0]?.text ?? args[0])
    return []
  }
}

export const sql =
  typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0
    ? neon(process.env.DATABASE_URL)
    : createStub()

export type UserRole = "super_admin" | "admin" | "operator" | "coaching_staff"

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: number
  expires_at: string
  created_at: string
}
