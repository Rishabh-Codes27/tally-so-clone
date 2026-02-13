"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Plus,
  GripVertical,
  Star,
  CreditCard,
  Wallet,
} from "lucide-react";
import type { FormBlock, BlockType } from "./types";
import { SlashCommandMenu } from "./slash-command-menu";

interface FormBlockProps {
  block: FormBlock;
  isActive: boolean;
  onFocus: () => void;
  onUpdate: (block: FormBlock) => void;
  onDelete: () => void;
  onAddBelow: () => void;
  onInsertBlock: (type: BlockType) => void;
  onOpenInsertDialog: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export function FormBlockComponent({
  block,
  isActive,
  onFocus,
  onUpdate,
  onDelete,
  onAddBelow,
  onInsertBlock,
  onOpenInsertDialog,
  onDragStart,
  onDragOver,
  onDragEnd,
}: FormBlockProps) {
  const textInputRef = useRef<HTMLDivElement>(null);
  const labelInputRef = useRef<HTMLDivElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const isTextBlock = block.type === "text";

  const updateMenuPosition = useCallback(() => {
    const ref = isTextBlock ? textInputRef : labelInputRef;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [isTextBlock]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const text = e.currentTarget.textContent || "";

      if (text.startsWith("/")) {
        setSlashQuery(text.slice(1));
        if (!showSlashMenu) {
          setShowSlashMenu(true);
          updateMenuPosition();
        }
      } else if (showSlashMenu) {
        setShowSlashMenu(false);
        setSlashQuery("");
      }

      onUpdate({ ...block, content: text });
    },
    [block, onUpdate, showSlashMenu, updateMenuPosition],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (showSlashMenu) {
        if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
          return;
        }
      }

      if (e.key === "Enter" && !e.shiftKey && !showSlashMenu) {
        e.preventDefault();
        onAddBelow();
      }

      if (
        e.key === "Backspace" &&
        (block.content === "" || block.content === "/")
      ) {
        if (block.type !== "text") return;
        e.preventDefault();
        onDelete();
      }
    },
    [block, onAddBelow, onDelete, showSlashMenu],
  );

  const handleSlashSelect = useCallback(
    (type: BlockType) => {
      setShowSlashMenu(false);
      setSlashQuery("");
      if (textInputRef.current) {
        textInputRef.current.textContent = "";
      }
      onInsertBlock(type);
    },
    [onInsertBlock],
  );

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(block.options || [])];
    newOptions[index] = value;
    onUpdate({ ...block, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [
      ...(block.options || []),
      `Option ${(block.options?.length || 0) + 1}`,
    ];
    onUpdate({ ...block, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (block.options || []).filter((_, i) => i !== index);
    onUpdate({ ...block, options: newOptions });
  };

  const handleRowChange = (index: number, value: string) => {
    const newRows = [...(block.rows || [])];
    newRows[index] = value;
    onUpdate({ ...block, rows: newRows });
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...(block.columns || [])];
    newColumns[index] = value;
    onUpdate({ ...block, columns: newColumns });
  };

  const handleTimeSettingChange = (
    key: "timeStart" | "timeEnd" | "timeStep",
    value: string,
  ) => {
    if (key === "timeStep") {
      const next = Number(value);
      onUpdate({ ...block, timeStep: Number.isNaN(next) ? undefined : next });
      return;
    }
    onUpdate({ ...block, [key]: value });
  };

  // Focus text block on activation
  useEffect(() => {
    if (
      isActive &&
      block.type === "text" &&
      block.content === "" &&
      textInputRef.current
    ) {
      textInputRef.current.focus();
    }
  }, [isActive, block.type, block.content]);

  // For non-text blocks, focus the label input on activation
  useEffect(() => {
    if (isActive && block.type !== "text" && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isActive, block.type]);

  const labelBaseClass =
    "text-sm font-medium text-foreground outline-none mb-2 block w-full empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50";

  const renderEditableLabel = (
    placeholder: string,
    ariaLabel: string,
    className?: string,
  ) => (
    <div
      ref={labelInputRef}
      contentEditable
      suppressContentEditableWarning
      className={className || labelBaseClass}
      data-placeholder={placeholder}
      onInput={(e) => {
        const text = e.currentTarget.textContent || "";
        onUpdate({ ...block, content: text });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onAddBelow();
        }
      }}
      onFocus={onFocus}
      role="textbox"
      aria-label={ariaLabel}
    />
  );

  const renderBlockContent = () => {
    switch (block.type) {
      case "heading1":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Heading 1",
              "Heading 1",
              "text-3xl font-bold text-foreground outline-none w-full block empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30",
            )}
          </div>
        );
      case "heading2":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Heading 2",
              "Heading 2",
              "text-2xl font-bold text-foreground outline-none w-full block empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30",
            )}
          </div>
        );
      case "heading3":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Heading 3",
              "Heading 3",
              "text-xl font-semibold text-foreground outline-none w-full block empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30",
            )}
          </div>
        );
      case "paragraph":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Type something...",
              "Paragraph",
              "text-base text-foreground outline-none w-full block leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30",
            )}
          </div>
        );
      case "short-answer":
        return (
          <div className="w-full">
            {renderEditableLabel("Question", "Short answer question")}
            <div className="border-b border-border py-2 text-sm text-muted-foreground pointer-events-none">
              Short answer text
            </div>
          </div>
        );
      case "long-answer":
        return (
          <div className="w-full">
            {renderEditableLabel("Question", "Long answer question")}
            <div className="border border-border rounded-md p-3 h-20 text-sm text-muted-foreground pointer-events-none">
              Long answer text
            </div>
          </div>
        );
      case "email":
        return (
          <div className="w-full">
            {renderEditableLabel("Email address", "Email question")}
            <div className="border-b border-border py-2 text-sm text-muted-foreground pointer-events-none flex items-center gap-2">
              <span>@</span> name@example.com
            </div>
          </div>
        );
      case "number":
        return (
          <div className="w-full">
            {renderEditableLabel("Number question", "Number question")}
            <div className="border-b border-border py-2 text-sm text-muted-foreground pointer-events-none">
              0
            </div>
          </div>
        );
      case "url":
        return (
          <div className="w-full">
            {renderEditableLabel("URL", "URL question")}
            <div className="border-b border-border py-2 text-sm text-muted-foreground pointer-events-none">
              https://
            </div>
          </div>
        );
      case "phone":
        return (
          <div className="w-full">
            {renderEditableLabel("Phone number", "Phone question")}
            <div className="border-b border-border py-2 text-sm text-muted-foreground pointer-events-none">
              +1 (555) 000-0000
            </div>
          </div>
        );
      case "date":
        return (
          <div className="w-full">
            {renderEditableLabel("Date", "Date question")}
            <div className="border border-border rounded-md px-3 py-2 text-sm text-muted-foreground pointer-events-none inline-flex items-center gap-2">
              MM / DD / YYYY
            </div>
          </div>
        );
      case "time":
        return (
          <div className="w-full">
            {renderEditableLabel("Time", "Time question")}
            <div className="flex flex-wrap items-end gap-4 text-sm text-foreground">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Start time
                </span>
                <input
                  type="time"
                  value={block.timeStart || ""}
                  onChange={(e) =>
                    handleTimeSettingChange("timeStart", e.target.value)
                  }
                  className="border border-border rounded-md px-2 py-1 bg-transparent outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">End time</span>
                <input
                  type="time"
                  value={block.timeEnd || ""}
                  onChange={(e) =>
                    handleTimeSettingChange("timeEnd", e.target.value)
                  }
                  className="border border-border rounded-md px-2 py-1 bg-transparent outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Step (min)
                </span>
                <input
                  type="number"
                  min={1}
                  value={block.timeStep ?? ""}
                  onChange={(e) =>
                    handleTimeSettingChange("timeStep", e.target.value)
                  }
                  className="border border-border rounded-md px-2 py-1 w-20 bg-transparent outline-none"
                />
              </label>
            </div>
            <div className="mt-3">
              <input
                type="time"
                min={block.timeStart}
                max={block.timeEnd}
                step={block.timeStep ? block.timeStep * 60 : undefined}
                className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
              />
            </div>
          </div>
        );
      case "multiple-choice":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Question",
              "Multiple choice question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="flex flex-col gap-2">
              {(block.options || []).map((option, i) => (
                <div key={i} className="flex items-center gap-2 group/option">
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="text-sm text-foreground bg-transparent outline-none flex-1"
                  />
                  {(block.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="text-muted-foreground hover:text-destructive p-0.5 opacity-0 group-hover/option:opacity-100 transition-opacity"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-1"
              >
                <Plus className="h-3 w-3" />
                Add option
              </button>
            </div>
          </div>
        );
      case "checkboxes":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Question",
              "Checkboxes question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="flex flex-col gap-2">
              {(block.options || []).map((option, i) => (
                <div key={i} className="flex items-center gap-2 group/option">
                  <div className="w-4 h-4 rounded-sm border-2 border-muted-foreground/40 shrink-0" />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="text-sm text-foreground bg-transparent outline-none flex-1"
                  />
                  {(block.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="text-muted-foreground hover:text-destructive p-0.5 opacity-0 group-hover/option:opacity-100 transition-opacity"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-1"
              >
                <Plus className="h-3 w-3" />
                Add option
              </button>
            </div>
          </div>
        );
      case "dropdown":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Question",
              "Dropdown question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="flex flex-col gap-2">
              {(block.options || []).map((option, i) => (
                <div key={i} className="flex items-center gap-2 group/option">
                  <span className="text-xs text-muted-foreground w-4 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="text-sm text-foreground bg-transparent outline-none flex-1"
                  />
                  {(block.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="text-muted-foreground hover:text-destructive p-0.5 opacity-0 group-hover/option:opacity-100 transition-opacity"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-1"
              >
                <Plus className="h-3 w-3" />
                Add option
              </button>
            </div>
          </div>
        );
      case "multi-select":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Question",
              "Multi-select question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="flex flex-col gap-2">
              {(block.options || []).map((option, i) => (
                <div key={i} className="flex items-center gap-2 group/option">
                  <div className="w-4 h-4 rounded-sm border-2 border-muted-foreground/40 shrink-0 flex items-center justify-center">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className="text-muted-foreground/40"
                    >
                      <path
                        d="M1 5L4 8L9 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="text-sm text-foreground bg-transparent outline-none flex-1"
                  />
                  {(block.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="text-muted-foreground hover:text-destructive p-0.5 opacity-0 group-hover/option:opacity-100 transition-opacity"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-1"
              >
                <Plus className="h-3 w-3" />
                Add option
              </button>
            </div>
          </div>
        );
      case "linear-scale":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Question",
              "Linear scale question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-sm text-muted-foreground"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        );
      case "matrix":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Question",
              "Matrix question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2" />
                    {(block.columns || []).map((col, i) => (
                      <th key={i} className="p-2 text-center font-normal">
                        <input
                          type="text"
                          value={col}
                          onChange={(e) =>
                            handleColumnChange(i, e.target.value)
                          }
                          className="text-center text-sm text-foreground bg-transparent outline-none w-full"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(block.rows || []).map((row, ri) => (
                    <tr key={ri} className="border-t border-border">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row}
                          onChange={(e) => handleRowChange(ri, e.target.value)}
                          className="text-sm text-foreground bg-transparent outline-none"
                        />
                      </td>
                      {(block.columns || []).map((_, ci) => (
                        <td key={ci} className="p-2 text-center">
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 mx-auto" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "rating":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Question",
              "Rating question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="h-6 w-6 text-muted-foreground/30" />
              ))}
            </div>
          </div>
        );
      case "payment":
        return (
          <div className="w-full">
            {renderEditableLabel("Payment", "Payment question")}
            <div className="border border-border rounded-md p-4 flex items-center gap-3 text-muted-foreground pointer-events-none">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm">Payment collection field</span>
            </div>
          </div>
        );
      case "signature":
        return (
          <div className="w-full">
            {renderEditableLabel("Signature", "Signature question")}
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center text-muted-foreground pointer-events-none">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              <span className="text-sm mt-2">Draw signature here</span>
            </div>
          </div>
        );
      case "ranking":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Ranking question",
              "Ranking question",
              labelBaseClass.replace("mb-2", "mb-3"),
            )}
            <div className="flex flex-col gap-2">
              {(block.options || []).map((option, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border border-border rounded-md px-3 py-2 group/option"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  <span className="text-xs text-muted-foreground shrink-0">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="text-sm text-foreground bg-transparent outline-none flex-1"
                  />
                  {(block.options?.length || 0) > 1 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="text-muted-foreground hover:text-destructive p-0.5 opacity-0 group-hover/option:opacity-100 transition-opacity"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mt-1"
              >
                <Plus className="h-3 w-3" />
                Add item
              </button>
            </div>
          </div>
        );
      case "wallet-connect":
        return (
          <div className="w-full">
            {renderEditableLabel("Wallet Connect", "Wallet Connect question")}
            <div className="border border-border rounded-md p-4 flex items-center gap-3 text-muted-foreground pointer-events-none">
              <Wallet className="h-5 w-5" />
              <span className="text-sm">Connect your wallet</span>
            </div>
          </div>
        );
      case "file-upload":
        return (
          <div className="w-full">
            {renderEditableLabel("File upload", "File upload question")}
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center text-muted-foreground pointer-events-none">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-sm mt-2">Click or drag to upload</span>
            </div>
          </div>
        );
      case "divider":
        return (
          <div className="w-full py-2">
            <hr className="border-border" />
          </div>
        );
      case "image":
        return (
          <div className="w-full">
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center text-muted-foreground pointer-events-none">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="text-sm mt-2">Click to upload image</span>
            </div>
          </div>
        );
      case "page-break":
      case "new-page":
        return (
          <div className="w-full py-2 flex items-center gap-3">
            <hr className="border-border flex-1" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider shrink-0">
              {block.type === "new-page" ? "New page" : "Page break"}
            </span>
            <hr className="border-border flex-1" />
          </div>
        );
      default:
        // "text" block type - the editable empty block
        return (
          <div className="w-full">
            <div
              ref={textInputRef}
              contentEditable
              suppressContentEditableWarning
              className="text-sm text-foreground outline-none w-full empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30"
              data-placeholder="Type '/' to insert blocks"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              role="textbox"
              aria-label="Text block"
            />
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-0 py-1.5 rounded-md transition-all ${
        isDragOver ? "bg-accent/50 border-t-2 border-primary" : ""
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", block.id);
        onDragStart(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
        onDragOver(e);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => setIsDragOver(false)}
      onDragEnd={() => {
        setIsDragOver(false);
        onDragEnd();
      }}
    >
      {/* Action buttons */}
      <div
        className={`flex items-center gap-0.5 pt-0.5 shrink-0 transition-opacity ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-accent text-muted-foreground/50 hover:text-destructive transition-colors"
          aria-label="Delete block"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenInsertDialog();
          }}
          className="p-1 rounded hover:bg-accent text-muted-foreground/50 hover:text-foreground transition-colors"
          aria-label="Insert block"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div
          className="p-1 rounded hover:bg-accent text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Block content */}
      <div className="flex-1 min-w-0" onClick={onFocus}>
        {renderBlockContent()}
      </div>

      {/* Slash command menu */}
      <SlashCommandMenu
        isOpen={showSlashMenu}
        searchQuery={slashQuery}
        position={menuPosition}
        onSelect={handleSlashSelect}
        onClose={() => {
          setShowSlashMenu(false);
          setSlashQuery("");
        }}
      />
    </div>
  );
}
