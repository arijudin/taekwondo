import type React from "react"
import { TournamentSidebar } from "@/components/tournament-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireAuth } from "@/lib/auth"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function TournamentLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  await requireAuth()

  // Fetch tournament to verify it exists
  const tournamentId = Number.parseInt(params.id)
  if (isNaN(tournamentId)) {
    notFound()
  }

  const tournament = await sql`
    SELECT id, name FROM tournaments WHERE id = ${tournamentId}
  `

  if (tournament.length === 0) {
    notFound()
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <TournamentSidebar tournamentId={tournamentId} tournamentName={tournament[0].name} />
      <SidebarInset>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          {children}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
