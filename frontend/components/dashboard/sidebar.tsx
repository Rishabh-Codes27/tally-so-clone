"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, FileText, Settings, User, LogOut, Plus } from "lucide-react";
import { clearAuthToken, getCurrentUser } from "@/lib/api";

export function Sidebar() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setUsername(user.username))
      .catch(() => setUsername(null));
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/forms", label: "All forms", icon: FileText },
  ];

  const handleSignOut = () => {
    clearAuthToken();
    window.location.href = "/";
  };

  return (
    <aside className="w-60 border-r border-border bg-background flex flex-col h-screen">
      {/* Logo */}
      <div className="h-14 px-6 flex items-center gap-2 border-b border-border">
        <div className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center font-semibold text-sm">
          T
        </div>
        <span className="text-foreground font-semibold">Tally</span>
      </div>

      {/* Create new form button */}
      <div className="p-4">
        <Link
          href="/builder"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create form
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        {username && (
          <div className="px-3 py-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {username}
                </p>
                <p className="text-xs text-muted-foreground">Free plan</p>
              </div>
            </div>
          </div>
        )}
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
