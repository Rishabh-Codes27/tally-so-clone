"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap, Clock, Settings, ChevronRight } from "lucide-react";
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
}

export function Navbar({
  formTitle,
  isPreview,
  onTogglePreview,
  onPublish,
  isPublishing,
  shareUrl,
  responsesUrl,
}: NavbarProps) {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getAuthToken()));
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-border bg-background md:h-12 md:flex-nowrap md:py-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-foreground"
        >
          <path
            d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
            fill="currentColor"
          />
        </svg>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">
          {formTitle || "Untitled"}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1 justify-end">
        {shareUrl ? (
          <button
            onClick={() => {
              if (!navigator?.clipboard?.writeText) {
                toast({
                  title: "Copy failed",
                  description: "Clipboard is not available in this browser.",
                });
                return;
              }
              navigator.clipboard
                .writeText(shareUrl)
                .then(() => {
                  toast({
                    title: "Link copied",
                    description: shareUrl,
                  });
                })
                .catch(() => {
                  toast({
                    title: "Copy failed",
                    description: "Could not copy the link.",
                  });
                });
            }}
            className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors sm:text-xs"
          >
            Copy link
          </button>
        ) : null}
        {responsesUrl ? (
          <a
            href={responsesUrl}
            className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors sm:text-xs"
          >
            Responses
          </a>
        ) : null}
        <a
          href="/dashboard"
          className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors sm:text-xs"
        >
          Dashboard
        </a>
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
          aria-label="Integrations"
        >
          <Zap className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
          aria-label="History"
        >
          <Clock className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
        {hasToken ? (
          <button
            onClick={() => {
              clearAuthToken();
              setHasToken(false);
              window.location.href = "/";
            }}
            className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors sm:text-sm"
          >
            Sign out
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="px-3 py-1.5 text-[11px] font-medium text-foreground hover:text-foreground/80 transition-colors sm:text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors sm:text-sm"
            >
              Sign up
            </Link>
          </div>
        )}
        <button
          onClick={onTogglePreview}
          aria-pressed={isPreview}
          className="px-3 py-1.5 text-[11px] font-medium text-foreground hover:bg-accent rounded-md transition-colors sm:text-sm"
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="px-4 py-1.5 text-[11px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed sm:text-sm"
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </header>
  );
}
