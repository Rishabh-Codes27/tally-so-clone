"use client"

import { useState, useCallback, useRef } from "react"
import { Navbar } from "./navbar"
import { FormBlockComponent } from "./form-block"
import { FormPreview } from "./form-preview"
import { InsertBlockDialog } from "./insert-block-dialog"
import type { FormBlock, BlockType } from "./types"
import { HelpCircle } from "lucide-react"

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function createBlock(type: BlockType): FormBlock {
  const base: FormBlock = {
    id: generateId(),
    type,
    content: "",
  }

  if (
    type === "multiple-choice" ||
    type === "checkboxes" ||
    type === "dropdown" ||
    type === "multi-select"
  ) {
    base.options = ["Option 1", "Option 2", "Option 3"]
  }

  if (type === "ranking") {
    base.options = ["Item 1", "Item 2", "Item 3"]
  }

  if (type === "matrix") {
    base.rows = ["Row 1", "Row 2", "Row 3"]
    base.columns = ["Column 1", "Column 2", "Column 3"]
  }

  if (type === "time") {
    base.timeStart = "09:00"
    base.timeEnd = "17:00"
    base.timeStep = 15
  }

  return base
}

export function FormBuilder() {
  const [formTitle, setFormTitle] = useState("")
  const [blocks, setBlocks] = useState<FormBlock[]>([
    { id: generateId(), type: "text", content: "" },
  ])
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [insertDialogOpen, setInsertDialogOpen] = useState(false)
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(
    null
  )
  const [isPreview, setIsPreview] = useState(false)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const updateBlock = useCallback((updatedBlock: FormBlock) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    )
  }, [])

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id)
      if (filtered.length === 0) {
        const newBlock = createBlock("text")
        setTimeout(() => setActiveBlockId(newBlock.id), 0)
        return [newBlock]
      }
      const deletedIndex = prev.findIndex((b) => b.id === id)
      const focusIndex = Math.max(0, deletedIndex - 1)
      setTimeout(() => setActiveBlockId(filtered[focusIndex]?.id ?? null), 0)
      return filtered
    })
  }, [])

  const addBlockBelow = useCallback((afterId: string) => {
    const newBlock = createBlock("text")
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === afterId)
      const next = [...prev]
      next.splice(index + 1, 0, newBlock)
      return next
    })
    setTimeout(() => setActiveBlockId(newBlock.id), 0)
  }, [])

  const insertBlock = useCallback((replaceId: string, type: BlockType) => {
    const newBlock = createBlock(type)
    newBlock.id = replaceId // keep the same ID so the element stays in place
    setBlocks((prev) =>
      prev.map((b) => (b.id === replaceId ? { ...newBlock, id: replaceId } : b))
    )
    setTimeout(() => setActiveBlockId(replaceId), 0)
  }, [])

  const openInsertDialog = useCallback((afterBlockId: string) => {
    setInsertAfterBlockId(afterBlockId)
    setInsertDialogOpen(true)
  }, [])

  const handleDialogInsert = useCallback(
    (type: BlockType) => {
      const newBlock = createBlock(type)
      if (insertAfterBlockId) {
        setBlocks((prev) => {
          const index = prev.findIndex((b) => b.id === insertAfterBlockId)
          const next = [...prev]
          next.splice(index + 1, 0, newBlock)
          return next
        })
      } else {
        setBlocks((prev) => [...prev, newBlock])
      }
      setTimeout(() => setActiveBlockId(newBlock.id), 0)
      setInsertDialogOpen(false)
      setInsertAfterBlockId(null)
    },
    [insertAfterBlockId]
  )

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragOver = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null
      dragOverItem.current = null
      return
    }
    const items = [...blocks]
    const [dragged] = items.splice(dragItem.current, 1)
    items.splice(dragOverItem.current, 0, dragged)
    setBlocks(items)
    dragItem.current = null
    dragOverItem.current = null
  }

  const handleAddBlockFromEmpty = useCallback(() => {
    // Only add if there isn't already an empty text block at the end
    const lastBlock = blocks[blocks.length - 1]
    if (lastBlock && lastBlock.type === "text" && lastBlock.content === "") {
      setActiveBlockId(lastBlock.id)
      return
    }
    const newBlock = createBlock("text")
    setBlocks((prev) => [...prev, newBlock])
    setTimeout(() => setActiveBlockId(newBlock.id), 0)
  }, [blocks])

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar
        formTitle={formTitle}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview((prev) => !prev)}
      />

      <main className="flex-1 overflow-y-auto">
        {isPreview ? (
          <FormPreview formTitle={formTitle} blocks={blocks} />
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-16">
            {/* Form Title */}
            <div className="mb-8">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Form title"
                className="w-full text-center text-4xl font-bold text-foreground placeholder:text-muted-foreground/30 outline-none bg-transparent"
                aria-label="Form title"
              />
            </div>

            {/* Blocks */}
            <div className="flex flex-col">
              {blocks.map((block, index) => (
                <FormBlockComponent
                  key={block.id}
                  block={block}
                  isActive={activeBlockId === block.id}
                  onFocus={() => setActiveBlockId(block.id)}
                  onUpdate={updateBlock}
                  onDelete={() => deleteBlock(block.id)}
                  onAddBelow={() => addBlockBelow(block.id)}
                  onInsertBlock={(type) => insertBlock(block.id, type)}
                  onOpenInsertDialog={() => openInsertDialog(block.id)}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move"
                    handleDragStart(index)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    handleDragOver(index)
                  }}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>

            {/* Empty state click area */}
            <div
              className="min-h-[200px] cursor-text"
              onClick={handleAddBlockFromEmpty}
              aria-hidden="true"
            />
          </div>
        )}
      </main>

      {/* Insert Block Dialog */}
      {!isPreview && (
        <InsertBlockDialog
          isOpen={insertDialogOpen}
          onSelect={handleDialogInsert}
          onClose={() => {
            setInsertDialogOpen(false)
            setInsertAfterBlockId(null)
          }}
        />
      )}

      {/* Help button */}
      <button
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-secondary text-secondary-foreground hover:bg-accent flex items-center justify-center shadow-sm border border-border transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
    </div>
  )
}
