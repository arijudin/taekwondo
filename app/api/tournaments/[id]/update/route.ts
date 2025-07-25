import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tournamentId = Number.parseInt(params.id)
    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const formData = await request.formData()

    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const startDate = formData.get("start_date") as string
    const endDate = formData.get("end_date") as string
    const location = formData.get("location") as string
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
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    // Update tournament in database
    await sql`
      UPDATE tournaments
      SET 
        name = ${name},
        description = ${description || null},
        start_date = ${startDate},
        end_date = ${endDate},
        location = ${location},
        organizer = ${organizer || null},
        chairman = ${chairman || null},
        referee_chief = ${refereeChief || null},
        treasurer = ${treasurer || null},
        admin_tournament = ${adminTournament || null},
        registration_fee = ${registrationFee},
        updated_at = NOW()
      WHERE id = ${tournamentId}
    `

    // Revalidate paths
    revalidatePath("/tournament")
    revalidatePath(`/tournament/${tournamentId}`)
    revalidatePath(`/tournament/${tournamentId}/setup`)

    return NextResponse.redirect(new URL(`/tournament/${tournamentId}`, request.url), 303)
  } catch (error) {
    console.error("Error updating tournament:", error)
    return NextResponse.json({ error: "Failed to update tournament" }, { status: 500 })
  }
}
