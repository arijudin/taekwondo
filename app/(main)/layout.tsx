import type React from "react"
import NavigationServer from "@/components/navigation-server"
import { Suspense } from "react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white border-b" />}>
        <NavigationServer />
      </Suspense>
      <main>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </>
  )
}
