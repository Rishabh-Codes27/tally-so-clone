"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Plus,
  GripVertical,
  Star,
  CreditCard,
  Wallet,
  ChevronDown,
} from "lucide-react";
import type {
  FormBlock,
  BlockType,
  ConditionalRule,
  ConditionOperator,
  ConditionalAction,
} from "./types";
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
  allBlocks?: FormBlock[];
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
  allBlocks = [],
}: FormBlockProps) {
  const textInputRef = useRef<HTMLDivElement>(null);
  const labelInputRef = useRef<HTMLDivElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!showSlashMenu) return;
    const handleReposition = () => updateMenuPosition();
    const ref = isTextBlock ? textInputRef : labelInputRef;
    const container = ref.current?.closest("[data-scroll-container='true']");
    container?.addEventListener("scroll", handleReposition, { passive: true });
    window.addEventListener("resize", handleReposition);
    return () => {
      container?.removeEventListener("scroll", handleReposition);
      window.removeEventListener("resize", handleReposition);
    };
  }, [showSlashMenu, updateMenuPosition, isTextBlock]);

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

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      onUpdate({ ...block, content: reader.result });
    };
    reader.readAsDataURL(file);
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
    if (isActive && block.type === "text" && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isActive, block.type]);

  // For non-text blocks, focus the label input on activation
  useEffect(() => {
    if (isActive && block.type !== "text" && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isActive, block.type]);

  useEffect(() => {
    const ref = block.type === "text" ? textInputRef : labelInputRef;
    if (!ref.current) return;
    if (document.activeElement === ref.current) return;
    const nextValue = block.content ?? "";
    if (ref.current.textContent !== nextValue) {
      ref.current.textContent = nextValue;
    }
  }, [block.content, block.type]);

  const labelBaseClass =
    "text-sm font-semibold text-foreground/90 outline-none mb-2 block w-full empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/45";

  const showFieldShell = ![
    "text",
    "title",
    "label",
    "heading1",
    "heading2",
    "heading3",
    "paragraph",
    "divider",
    "image",
    "video",
    "audio",
    "embed",
    "page-break",
    "new-page",
    "thank-you-page",
    "conditional-logic",
    "calculated-field",
    "hidden-field",
    "recaptcha",
  ].includes(block.type);

  const renderRequiredToggle = () => (
    <label className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
      <input
        type="checkbox"
        checked={block.required ?? false}
        onChange={(e) => onUpdate({ ...block, required: e.target.checked })}
        className="h-3.5 w-3.5"
      />
      Required
    </label>
  );

  const renderScaleSettings = () => (
    <div className="mt-3 flex flex-wrap items-end gap-3 text-xs text-muted-foreground">
      <label className="flex flex-col gap-1">
        <span>Min</span>
        <input
          type="number"
          value={block.scaleMin ?? 1}
          onChange={(e) =>
            onUpdate({
              ...block,
              scaleMin: Number(e.target.value || 1),
            })
          }
          className="border border-border/60 rounded-md px-2 py-1 w-20 bg-transparent text-foreground"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span>Max</span>
        <input
          type="number"
          value={block.scaleMax ?? 5}
          onChange={(e) =>
            onUpdate({
              ...block,
              scaleMax: Number(e.target.value || 5),
            })
          }
          className="border border-border/60 rounded-md px-2 py-1 w-20 bg-transparent text-foreground"
        />
      </label>
    </div>
  );

  const renderRatingSettings = () => (
    <div className="mt-3 flex items-end gap-3 text-xs text-muted-foreground">
      <label className="flex flex-col gap-1">
        <span>Max rating</span>
        <input
          type="number"
          min={1}
          value={block.ratingMax ?? 5}
          onChange={(e) =>
            onUpdate({
              ...block,
              ratingMax: Number(e.target.value || 5),
            })
          }
          className="border border-border/60 rounded-md px-2 py-1 w-24 bg-transparent text-foreground"
        />
      </label>
    </div>
  );

  const renderFileSettings = () => (
    <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
      <label className="flex flex-col gap-1">
        <span>Max size (MB)</span>
        <input
          type="number"
          min={1}
          max={1}
          step={1}
          value={1}
          disabled
          className="border border-border/60 rounded-md px-2 py-1 w-28 bg-transparent text-foreground opacity-60 cursor-not-allowed"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span>Allowed types (comma-separated)</span>
        <input
          type="text"
          value={(block.fileAllowedTypes || []).join(", ")}
          onChange={(e) =>
            onUpdate({
              ...block,
              fileAllowedTypes: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          placeholder="image/png, application/pdf"
          className="border border-border/60 rounded-md px-2 py-1 bg-transparent text-foreground"
        />
      </label>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
      <label className="flex flex-col gap-1">
        <span>Amount</span>
        <input
          type="number"
          min={0}
          step={0.01}
          value={block.paymentAmount ?? 10}
          onChange={(e) =>
            onUpdate({
              ...block,
              paymentAmount: Number(e.target.value || 0),
            })
          }
          className="border border-border/60 rounded-md px-2 py-1 bg-transparent text-foreground"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span>Currency</span>
        <input
          type="text"
          value={block.paymentCurrency ?? "USD"}
          onChange={(e) =>
            onUpdate({
              ...block,
              paymentCurrency: e.target.value.toUpperCase(),
            })
          }
          className="border border-border/60 rounded-md px-2 py-1 bg-transparent text-foreground"
        />
      </label>
      <label className="flex flex-col gap-1 sm:col-span-3">
        <span>Description</span>
        <input
          type="text"
          value={block.paymentDescription ?? "Payment"}
          onChange={(e) =>
            onUpdate({
              ...block,
              paymentDescription: e.target.value,
            })
          }
          className="border border-border/60 rounded-md px-2 py-1 bg-transparent text-foreground"
        />
      </label>
    </div>
  );

  const getFieldLabel = (fieldId: string): string => {
    const field = allBlocks.find((b) => b.id === fieldId);
    if (!field) return "Unknown";
    const type = field.type;
    const content = field.content?.trim() || type;
    return `${content}`;
  };

  const renderConditionalLogic = () => {
    const rules = block.conditionalRules || [];
    const fieldOptions = allBlocks.filter(
      (b) =>
        ![
          "text",
          "title",
          "label",
          "heading1",
          "heading2",
          "heading3",
          "paragraph",
          "divider",
          "page-break",
          "new-page",
          "thank-you-page",
          "conditional-logic",
          "image",
          "video",
          "audio",
          "embed",
        ].includes(b.type) && b.id !== block.id,
    );

    const operators: { value: ConditionOperator; label: string }[] = [
      { value: "equals", label: "Equals" },
      { value: "not_equals", label: "Not equals" },
      { value: "contains", label: "Contains" },
      { value: "not_contains", label: "Doesn't contain" },
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" },
      { value: "greater_or_equal", label: "≥" },
      { value: "less_or_equal", label: "≤" },
      { value: "is_empty", label: "Is empty" },
      { value: "is_not_empty", label: "Is not empty" },
      { value: "starts_with", label: "Starts with" },
      { value: "ends_with", label: "Ends with" },
    ];

    const actions: { value: ConditionalAction; label: string }[] = [
      { value: "show", label: "Show block" },
      { value: "hide", label: "Hide block" },
      { value: "require", label: "Make required" },
      { value: "optional", label: "Make optional" },
    ];

    const addRule = () => {
      const newRule: ConditionalRule = {
        id: Math.random().toString(36).slice(2, 10),
        fieldId: fieldOptions[0]?.id || "",
        operator: "equals",
        value: "",
        action: "show",
      };
      onUpdate({
        ...block,
        conditionalRules: [...rules, newRule],
      });
    };

    const updateRule = (index: number, updates: Partial<ConditionalRule>) => {
      const updatedRules = [...rules];
      updatedRules[index] = { ...updatedRules[index], ...updates };
      onUpdate({
        ...block,
        conditionalRules: updatedRules,
      });
    };

    const deleteRule = (index: number) => {
      const updatedRules = rules.filter((_, i) => i !== index);
      onUpdate({
        ...block,
        conditionalRules: updatedRules,
      });
    };

    return (
      <div className="mt-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span>Conditional logic</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              title="Learn about conditional logic"
            >
              <span className="text-base leading-none">ⓘ</span>
            </a>
          </div>
        </div>

        {rules.map((rule, index) => (
          <div key={rule.id} className="mb-3 p-3 bg-muted/20 rounded-md">
            <div className="flex gap-2 mb-2 flex-wrap items-end">
              <div className="text-xs font-medium text-muted-foreground">
                When
              </div>
              <select
                value={rule.fieldId}
                onChange={(e) => updateRule(index, { fieldId: e.target.value })}
                className="border border-border/60 rounded px-2 py-1 text-xs bg-transparent text-foreground"
              >
                {fieldOptions.map((field) => (
                  <option key={field.id} value={field.id}>
                    {getFieldLabel(field.id)}
                  </option>
                ))}
              </select>

              <select
                value={rule.operator}
                onChange={(e) =>
                  updateRule(index, {
                    operator: e.target.value as ConditionOperator,
                  })
                }
                className="border border-border/60 rounded px-2 py-1 text-xs bg-transparent text-foreground"
              >
                {operators.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              {!["is_empty", "is_not_empty"].includes(rule.operator) && (
                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRule(index, { value: e.target.value })}
                  placeholder="Value"
                  className="border border-border/60 rounded px-2 py-1 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/50 flex-1 min-w-[100px]"
                />
              )}
            </div>

            <div className="flex gap-2 items-end">
              <div className="text-xs font-medium text-muted-foreground">
                Then
              </div>
              <select
                value={rule.action}
                onChange={(e) =>
                  updateRule(index, {
                    action: e.target.value as ConditionalAction,
                  })
                }
                className="border border-border/60 rounded px-2 py-1 text-xs bg-transparent text-foreground flex-1"
              >
                {actions.map((action) => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => deleteRule(index)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                title="Delete rule"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addRule}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add condition
        </button>
      </div>
    );
  };

  const renderUrlSetting = (label: string, helperText?: string) => (
    <label className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <input
        type="text"
        value={block.content}
        onChange={(e) => onUpdate({ ...block, content: e.target.value })}
        placeholder="https://"
        className="border border-border/60 rounded-md px-2 py-1 bg-transparent text-foreground"
      />
      {helperText && (
        <span className="text-xs text-muted-foreground/70">{helperText}</span>
      )}
    </label>
  );

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
      case "title":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Title",
              "Title",
              "text-2xl font-semibold text-foreground outline-none w-full block empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30",
            )}
          </div>
        );
      case "label":
        return (
          <div className="w-full">
            {renderEditableLabel(
              "Label",
              "Label",
              "text-xs uppercase tracking-wider text-muted-foreground outline-none w-full block empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40",
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
            <div className="border-b border-border/60 py-2 text-sm text-muted-foreground/80 pointer-events-none max-w-sm">
              Short answer text
            </div>
            {renderRequiredToggle()}
          </div>
        );
      case "long-answer":
        return (
          <div className="w-full">
            {renderEditableLabel("Question", "Long answer question")}
            <div className="border border-border/60 rounded-md p-3 h-20 text-sm text-muted-foreground/80 pointer-events-none">
              Long answer text
            </div>
            {renderRequiredToggle()}
          </div>
        );
      case "email":
        return (
          <div className="w-full">
            {renderEditableLabel("Email address", "Email question")}
            <div className="border-b border-border/60 py-2 text-sm text-muted-foreground/80 pointer-events-none flex items-center gap-2 max-w-sm">
              <span>@</span> name@example.com
            </div>
            {renderRequiredToggle()}
          </div>
        );
      case "number":
        return (
          <div className="w-full">
            {renderEditableLabel("Number question", "Number question")}
            <div className="border-b border-border/60 py-2 text-sm text-muted-foreground/80 pointer-events-none max-w-sm">
              0
            </div>
            {renderRequiredToggle()}
          </div>
        );
      case "url":
        return (
          <div className="w-full">
            {renderEditableLabel("URL", "URL question")}
            <div className="border-b border-border/60 py-2 text-sm text-muted-foreground/80 pointer-events-none max-w-sm">
              https://
            </div>
            {renderRequiredToggle()}
          </div>
        );
      case "phone":
        return (
          <div className="w-full">
            {renderEditableLabel("Phone number", "Phone question")}
            <div className="border-b border-border/60 py-2 text-sm text-muted-foreground/80 pointer-events-none max-w-sm">
              +1 (555) 000-0000
            </div>
            {renderRequiredToggle()}
          </div>
        );
      case "date":
        return (
          <div className="w-full">
            {renderEditableLabel("Date", "Date question")}
            <div className="border border-border/60 rounded-md px-3 py-2 text-sm text-muted-foreground/80 pointer-events-none inline-flex items-center gap-2">
              MM / DD / YYYY
            </div>
            {renderRequiredToggle()}
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
                  className="border border-border/60 rounded-md px-2 py-1 bg-transparent outline-none"
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
                  className="border border-border/60 rounded-md px-2 py-1 bg-transparent outline-none"
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
                  className="border border-border/60 rounded-md px-2 py-1 w-20 bg-transparent outline-none"
                />
              </label>
            </div>
            <div className="mt-3">
              <input
                type="time"
                min={block.timeStart}
                max={block.timeEnd}
                step={block.timeStep ? block.timeStep * 60 : undefined}
                className="border border-border/60 rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
              />
            </div>
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
              {Array.from(
                { length: (block.scaleMax ?? 5) - (block.scaleMin ?? 1) + 1 },
                (_, index) => (block.scaleMin ?? 1) + index,
              ).map((n) => (
                <div
                  key={n}
                  className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-sm text-muted-foreground"
                >
                  {n}
                </div>
              ))}
            </div>
            {renderScaleSettings()}
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
              {Array.from(
                { length: block.ratingMax ?? 5 },
                (_, i) => i + 1,
              ).map((n) => (
                <Star key={n} className="h-6 w-6 text-muted-foreground/30" />
              ))}
            </div>
            {renderRatingSettings()}
            {renderRequiredToggle()}
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
            {renderPaymentSettings()}
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
            {renderRequiredToggle()}
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
            {renderFileSettings()}
            {renderRequiredToggle()}
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
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center text-muted-foreground">
              {block.content ? (
                <img
                  src={block.content}
                  alt={block.content ? "Uploaded" : ""}
                  className="max-h-48 w-full object-contain rounded-md border border-border/50 bg-background"
                />
              ) : (
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
              )}
              <span className="text-sm mt-2">
                {block.content ? "Replace image" : "Click to upload image"}
              </span>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleImageSelect(file);
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="mt-3 px-3 py-1.5 rounded-md border border-border text-xs text-foreground hover:bg-muted"
              >
                Upload image
              </button>
              {block.content ? (
                <button
                  type="button"
                  onClick={() => onUpdate({ ...block, content: "" })}
                  className="mt-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove image
                </button>
              ) : null}
            </div>
          </div>
        );
      case "video":
        return (
          <div className="w-full">
            {renderEditableLabel("Video", "Video block")}
            {renderUrlSetting(
              "Video URL",
              "Direct video URL: .mp4, .webm, or .ogg file",
            )}
          </div>
        );
      case "audio":
        return (
          <div className="w-full">
            {renderEditableLabel("Audio", "Audio block")}
            {renderUrlSetting(
              "Audio URL",
              "Direct audio URL: .mp3, .wav, or .ogg file",
            )}
          </div>
        );
      case "embed":
        return (
          <div className="w-full">
            {renderEditableLabel("Embed", "Embed block")}
            {renderUrlSetting(
              "Embed URL",
              "Paste only the URL from the src attribute, e.g., https://www.youtube.com/embed/VIDEO_ID",
            )}
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
      case "thank-you-page":
        return (
          <div className="w-full">
            {renderEditableLabel("Thank you", "Thank you page")}
            <div className="mt-3 rounded-md border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              Submission success message
            </div>
          </div>
        );
      case "conditional-logic":
        return (
          <div className="w-full">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <span>🔀 Conditional Logic</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Conditional logic guides respondents through dynamic form paths"
              >
                <span className="text-base leading-none">ⓘ</span>
              </a>
            </div>
            {renderConditionalLogic()}
          </div>
        );
      case "calculated-field":
        return (
          <div className="w-full text-sm text-muted-foreground">
            Calculated fields will be configured in a future step.
          </div>
        );
      case "hidden-field":
        return (
          <div className="w-full text-sm text-muted-foreground">
            Hidden field values are set via URL parameters.
          </div>
        );
      case "recaptcha":
        return (
          <div className="w-full text-sm text-muted-foreground">
            reCAPTCHA will appear on the public form.
          </div>
        );
      case "respondent-country":
        return (
          <div className="w-full">
            {renderEditableLabel("Respondent's country", "Respondent country")}
            <div className="border border-border/60 rounded-md px-3 py-2 text-sm text-muted-foreground">
              Auto-detected on submit
            </div>
            {renderRequiredToggle()}
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
              className="text-sm text-foreground/90 outline-none w-full empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40"
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
      data-block-id={block.id}
      className={`group relative flex items-start gap-3 py-2 rounded-md transition-all ${
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
        className={`-ml-9 flex items-center gap-0.5 pt-1 shrink-0 transition-opacity ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-accent text-muted-foreground/40 hover:text-destructive transition-colors"
          aria-label="Delete block"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenInsertDialog();
          }}
          className="p-1 rounded hover:bg-accent text-muted-foreground/40 hover:text-foreground transition-colors"
          aria-label="Insert block"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div
          className="p-1 rounded hover:bg-accent text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Block content */}
      <div
        className={`flex-1 min-w-0 ${
          showFieldShell
            ? "rounded-md border border-border/40 px-4 py-3 bg-background"
            : ""
        }`}
        onClick={onFocus}
      >
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
