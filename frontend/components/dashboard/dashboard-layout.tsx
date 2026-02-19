"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { SearchDialog } from "@/components/dashboard/search-dialog";
import { Search, Settings, Sparkles } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <Sidebar onSearchClick={() => setSearchOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <nav className="h-14 border-b border-border bg-background flex items-center justify-end px-6 gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
