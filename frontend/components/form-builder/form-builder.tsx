"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "./navbar";
import { FormBlockComponent } from "./form-block";
import { FormPreview } from "./form-preview";
import { InsertBlockDialog } from "./insert-block-dialog";
import type { FormBlock, BlockType } from "./types";
import { ImagePlus, Image, SlidersHorizontal } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import { createForm, updateForm } from "@/lib/api";

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
    type === "dropdown"
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

  if (type === "linear-scale") {
    base.scaleMin = 1;
    base.scaleMax = 5;
  }

  if (type === "rating") {
    base.ratingMax = 5;
  }

  if (type === "file-upload") {
    base.fileMaxSizeMb = 1;
  }

  if (type === "payment") {
    base.paymentAmount = 10;
    base.paymentCurrency = "USD";
    base.paymentDescription = "Payment";
  }

  return base;
}

interface FormBuilderProps {
  initialTitle?: string;
  autoFocusFirstBlock?: boolean;
  initialBlocks?: FormBlock[];
  formId?: number;
  initialShareUrl?: string | null;
  initialResponsesUrl?: string | null;
}

export function FormBuilder({
  initialTitle = "",
  autoFocusFirstBlock = false,
  initialBlocks,
  formId,
  initialShareUrl = null,
  initialResponsesUrl = null,
}: FormBuilderProps) {
  const [formTitle, setFormTitle] = useState(initialTitle);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoInitialized, setLogoInitialized] = useState(false);
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverInitialized, setCoverInitialized] = useState(false);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [coverHeight, setCoverHeight] = useState(200);
  const [blocks, setBlocks] = useState<FormBlock[]>(
    initialBlocks || [{ id: generateId(), type: "text", content: "" }],
  );
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(
    null,
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(initialShareUrl);
  const [responsesUrl, setResponsesUrl] = useState<string | null>(
    initialResponsesUrl,
  );
  const [publishError, setPublishError] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  const moveToPreviousBlock = useCallback(
    (currentBlockId: string) => {
      const currentIndex = blocks.findIndex((b) => b.id === currentBlockId);
      if (currentIndex > 0) {
        // Move to previous block
        const prevBlock = blocks[currentIndex - 1];
        setActiveBlockId(prevBlock.id);
        setTimeout(() => {
          const target = document.querySelector(
            `[data-block-id="${prevBlock.id}"] [contenteditable="true"]`,
          ) as HTMLElement | null;
          if (target) {
            target.focus();
            // Move cursor to the very end
            const sel = window.getSelection();
            const range = document.createRange();

            // Select all content first
            range.selectNodeContents(target);
            // Then collapse to the end
            range.collapse(false);

            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 10);
      } else if (currentIndex === 0) {
        // Move to title
        setTimeout(() => {
          if (titleInputRef.current) {
            titleInputRef.current.focus();
            const len = titleInputRef.current.value.length;
            titleInputRef.current.setSelectionRange(len, len);
          }
        }, 10);
      }
    },
    [blocks],
  );

  const moveToNextBlock = useCallback(
    (currentBlockId: string) => {
      const currentIndex = blocks.findIndex((b) => b.id === currentBlockId);
      if (currentIndex < blocks.length - 1) {
        // Move to next block
        const nextBlock = blocks[currentIndex + 1];
        setActiveBlockId(nextBlock.id);
        setTimeout(() => {
          const target = document.querySelector(
            `[data-block-id="${nextBlock.id}"] [contenteditable="true"]`,
          ) as HTMLElement | null;
          if (target) {
            target.focus();
            // Move cursor to start
            const range = document.createRange();
            const sel = window.getSelection();
            if (target.firstChild) {
              range.setStart(target.firstChild, 0);
              range.collapse(true);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
          }
        }, 0);
      }
    },
    [blocks],
  );

  const handlePublish = useCallback(async () => {
    if (formId) {
      const confirmed = confirm(
        "Update this published form? Changes will go live after you confirm.",
      );
      if (!confirmed) return;
    }
    setIsPublishing(true);
    setPublishError(null);
    try {
      const response = formId
        ? await updateForm(formId, { title: formTitle, blocks })
        : await createForm({ title: formTitle, blocks });
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
  }, [blocks, formId, formTitle]);

  return (
    <div
      className={`flex flex-col min-h-screen bg-white ${builderFont.className}`}
    >
      {!isPreview && (
        <Navbar
          formTitle={formTitle}
          isPreview={isPreview}
          onTogglePreview={() => setIsPreview((prev) => !prev)}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          shareUrl={shareUrl}
          responsesUrl={responsesUrl}
          publishLabel={formId ? "Update" : "Publish"}
        />
      )}

      <main className="flex-1 overflow-y-auto" data-scroll-container="true">
        {isPreview ? (
          <div className="w-full">
            <div className="px-4 sm:px-6 pt-4">
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <span className="text-base leading-none">←</span>
                Back to editor
              </button>
            </div>
            <FormPreview formTitle={formTitle} blocks={blocks} />
          </div>
        ) : (
          <>
            {/* Form Cover */}
            {coverInitialized && (
              <div className="relative -mx-5 sm:-mx-6 mb-8 group">
                <div
                  className="w-full bg-gradient-to-b from-pink-200 to-pink-100 relative"
                  style={{ height: `${coverHeight}px` }}
                >
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt="Form cover"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {/* Hover Controls */}
                <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100 flex gap-2">
                  <button
                    onClick={() => setCoverDialogOpen(true)}
                    className="bg-white px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md"
                  >
                    Change cover
                  </button>
                  <button
                    className="bg-white px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md"
                    onClick={() => {
                      // Show reposition controls
                      const newHeight = prompt(
                        `Enter cover height (${coverHeight}px):`,
                        coverHeight.toString(),
                      );
                      if (newHeight && !isNaN(Number(newHeight))) {
                        setCoverHeight(Number(newHeight));
                      }
                    }}
                  >
                    Reposition
                  </button>
                </div>
              </div>
            )}

            <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-14">
              {/* Form Logo */}
              {logoInitialized && (
                <div className="mb-8 flex justify-start">
                  <button
                    onClick={() => setLogoDialogOpen(true)}
                    className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center hover:ring-2 hover:ring-gray-400 transition-all cursor-pointer overflow-hidden"
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Form logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">◇</span>
                    )}
                  </button>
                </div>
              )}

              {/* Form Title */}
              <div className="mb-10 group">
                <div className="mb-3 flex items-start gap-4 text-[11px] text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100">
                  {!logoInitialized && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoInitialized(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-accent/60"
                      aria-label="Add logo"
                    >
                      <ImagePlus className="h-3.5 w-3.5" />
                      Add logo
                    </button>
                  )}
                  {!coverInitialized && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverInitialized(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 hover:bg-accent/60"
                      aria-label="Add cover"
                    >
                      <Image className="h-3.5 w-3.5" />
                      Add cover
                    </button>
                  )}
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
                  ref={titleInputRef}
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && blocks.length > 0) {
                      e.preventDefault();
                      setActiveBlockId(blocks[0].id);
                      setTimeout(() => {
                        const target = document.querySelector(
                          `[data-block-id="${blocks[0].id}"] [contenteditable="true"]`,
                        ) as HTMLElement | null;
                        target?.focus();
                      }, 0);
                    }
                    if (e.key === "ArrowDown" && blocks.length > 0) {
                      e.preventDefault();
                      setActiveBlockId(blocks[0].id);
                      setTimeout(() => {
                        const target = document.querySelector(
                          `[data-block-id="${blocks[0].id}"] [contenteditable="true"]`,
                        ) as HTMLElement | null;
                        if (target) {
                          target.focus();
                          // Move cursor to start
                          const range = document.createRange();
                          const sel = window.getSelection();
                          if (target.firstChild) {
                            range.setStart(target.firstChild, 0);
                            range.collapse(true);
                            sel?.removeAllRanges();
                            sel?.addRange(range);
                          }
                        }
                      }, 0);
                    }
                  }}
                  placeholder="Form title"
                  className="w-full text-left text-4xl md:text-5xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 outline-none bg-transparent"
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
                    onMoveToPrevious={() => moveToPreviousBlock(block.id)}
                    onMoveToNext={() => moveToNextBlock(block.id)}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      handleDragStart(index);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      handleDragOver(index);
                    }}
                    onDragEnd={handleDragEnd}
                    allBlocks={blocks}
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
          </>
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

      {/* Logo Dialog */}
      {logoDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Form Logo</h2>
              <button
                onClick={() => setLogoDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Upload Tab */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Check file size (1MB)
                      if (file.size > 1 * 1024 * 1024) {
                        alert("File size exceeds 1MB limit");
                        return;
                      }

                      // Check file type
                      const allowedTypes = [
                        "image/png",
                        "image/jpeg",
                        "image/gif",
                        "image/svg+xml",
                      ];
                      if (!allowedTypes.includes(file.type)) {
                        alert("Invalid file type. Allowed: PNG, JPG, GIF, SVG");
                        return;
                      }

                      // Upload file
                      if (formId) {
                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const response = await fetch(
                            `http://127.0.0.1:8000/forms/${formId}/logo`,
                            {
                              method: "POST",
                              body: formData,
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "tally_auth_token",
                                )}`,
                              },
                            },
                          );
                          const data = await response.json();
                          setLogoUrl(data.logo_url);
                          setLogoDialogOpen(false);
                        } catch (error) {
                          console.error("Upload failed:", error);
                          alert("Failed to upload logo");
                        }
                      } else {
                        // For unsaved forms, use data URL
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setLogoUrl(event.target?.result as string);
                          setLogoDialogOpen(false);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="text-gray-600">
                      <p className="text-2xl mb-2">↑</p>
                      <p className="font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, SVG - Max 1MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Link Tab */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.value) {
                      setLogoUrl(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      setLogoDialogOpen(false);
                    }
                  }}
                />
              </div>
            </div>

            {/* Remove Button */}
            {logoInitialized && (
              <button
                onClick={() => {
                  setLogoUrl(null);
                  setLogoInitialized(false);
                  setLogoDialogOpen(false);
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
              >
                🗑️ Remove
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cover Dialog */}
      {coverDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Form Cover
              </h2>
              <button
                onClick={() => setCoverDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Upload Tab */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Check file size (10MB for cover)
                      if (file.size > 10 * 1024 * 1024) {
                        alert("File size exceeds 10MB limit");
                        return;
                      }

                      // Check file type
                      const allowedTypes = [
                        "image/png",
                        "image/jpeg",
                        "image/gif",
                        "image/svg+xml",
                      ];
                      if (!allowedTypes.includes(file.type)) {
                        alert("Invalid file type. Allowed: PNG, JPG, GIF, SVG");
                        return;
                      }

                      // Upload file
                      if (formId) {
                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const response = await fetch(
                            `http://127.0.0.1:8000/forms/${formId}/cover`,
                            {
                              method: "POST",
                              body: formData,
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "tally_auth_token",
                                )}`,
                              },
                            },
                          );
                          const data = await response.json();
                          setCoverUrl(data.cover_url);
                          setCoverDialogOpen(false);
                        } catch (error) {
                          console.error("Upload failed:", error);
                          alert("Failed to upload cover");
                        }
                      } else {
                        // For unsaved forms, use data URL
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setCoverUrl(event.target?.result as string);
                          setCoverDialogOpen(false);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <div className="text-gray-600">
                      <p className="text-2xl mb-2">↑</p>
                      <p className="font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, SVG - Max 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Link Tab */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/cover.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.value) {
                      setCoverUrl(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      setCoverDialogOpen(false);
                    }
                  }}
                />
              </div>

              {/* Reposition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height: {coverHeight}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="300"
                  value={coverHeight}
                  onChange={(e) => setCoverHeight(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Adjust the height of your cover image (100px - 300px)
                </p>
              </div>
            </div>

            {/* Remove Button */}
            {coverInitialized && (
              <button
                onClick={() => {
                  setCoverUrl(null);
                  setCoverInitialized(false);
                  setCoverDialogOpen(false);
                  setCoverHeight(200);
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
              >
                🗑️ Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
