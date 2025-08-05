import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"

async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomePage />
    </Suspense>
  )
}
