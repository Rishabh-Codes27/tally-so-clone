"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { SLASH_COMMANDS, type BlockType } from "./types"
import { BlockIcon } from "./block-icons"

interface SlashCommandMenuProps {
  isOpen: boolean
  searchQuery: string
  position: { top: number; left: number }
  onSelect: (type: BlockType) => void
  onClose: () => void
}

export function SlashCommandMenu({
  isOpen,
  searchQuery,
  position,
  onSelect,
  onClose,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map())

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
    setSelectedIndex(0)
  }, [searchQuery])

  useEffect(() => {
    const el = itemRefs.current.get(selectedIndex)
    if (el) {
      el.scrollIntoView({ block: "nearest" })
    }
  }, [selectedIndex])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

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
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    },
    [isOpen, filtered, selectedIndex, onSelect, onClose]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen || filtered.length === 0) return null

  let flatIndex = 0

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-72 max-h-80 overflow-y-auto rounded-lg border border-border bg-popover shadow-lg"
      style={{ top: position.top, left: position.left }}
      role="listbox"
      aria-label="Insert block"
    >
      <div className="p-1.5">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                  className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-md text-sm transition-colors ${
                    selectedIndex === currentIndex
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                  onClick={() => onSelect(cmd.type)}
                  onMouseEnter={() => setSelectedIndex(currentIndex)}
                  role="option"
                  aria-selected={selectedIndex === currentIndex}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-md bg-secondary text-secondary-foreground shrink-0">
                    <BlockIcon icon={cmd.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{cmd.label}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {cmd.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
