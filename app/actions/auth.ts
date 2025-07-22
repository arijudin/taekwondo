"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth"

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const role = formData.get("role") as string

  console.log("=== REGISTRATION DEBUG ===")
  console.log("Email:", email)
  console.log("Password length:", password?.length)
  console.log("First name:", firstName)
  console.log("Last name:", lastName)
  console.log("Role:", role)

  // Validation
  if (!email || !password || !firstName || !lastName || !role) {
    console.log("❌ Validation failed: Missing fields")
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    console.log("❌ Validation failed: Password too short")
    return { error: "Password must be at least 6 characters long" }
  }

  if (!email.includes("@")) {
    console.log("❌ Validation failed: Invalid email")
    return { error: "Please enter a valid email address" }
  }

  // Check if we're using stub database
  if (!process.env.DATABASE_URL) {
    console.log("❌ No DATABASE_URL found")
    return { error: "Database not connected. Please contact administrator." }
  }

  try {
    console.log("🔍 Checking if user exists...")
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("❌ User already exists")
      return { error: "An account with this email address already exists" }
    }

    console.log("🔐 Hashing password...")
    // Hash password and create user
    const passwordHash = await hashPassword(password)
    console.log("✅ Password hashed successfully, length:", passwordHash.length)

    console.log("💾 Creating user in database...")
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName}, ${role})
      RETURNING id, email, first_name, last_name, role, is_active
    `

    const newUser = result[0]
    console.log("✅ User created:", {
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.first_name} ${newUser.last_name}`,
      role: newUser.role,
      is_active: newUser.is_active,
    })

    console.log("🎫 Creating session...")
    await createSession(newUser.id)
    console.log("✅ Session created successfully")

    console.log("🚀 Registration complete, redirecting...")
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      console.log("✅ Redirect successful")
      throw error // Re-throw redirect errors
    }

    console.error("❌ Registration error:", error)
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })
    return { error: `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}` }
  }

  // Redirect after successful registration
  redirect("/dashboard")
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("=== LOGIN DEBUG ===")
  console.log("Email:", email)
  console.log("Password length:", password?.length)

  if (!email || !password) {
    console.log("❌ Missing email or password")
    return { error: "Email and password are required" }
  }

  if (!email.includes("@")) {
    console.log("❌ Invalid email format")
    return { error: "Please enter a valid email address" }
  }

  // Check if we're using stub database
  if (!process.env.DATABASE_URL) {
    console.log("❌ No DATABASE_URL found")
    return { error: "Database not connected. Please contact administrator." }
  }

  try {
    console.log("🔍 Looking up user in database...")
    const result = await sql`
      SELECT id, password_hash, is_active, first_name, last_name, role, created_at FROM users 
      WHERE email = ${email}
    `

    console.log("Database query completed, results:", result.length)

    if (result.length === 0) {
      console.log("❌ User not found")
      return { error: "Invalid email or password" }
    }

    const user = result[0]
    console.log("✅ User found:", {
      id: user.id,
      email: email,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      password_hash_length: user.password_hash?.length,
      password_hash_starts_with: user.password_hash?.substring(0, 10),
    })

    if (!user.is_active) {
      console.log("❌ User account is inactive")
      return { error: "Your account has been deactivated. Please contact administrator." }
    }

    console.log("🔐 Verifying password...")
    const isValidPassword = await verifyPassword(password, user.password_hash)
    console.log("Password verification result:", isValidPassword)

    if (!isValidPassword) {
      console.log("❌ Password verification failed")
      return { error: "Invalid email or password" }
    }

    console.log("✅ Password verified successfully")
    console.log("🎫 Creating session...")
    await createSession(user.id)
    console.log("✅ Session created, login successful")
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      console.log("✅ Redirect successful")
      throw error // Re-throw redirect errors
    }

    console.error("❌ Login error:", error)
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    })
    return { error: `Login failed: ${error instanceof Error ? error.message : "Unknown error"}` }
  }

  // Redirect after successful login
  redirect("/dashboard")
}

export async function logoutUser() {
  console.log("🚪 Logging out user...")
  await deleteSession()
  console.log("✅ Logout complete")
  redirect("/login")
}
