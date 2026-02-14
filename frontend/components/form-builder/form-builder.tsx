"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "./navbar";
import { FormBlockComponent } from "./form-block";
import { FormPreview } from "./form-preview";
import { InsertBlockDialog } from "./insert-block-dialog";
import type { FormBlock, BlockType } from "./types";
import { HelpCircle, ImagePlus, Image, SlidersHorizontal } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import { createForm } from "@/lib/api";

const builderFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function createBlock(type: BlockType): FormBlock {
  const base: FormBlock = {
    id: generateId(),
    type,
    content: "",
  };

  if (
    type === "multiple-choice" ||
    type === "checkboxes" ||
    type === "dropdown" ||
    type === "multi-select"
  ) {
    base.options = ["Option 1", "Option 2", "Option 3"];
  }

  if (type === "ranking") {
    base.options = ["Item 1", "Item 2", "Item 3"];
  }

  if (type === "matrix") {
    base.rows = ["Row 1", "Row 2", "Row 3"];
    base.columns = ["Column 1", "Column 2", "Column 3"];
  }

  if (type === "time") {
    base.timeStart = "09:00";
    base.timeEnd = "17:00";
    base.timeStep = 15;
  }

  return base;
}

interface FormBuilderProps {
  initialTitle?: string;
  autoFocusFirstBlock?: boolean;
}

export function FormBuilder({
  initialTitle = "",
  autoFocusFirstBlock = false,
}: FormBuilderProps) {
  const [formTitle, setFormTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<FormBlock[]>([
    { id: generateId(), type: "text", content: "" },
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(
    null,
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [responsesUrl, setResponsesUrl] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (!autoFocusFirstBlock || isPreview) return;
    if (activeBlockId || blocks.length === 0) return;
    setActiveBlockId(blocks[0].id);
  }, [autoFocusFirstBlock, isPreview, activeBlockId, blocks]);

  const updateBlock = useCallback((updatedBlock: FormBlock) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
    );
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      if (filtered.length === 0) {
        const newBlock = createBlock("text");
        setTimeout(() => setActiveBlockId(newBlock.id), 0);
        return [newBlock];
      }
      const deletedIndex = prev.findIndex((b) => b.id === id);
      const focusIndex = Math.max(0, deletedIndex - 1);
      setTimeout(() => setActiveBlockId(filtered[focusIndex]?.id ?? null), 0);
      return filtered;
    });
  }, []);

  const addBlockBelow = useCallback((afterId: string) => {
    const newBlock = createBlock("text");
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === afterId);
      const next = [...prev];
      next.splice(index + 1, 0, newBlock);
      return next;
    });
    setTimeout(() => setActiveBlockId(newBlock.id), 0);
  }, []);

  const insertBlock = useCallback((replaceId: string, type: BlockType) => {
    const newBlock = createBlock(type);
    newBlock.id = replaceId; // keep the same ID so the element stays in place
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === replaceId ? { ...newBlock, id: replaceId } : b,
      ),
    );
    setTimeout(() => setActiveBlockId(replaceId), 0);
  }, []);

  const openInsertDialog = useCallback((afterBlockId: string) => {
    setInsertAfterBlockId(afterBlockId);
    setInsertDialogOpen(true);
  }, []);

  const handleDialogInsert = useCallback(
    (type: BlockType) => {
      const newBlock = createBlock(type);
      if (insertAfterBlockId) {
        setBlocks((prev) => {
          const index = prev.findIndex((b) => b.id === insertAfterBlockId);
          const next = [...prev];
          next.splice(index + 1, 0, newBlock);
          return next;
        });
      } else {
        setBlocks((prev) => [...prev, newBlock]);
      }
      setTimeout(() => setActiveBlockId(newBlock.id), 0);
      setInsertDialogOpen(false);
      setInsertAfterBlockId(null);
    },
    [insertAfterBlockId],
  );

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragOver = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    const items = [...blocks];
    const [dragged] = items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, dragged);
    setBlocks(items);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleAddBlockFromEmpty = useCallback(() => {
    // Only add if there isn't already an empty text block at the end
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock && lastBlock.type === "text" && lastBlock.content === "") {
      setActiveBlockId(lastBlock.id);
      return;
    }
    const newBlock = createBlock("text");
    setBlocks((prev) => [...prev, newBlock]);
    setTimeout(() => setActiveBlockId(newBlock.id), 0);
  }, [blocks]);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    setPublishError(null);
    try {
      const response = await createForm({
        title: formTitle,
        blocks,
      });
      const frontendShareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/s/${response.share_id}`
          : response.share_url;
      const frontendResponsesUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/responses/${response.id}`
          : null;
      setShareUrl(frontendShareUrl ?? null);
      setResponsesUrl(frontendResponsesUrl);
      if (frontendShareUrl && navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(frontendShareUrl).catch(() => undefined);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to publish";
      setPublishError(message);
    } finally {
      setIsPublishing(false);
    }
  }, [blocks, formTitle]);

  return (
    <div
      className={`flex flex-col min-h-screen bg-muted/20 ${builderFont.className}`}
    >
      <Navbar
        formTitle={formTitle}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview((prev) => !prev)}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        shareUrl={shareUrl}
        responsesUrl={responsesUrl}
      />

      <main className="flex-1 overflow-y-auto" data-scroll-container="true">
        {isPreview ? (
          <FormPreview formTitle={formTitle} blocks={blocks} />
        ) : (
          <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-14">
            {/* Form Title */}
            <div className="mb-10 text-center group">
              <div className="mb-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-accent/60"
                  aria-label="Add logo"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Add logo
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-accent/60"
                  aria-label="Add cover"
                >
                  <Image className="h-3.5 w-3.5" />
                  Add cover
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-accent/60"
                  aria-label="Customize"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Customize
                </button>
              </div>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && blocks.length > 0) {
                    e.preventDefault();
                    setActiveBlockId(blocks[0].id);
                  }
                }}
                placeholder="Form title"
                className="w-full text-center text-4xl md:text-5xl font-semibold tracking-tight text-foreground placeholder:text-muted-foreground/35 outline-none bg-transparent"
                aria-label="Form title"
              />
              <p className="mt-3 text-xs text-muted-foreground/55">
                Type "/" to insert blocks
              </p>
            </div>

            {/* Blocks */}
            <div className="flex flex-col gap-4">
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
                    e.dataTransfer.effectAllowed = "move";
                    handleDragStart(index);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver(index);
                  }}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>

            <div className="mt-10 flex justify-start">
              <button
                type="button"
                className="px-6 py-2 rounded-md bg-foreground text-background text-sm font-medium"
                aria-label="Submit form"
              >
                Submit
              </button>
            </div>

            {publishError ? (
              <div className="mt-4 text-sm text-destructive">
                {publishError}
              </div>
            ) : null}

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
            setInsertDialogOpen(false);
            setInsertAfterBlockId(null);
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
  );
}
