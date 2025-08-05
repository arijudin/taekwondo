"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
} from "@/lib/auth";

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const role = formData.get("role") as string;

  // Validation
  if (!email || !password || !firstName || !lastName || !role) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  if (!email.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  // Check if we're using stub database
  if (!process.env.DATABASE_URL) {
    return { error: "Database not connected. Please contact administrator." };
  }

  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return { error: "An account with this email address already exists" };
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName}, ${role})
      RETURNING id, email, first_name, last_name, role, is_active
    `;

    const newUser = result[0];

    await createSession(newUser.id);
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      throw error; // Re-throw redirect errors
    }

    return {
      error: `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  // Redirect after successful registration
  redirect("/dashboard");
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (!email.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  // Check if we're using stub database
  if (!process.env.DATABASE_URL) {
    return { error: "Database not connected. Please contact administrator." };
  }

  try {
    const result = await sql`
      SELECT id, password_hash, is_active, first_name, last_name, role, created_at FROM users
      WHERE email = ${email}
    `;

    if (result.length === 0) {
      return { error: "Invalid email or password" };
    }

    const user = result[0];

    if (!user.is_active) {
      return {
        error:
          "Your account has been deactivated. Please contact administrator.",
      };
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    await createSession(user.id);
  } catch (error) {
    // Check if this is a Next.js redirect (which is expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      throw error; // Re-throw redirect errors
    }

    return {
      error: `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  // Redirect after successful login
  redirect("/dashboard");
}

export async function logoutUser() {
  await deleteSession();

  redirect("/login");
}
