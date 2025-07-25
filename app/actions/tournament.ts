"use server"

import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createTournament(prevState: any, formData: FormData) {
  try {
    const session = await requireAuth()

    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const startDate = formData.get("start_date") as string
    const endDate = formData.get("end_date") as string
    const location = formData.get("location") as string
    const status = formData.get("status") as string
    const organizer = formData.get("organizer") as string
    const chairman = formData.get("chairman") as string
    const refereeChief = formData.get("referee_chief") as string
    const treasurer = formData.get("treasurer") as string
    const adminTournament = formData.get("admin_tournament") as string
    const registrationFee = formData.get("registration_fee")
      ? Number.parseFloat(formData.get("registration_fee") as string)
      : null

    // Validation
    if (!name || !startDate || !endDate || !location) {
      return { error: "Required fields are missing" }
    }

    // Check if end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
      return { error: "End date must be after start date" }
    }

    // Insert tournament into database
    const result = await sql`
      INSERT INTO tournaments (
        name, 
        description, 
        start_date, 
        end_date, 
        location, 
        status,
        organizer,
        chairman,
        referee_chief,
        treasurer,
        admin_tournament,
        registration_fee
      ) 
      VALUES (
        ${name}, 
        ${description || null}, 
        ${startDate}, 
        ${endDate}, 
        ${location}, 
        ${status || "planning"},
        ${organizer || null},
        ${chairman || null},
        ${refereeChief || null},
        ${treasurer || null},
        ${adminTournament || null},
        ${registrationFee}
      )
      RETURNING id
    `

    const tournamentId = result[0].id

    // Revalidate the tournaments list page
    revalidatePath("/tournament")

    return {
      success: true,
      tournamentId,
    }
  } catch (error) {
    console.error("Error creating tournament:", error)
    return {
      error: "Failed to create tournament. Please try again.",
    }
  }
}

export async function updateTournament(tournamentId: number, data: any) {
  try {
    await requireAuth()

    // Build the SET clause dynamically based on provided data
    const updates = []
    const values = []
    let index = 1

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        updates.push(`${key} = $${index}`)
        values.push(value)
        index++
      }
    }

    if (updates.length === 0) {
      return { error: "No data to update" }
    }

    // Add the tournament ID as the last parameter
    values.push(tournamentId)

    // Execute the update query
    await sql`
      UPDATE tournaments 
      SET ${sql.raw(updates.join(", "))}
      WHERE id = ${tournamentId}
    `

    // Revalidate the tournament pages
    revalidatePath("/tournament")
    revalidatePath(`/tournament/${tournamentId}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating tournament:", error)
    return {
      error: "Failed to update tournament. Please try again.",
    }
  }
}

export async function deleteTournament(tournamentId: number) {
  try {
    await requireAuth()

    // Delete the tournament
    await sql`DELETE FROM tournaments WHERE id = ${tournamentId}`

    // Revalidate the tournaments list page
    revalidatePath("/tournament")

    return { success: true }
  } catch (error) {
    console.error("Error deleting tournament:", error)
    return {
      error: "Failed to delete tournament. Please try again.",
    }
  }
}
