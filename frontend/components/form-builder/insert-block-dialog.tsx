"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Search, Plus, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react"
import { SLASH_COMMANDS, type BlockType } from "./types"
import { BlockIcon } from "./block-icons"

interface InsertBlockDialogProps {
  isOpen: boolean
  onSelect: (type: BlockType) => void
  onClose: () => void
}

export function InsertBlockDialog({
  isOpen,
  onSelect,
  onClose,
}: InsertBlockDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map())
  const backdropRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () =>
      SLASH_COMMANDS.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  )

  const grouped = useMemo(() => {
    const g: Record<string, typeof SLASH_COMMANDS> = {}
    for (const cmd of filtered) {
      if (!g[cmd.category]) g[cmd.category] = []
      g[cmd.category].push(cmd)
    }
    return g
  }, [filtered])

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      setSelectedIndex(0)
      itemRefs.current.clear()
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  useEffect(() => {
    const el = itemRefs.current.get(selectedIndex)
    if (el) {
      el.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  // Close on escape key even when dialog container isn't focused
  useEffect(() => {
    if (!isOpen) return
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [isOpen, onClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        )
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex].type)
        }
      }
    },
    [filtered, selectedIndex, onSelect]
  )

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  let flatIndex = 0

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20"
      onClick={handleBackdropClick}
    >
      <div
        className="w-[640px] max-h-[520px] bg-popover rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden"
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-label="Insert block"
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find questions, input fields and layout options..."
            className="flex-1 text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Content area */}
        <div className="flex flex-1 min-h-0">
          {/* Left panel - scrollable list */}
          <div
            ref={listRef}
            className="w-[300px] border-r border-border overflow-y-auto py-2"
          >
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-1">
                  <div className="px-5 py-1.5 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {items.map((cmd) => {
                    const currentIndex = flatIndex
                    flatIndex++
                    return (
                      <button
                        key={`${cmd.type}-${cmd.category}`}
                        ref={(el) => {
                          if (el) {
                            itemRefs.current.set(currentIndex, el)
                          } else {
                            itemRefs.current.delete(currentIndex)
                          }
                        }}
                        className={`flex items-center gap-3 w-full px-5 py-2 text-left text-sm transition-colors ${
                          selectedIndex === currentIndex
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-accent/50"
                        }`}
                        onClick={() => onSelect(cmd.type)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        <BlockIcon
                          icon={cmd.icon}
                          className="h-4 w-4 text-muted-foreground shrink-0"
                        />
                        <span className="font-medium">{cmd.label}</span>
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Right panel - help / info */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Insert anything
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"Search for any input field or layout option. Use "}
              <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-secondary text-xs align-middle">
                <ArrowUp className="h-3 w-3" />
              </span>
              {" and "}
              <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-secondary text-xs align-middle">
                <ArrowDown className="h-3 w-3" />
              </span>
              {" to browse the list, then hit "}
              <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-secondary text-xs align-middle">
                <CornerDownLeft className="h-3 w-3" />
              </span>
              {" to insert the selected block."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
