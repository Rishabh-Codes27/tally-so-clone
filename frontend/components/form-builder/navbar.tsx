"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Zap,
  Clock,
  Settings,
  ChevronRight,
  Ban,
  FileText,
} from "lucide-react";
import { clearAuthToken, getAuthToken } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface NavbarProps {
  formTitle: string;
  isPreview: boolean;
  onTogglePreview: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  shareUrl: string | null;
  responsesUrl: string | null;
  publishLabel?: string;
}

export function Navbar({
  formTitle,
  isPreview,
  onTogglePreview,
  onPublish,
  isPublishing,
  shareUrl,
  responsesUrl,
  publishLabel = "Publish",
}: NavbarProps) {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getAuthToken()));
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 border-b border-gray-200 bg-white md:h-14 md:flex-nowrap md:py-0">
      <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
        <Link
          href={hasToken ? "/dashboard" : "/"}
          aria-label={hasToken ? "Go to dashboard" : "Go to home"}
          className="inline-flex items-center justify-center rounded-md p-1 transition-colors hover:text-gray-900"
        >
          <span className="font-bold text-gray-900">⭐</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <span className="text-gray-700 font-medium truncate">
          {formTitle || "Untitled"}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 justify-end">
        <button
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Integrations"
        >
          <Zap className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="History"
        >
          <Clock className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors">
          Customize
        </button>
        {hasToken ? (
          <button
            onClick={() => {
              clearAuthToken();
              setHasToken(false);
              window.location.href = "/";
            }}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/signup"
            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up
          </Link>
        )}
        <button
          onClick={onTogglePreview}
          aria-pressed={isPreview}
          className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-gray-800 hover:bg-gray-900 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPublishing ? "Publishing..." : publishLabel}
        </button>
      </div>
    </header>
  );
}
