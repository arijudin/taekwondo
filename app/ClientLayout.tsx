"use client"
import type React from "react"
import Navigation from "@/components/navigation"
import { Suspense } from "react"
import { usePathname } from "next/navigation"

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showNavigation = !pathname.startsWith("/tournament")

  return (
    <>
      {showNavigation && (
        <Suspense fallback={<div className="h-16 bg-white border-b" />}>
          <Navigation />
        </Suspense>
      )}
      <main className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </>
  )
}

export default ClientLayout
