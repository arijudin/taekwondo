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

    const result = await sql`
      SELECT * FROM tournaments WHERE id = ${tournamentId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching tournament:", error)
    return NextResponse.json({ error: "Failed to fetch tournament" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Build dynamic update query
    const updateFields = []
    const values = []
    let paramIndex = 1

    // Helper function to add field to update
    const addField = (fieldName: string, value: any) => {
      if (value !== undefined) {
        updateFields.push(`${fieldName} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    // Add all possible fields
    addField('name', body.name)
    addField('grade_kejuaraan', body.grade_kejuaraan)
    addField('registration_fee', body.registration_fee)
    addField('tempat_kejuaraan', body.tempat_kejuaraan)
    addField('lokasi_kejuaraan', body.lokasi_kejuaraan)
    addField('jumlah_peserta_prestasi', body.jumlah_peserta_prestasi)
    addField('jumlah_peserta_pemula', body.jumlah_peserta_pemula)
    addField('start_date', body.start_date)
    addField('end_date', body.end_date)
    addField('tanggal_buka_pendaftaran', body.tanggal_buka_pendaftaran)
    addField('tanggal_tutup_pendaftaran', body.tanggal_tutup_pendaftaran)
    addField('status_pendaftaran', body.status_pendaftaran)
    addField('status_pendaftaran_atlit', body.status_pendaftaran_atlit)
    addField('status_kelas_atlit', body.status_kelas_atlit)
    addField('penjelasan_kejuaraan', body.penjelasan_kejuaraan)
    addField('kota_kejuaraan', body.kota_kejuaraan)
    addField('nomor_surat_ijin', body.nomor_surat_ijin)
    addField('ketua', body.ketua)
    addField('sekretaris', body.sekretaris)
    addField('opsi_pendaftaran', body.opsi_pendaftaran)
    addField('lebar_ukuran_cocard', body.lebar_ukuran_cocard)
    addField('tinggi_ukuran_cocard', body.tinggi_ukuran_cocard)

    // File URLs
    addField('gambar_cap_url', body.gambar_cap_url)
    addField('cocard_atlit_url', body.cocard_atlit_url)
    addField('cocard_coach_url', body.cocard_coach_url)
    addField('cocard_manajer_url', body.cocard_manajer_url)
    addField('cocard_official_url', body.cocard_official_url)
    addField('daftar_peserta_prestasi_url', body.daftar_peserta_prestasi_url)
    addField('desain_kaos_url', body.desain_kaos_url)
    addField('kop_surat_url', body.kop_surat_url)
    addField('pamflet_url', body.pamflet_url)
    addField('proposal_url', body.proposal_url)
    addField('surat_izin_keramaian_url', body.surat_izin_keramaian_url)
    addField('surat_izin_satgas_covid_url', body.surat_izin_satgas_covid_url)
    addField('surat_permohonan_url', body.surat_permohonan_url)
    addField('surat_permohonan_ipk_url', body.surat_permohonan_ipk_url)
    addField('surat_rekomendasi_pengelola_url', body.surat_rekomendasi_pengelola_url)
    addField('ttd_ketua_url', body.ttd_ketua_url)
    addField('ttd_sekretaris_url', body.ttd_sekretaris_url)

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Add updated_at and tournament ID
    updateFields.push(`updated_at = NOW()`)
    values.push(tournamentId)

    const query = `
      UPDATE tournaments 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql.unsafe(query, values)

    if (result.length === 0) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating tournament:", error)
    return NextResponse.json({ error: "Failed to update tournament" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tournamentId = Number.parseInt(params.id)
    if (isNaN(tournamentId)) {
      return NextResponse.json({ error: "Invalid tournament ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM tournaments WHERE id = ${tournamentId} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tournament deleted successfully" })
  } catch (error) {
    console.error("Error deleting tournament:", error)
    return NextResponse.json({ error: "Failed to delete tournament" }, { status: 500 })
  }
}
