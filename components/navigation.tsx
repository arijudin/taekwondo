import Link from "next/link";
import { LogIn } from "lucide-react";

export default async function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Overview
              </Link>

              <Link
                href="/tournament"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                Tournament
              </Link>
            </div>
          </div>

          <Link href="/dashboard" className="flex items-center gap-4">
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
