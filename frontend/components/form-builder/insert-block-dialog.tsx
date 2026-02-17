"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Search, Plus, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react";
import { SLASH_COMMANDS, type BlockType } from "./types";
import { BlockIcon } from "./block-icons";

interface InsertBlockDialogProps {
  isOpen: boolean;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

export function InsertBlockDialog({
  isOpen,
  onSelect,
  onClose,
}: InsertBlockDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const backdropRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      SLASH_COMMANDS.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.category.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const grouped = useMemo(() => {
    const g: Record<string, typeof SLASH_COMMANDS> = {};
    for (const cmd of filtered) {
      if (!g[cmd.category]) g[cmd.category] = [];
      g[cmd.category].push(cmd);
    }
    return g;
  }, [filtered]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      itemRefs.current.clear();
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const el = itemRefs.current.get(selectedIndex);
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Close on escape key even when dialog container isn't focused
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex].type);
        }
      }
    },
    [filtered, selectedIndex, onSelect],
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const selectedCommand = filtered[selectedIndex];

  const renderPreview = (type: BlockType) => {
    switch (type) {
      case "heading1":
        return <div className="text-2xl font-bold">Heading 1</div>;
      case "heading2":
        return <div className="text-xl font-bold">Heading 2</div>;
      case "heading3":
        return <div className="text-lg font-semibold">Heading 3</div>;
      case "title":
        return <div className="text-xl font-semibold">Title</div>;
      case "label":
        return (
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Label
          </div>
        );
      case "paragraph":
        return (
          <p className="text-sm text-muted-foreground">
            This is a paragraph block for supporting text.
          </p>
        );
      case "short-answer":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Short answer</label>
            <div className="border-b border-border py-2 text-xs text-muted-foreground">
              Short answer text
            </div>
          </div>
        );
      case "long-answer":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Long answer</label>
            <div className="border border-border rounded-md p-3 h-20 text-xs text-muted-foreground">
              Long answer text
            </div>
          </div>
        );
      case "email":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Email</label>
            <div className="border-b border-border py-2 text-xs text-muted-foreground">
              name@example.com
            </div>
          </div>
        );
      case "number":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Number</label>
            <div className="border-b border-border py-2 text-xs text-muted-foreground">
              0
            </div>
          </div>
        );
      case "url":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">URL</label>
            <div className="border-b border-border py-2 text-xs text-muted-foreground">
              https://
            </div>
          </div>
        );
      case "phone":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Phone</label>
            <div className="border-b border-border py-2 text-xs text-muted-foreground">
              +1 (555) 000-0000
            </div>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Date</label>
            <div className="border border-border rounded-md px-3 py-2 text-xs text-muted-foreground">
              MM / DD / YYYY
            </div>
          </div>
        );
      case "time":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Time</label>
            <div className="border border-border rounded-md px-3 py-2 text-xs text-muted-foreground">
              09:00
            </div>
          </div>
        );
      case "multiple-choice":
        return (
          <fieldset className="flex flex-col gap-2">
            <legend className="text-xs font-medium">Multiple choice</legend>
            {"Option 1, Option 2".split(", ").map((label) => (
              <label key={label} className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full border border-border" />
                {label}
              </label>
            ))}
          </fieldset>
        );
      case "checkboxes":
        return (
          <fieldset className="flex flex-col gap-2">
            <legend className="text-xs font-medium">Checkboxes</legend>
            {"Option 1, Option 2".split(", ").map((label) => (
              <label key={label} className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded border border-border" />
                {label}
              </label>
            ))}
          </fieldset>
        );
      case "dropdown":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Dropdown</label>
            <div className="border border-border rounded-md px-3 py-2 text-xs text-muted-foreground">
              Select an option
            </div>
          </div>
        );
      case "linear-scale":
        return (
          <fieldset className="flex items-center gap-3 text-xs">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full border border-border" />
                {n}
              </label>
            ))}
          </fieldset>
        );
      case "rating":
        return (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {"★★★★★"}
          </div>
        );
      case "matrix":
        return (
          <div className="text-xs text-muted-foreground">
            Matrix grid preview
          </div>
        );
      case "file-upload":
        return (
          <div className="text-xs text-muted-foreground border border-dashed border-border rounded-md px-3 py-2">
            Upload a file
          </div>
        );
      case "video":
        return (
          <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
            Video embed
          </div>
        );
      case "audio":
        return (
          <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
            Audio embed
          </div>
        );
      case "embed":
        return (
          <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
            Embed URL
          </div>
        );
      case "payment":
        return (
          <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
            Card number
          </div>
        );
      case "signature":
        return (
          <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
            Type your name
          </div>
        );
      case "ranking":
        return (
          <div className="flex flex-col gap-2 text-xs">
            {"Item 1, Item 2".split(", ").map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border border-border text-[10px] flex items-center justify-center">
                  {index + 1}
                </div>
                {label}
              </div>
            ))}
          </div>
        );
      case "divider":
        return <div className="h-px w-full bg-border" />;
      case "image":
        return (
          <div className="h-20 w-full rounded-md border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
            Image
          </div>
        );
      case "respondent-country":
        return (
          <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
            Country
          </div>
        );
      case "recaptcha":
        return (
          <div className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2">
            reCAPTCHA
          </div>
        );
      case "hidden-field":
      case "conditional-logic":
      case "calculated-field":
        return (
          <div className="text-xs text-muted-foreground">
            Configure in settings
          </div>
        );
      case "page-break":
      case "new-page":
        return <div className="text-xs text-muted-foreground">New page</div>;
      case "thank-you-page":
        return (
          <div className="text-xs text-muted-foreground">Thank you page</div>
        );
      case "text":
        return (
          <div className="text-xs text-muted-foreground">
            Type / to add a block
          </div>
        );
      default:
        return <div className="text-xs text-muted-foreground">Preview</div>;
    }
  };

  if (!isOpen) return null;

  let flatIndex = 0;

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
                    const currentIndex = flatIndex;
                    flatIndex++;
                    return (
                      <button
                        key={`${cmd.type}-${cmd.category}`}
                        ref={(el) => {
                          if (el) {
                            itemRefs.current.set(currentIndex, el);
                          } else {
                            itemRefs.current.delete(currentIndex);
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
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Right panel - help / info */}
          <div className="flex-1 flex flex-col px-8 py-6">
            {selectedCommand ? (
              <>
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground">Preview</div>
                  <div className="text-base font-semibold text-foreground">
                    {selectedCommand.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCommand.description}
                  </div>
                </div>
                <div className="flex-1 rounded-lg border border-border bg-background p-4">
                  {renderPreview(selectedCommand.type)}
                </div>
                <div className="mt-6 text-xs text-muted-foreground">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-secondary text-[10px] align-middle">
                    <ArrowUp className="h-3 w-3" />
                  </span>
                  <span className="mx-1">/</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-secondary text-[10px] align-middle">
                    <ArrowDown className="h-3 w-3" />
                  </span>
                  <span className="ml-2">Navigate,</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded border border-border bg-secondary text-[10px] align-middle ml-2">
                    <CornerDownLeft className="h-3 w-3" />
                  </span>
                  <span className="ml-2">Insert</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
