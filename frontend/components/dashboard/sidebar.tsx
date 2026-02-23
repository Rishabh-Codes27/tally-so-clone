"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Search,
  Users,
  Globe,
  Settings,
  ChevronDown,
  Plus,
  FileText,
  Sparkles,
  Map,
  MessageSquare,
  Gift,
  Trash,
  Rocket,
  BookOpen,
  HelpCircle,
  Mail,
  LogOut,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clearAuthToken, getCurrentUser } from "@/lib/api";

interface SidebarProps {
  onSearchClick?: () => void;
  onMembersClick?: () => void;
}

export function Sidebar({ onSearchClick, onMembersClick }: SidebarProps) {
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setUsername(user.username))
      .catch(() => setUsername(null));
  }, []);

  const handleSignOut = () => {
    clearAuthToken();
    window.location.href = "/";
  };

  return (
    <aside
      className={`border-r border-border bg-background flex flex-col h-screen transition-all duration-200 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isCollapsed ? (
        /* Collapsed state - only show expand button */
        <div className="flex-1 flex items-start justify-center pt-4">
          {isHovered && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      ) : (
        <>
          {/* User dropdown with collapse button */}
          <div className="h-14 px-3 flex items-center gap-2 border-b border-border relative">
            {username && (
              <>
                <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">
                    {username}
                  </span>
                  <button className="p-0.5 hover:bg-accent rounded transition-colors">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                {isHovered && (
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 hover:bg-accent rounded transition-colors"
                  >
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Main navigation */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto">
            <div className="space-y-0.5">
              <Link
                href="/dashboard"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } px-2 py-1.5 text-sm rounded-md transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                title={isCollapsed ? "Home" : undefined}
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {!isCollapsed && "Home"}
              </Link>
              <button
                onClick={onSearchClick}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors w-full text-left`}
                title={isCollapsed ? "Search" : undefined}
              >
                <Search className="h-4 w-4 shrink-0" />
                {!isCollapsed && "Search"}
              </button>
              <button
                onClick={onMembersClick}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors w-full text-left`}
                title={isCollapsed ? "Members" : undefined}
              >
                <Users className="h-4 w-4 shrink-0" />
                {!isCollapsed && "Members"}
              </button>
              <Link
                href="/dashboard/domains"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors`}
                title={isCollapsed ? "Domains" : undefined}
              >
                <Globe className="h-4 w-4 shrink-0" />
                {!isCollapsed && "Domains"}
              </Link>
              <Link
                href="/dashboard/settings"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors`}
                title={isCollapsed ? "Settings" : undefined}
              >
                <Settings className="h-4 w-4 shrink-0" />
                {!isCollapsed && "Settings"}
              </Link>
            </div>

            {/* Upgrade plan */}
            {!isCollapsed && (
              <div className="mt-1">
                <Link
                  href="/upgrade"
                  className="flex items-center gap-3 px-2 py-1.5 text-sm text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-md transition-colors"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Upgrade plan
                </Link>
              </div>
            )}

            {/* Sections only shown when expanded */}
            {!isCollapsed && (
              <>
                {/* Workspaces */}
                <div className="mt-5">
                  <div className="px-2 mb-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Workspaces
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <Link
                      href="/dashboard/workspace"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                      My workspace
                    </Link>
                  </div>
                </div>

                {/* Product */}
                <div className="mt-5">
                  <div className="px-2 mb-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Product
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <Link
                      href="/templates"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Templates
                    </Link>
                    <Link
                      href="/whats-new"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      What&apos;s new
                    </Link>
                    <Link
                      href="/roadmap"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <Map className="h-4 w-4" />
                      Roadmap
                    </Link>
                    <Link
                      href="/feature-requests"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Feature requests
                    </Link>
                    <Link
                      href="/rewards"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <Gift className="h-4 w-4" />
                      Rewards
                    </Link>
                    <Link
                      href="/trash"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                      Trash
                    </Link>
                  </div>
                </div>

                {/* Help */}
                <div className="mt-5">
                  <div className="px-2 mb-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Help
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <Link
                      href="/get-started"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <Rocket className="h-4 w-4" />
                      Get started
                    </Link>
                    <Link
                      href="/guides"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      How-to guides
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help center
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-3 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Contact support
                    </Link>
                  </div>
                </div>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-3">
            <button className="w-full flex items-center gap-3 px-2 py-1.5 text-sm text-primary hover:text-primary/80 hover:bg-accent/50 rounded-md transition-colors relative">
              <MessageCircle className="h-4 w-4" />
              Give Feedback
              <span className="ml-auto h-2 w-2 rounded-full bg-blue-500"></span>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
