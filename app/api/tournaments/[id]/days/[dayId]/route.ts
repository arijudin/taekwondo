import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string; dayId: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tournamentId = Number.parseInt(params.id)
    const dayId = Number.parseInt(params.dayId)

    if (isNaN(tournamentId) || isNaN(dayId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        id, tournament_id, day_number, date, name, description,
        start_time, end_time, is_active, created_at, updated_at
      FROM tournament_days 
      WHERE tournament_id = ${tournamentId} AND id = ${dayId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tournament day not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching tournament day:", error)
    return NextResponse.json({ error: "Failed to fetch tournament day" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string; dayId: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tournamentId = Number.parseInt(params.id)
    const dayId = Number.parseInt(params.dayId)

    if (isNaN(tournamentId) || isNaN(dayId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await request.json()
    const { day_number, date, name, description, start_time, end_time, is_active } = body

    // Validation
    if (!day_number || !date || !name || !start_time || !end_time) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if day number already exists for this tournament (excluding current day)
    const existingDay = await sql`
      SELECT id FROM tournament_days 
      WHERE tournament_id = ${tournamentId} AND day_number = ${day_number} AND id != ${dayId}
    `

    if (existingDay.length > 0) {
      return NextResponse.json({ error: "Day number already exists for this tournament" }, { status: 400 })
    }

    // Update tournament day
    const result = await sql`
      UPDATE tournament_days 
      SET 
        day_number = ${day_number},
        date = ${date},
        name = ${name},
        description = ${description || null},
        start_time = ${start_time},
        end_time = ${end_time},
        is_active = ${is_active ?? true},
        updated_at = NOW()
      WHERE tournament_id = ${tournamentId} AND id = ${dayId}
      RETURNING 
        id, tournament_id, day_number, date, name, description,
        start_time, end_time, is_active, created_at, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tournament day not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating tournament day:", error)
    return NextResponse.json({ error: "Failed to update tournament day" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; dayId: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tournamentId = Number.parseInt(params.id)
    const dayId = Number.parseInt(params.dayId)

    if (isNaN(tournamentId) || isNaN(dayId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM tournament_days 
      WHERE tournament_id = ${tournamentId} AND id = ${dayId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tournament day not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tournament day deleted successfully" })
  } catch (error) {
    console.error("Error deleting tournament day:", error)
    return NextResponse.json({ error: "Failed to delete tournament day" }, { status: 500 })
  }
}
