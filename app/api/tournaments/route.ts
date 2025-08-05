import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tournaments = await sql`
      SELECT 
        id, name, description, start_date, end_date, location, status,
        organizer, chairman, referee_chief, treasurer, admin_tournament, 
        registration_fee, created_at, updated_at
      FROM tournaments 
      ORDER BY 
        CASE 
          WHEN status = 'ongoing' THEN 1
          WHEN status = 'registration' THEN 2
          WHEN status = 'planning' THEN 3
          WHEN status = 'completed' THEN 4
          ELSE 5
        END,
        start_date DESC
    `

    return NextResponse.json(tournaments)
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
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
      registration_fee,
    } = body

    // Validation
    if (!name || !start_date || !end_date || !location) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if end date is after start date
    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
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
        ${start_date}, 
        ${end_date}, 
        ${location}, 
        ${status || "planning"},
        ${organizer || null},
        ${chairman || null},
        ${referee_chief || null},
        ${treasurer || null},
        ${admin_tournament || null},
        ${registration_fee || null}
      )
      RETURNING 
        id, name, description, start_date, end_date, location, status,
        organizer, chairman, referee_chief, treasurer, admin_tournament, 
        registration_fee, created_at, updated_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating tournament:", error)
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 })
  }
}
