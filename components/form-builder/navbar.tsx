"use client"

import { Zap, Clock, Settings, ChevronRight } from "lucide-react"

interface NavbarProps {
  formTitle: string
  isPreview: boolean
  onTogglePreview: () => void
}

export function Navbar({ formTitle, isPreview, onTogglePreview }: NavbarProps) {
  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-border bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
        <span className="text-foreground font-medium">
          {formTitle || "Untitled"}
        </span>
      </div>
      <div className="flex items-center gap-1">
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
        <button className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors">
          Customize
        </button>
        <button className="px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Sign up
        </button>
        <button
          onClick={onTogglePreview}
          aria-pressed={isPreview}
          className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
        <button className="px-4 py-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors">
          Publish
        </button>
      </div>
    </header>
  )
}
