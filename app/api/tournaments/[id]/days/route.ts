import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tournamentId = Number.parseInt(params.id)
    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const days = await sql`
      SELECT 
        id, tournament_id, day_number, date, name, description,
        start_time, end_time, is_active, created_at, updated_at
      FROM tournament_days 
      WHERE tournament_id = ${tournamentId}
      ORDER BY day_number ASC
    `

    return NextResponse.json(days)
  } catch (error) {
    console.error("Error fetching tournament days:", error)
    return NextResponse.json({ error: "Failed to fetch tournament days" }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { day_number, date, name, description, start_time, end_time, is_active } = body

    // Validation
    if (!day_number || !date || !name || !start_time || !end_time) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if day number already exists for this tournament
    const existingDay = await sql`
      SELECT id FROM tournament_days 
      WHERE tournament_id = ${tournamentId} AND day_number = ${day_number}
    `

    if (existingDay.length > 0) {
      return NextResponse.json({ error: "Day number already exists for this tournament" }, { status: 400 })
    }

    // Insert new tournament day
    const result = await sql`
      INSERT INTO tournament_days (
        tournament_id, day_number, date, name, description, 
        start_time, end_time, is_active
      ) 
      VALUES (
        ${tournamentId}, ${day_number}, ${date}, ${name}, ${description || null},
        ${start_time}, ${end_time}, ${is_active ?? true}
      )
      RETURNING 
        id, tournament_id, day_number, date, name, description,
        start_time, end_time, is_active, created_at, updated_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating tournament day:", error)
    return NextResponse.json({ error: "Failed to create tournament day" }, { status: 500 })
  }
}
