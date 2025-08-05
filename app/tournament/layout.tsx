import type React from "react";
import { requireAuth } from "@/lib/auth";
import { Suspense } from "react";

export default async function TournamentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
