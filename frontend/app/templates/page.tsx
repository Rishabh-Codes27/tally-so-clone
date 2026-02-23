"use client";

import { TemplatesGrid } from "@/components/templates/templates-grid";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <a href="/" className="text-2xl font-bold text-foreground">
              tally*
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm hover:text-primary">
              Dashboard
            </a>
            <a href="/signin" className="text-sm hover:text-primary">
              Sign in
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <TemplatesGrid />
      </main>
    </div>
  );
}
