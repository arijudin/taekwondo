import type React from "react"
import { TournamentSidebar } from "@/components/tournament-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireAuth } from "@/lib/auth"
import { Suspense } from "react"

export default async function TournamentLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()

  return (
    <SidebarProvider defaultOpen={true}>
      <TournamentSidebar />
      <SidebarInset>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          {children}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
