"use client";

import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { FormBlock } from "@/components/form-builder/types";
import { getLabel } from "./labels";

interface PublicFormFieldsProps {
  blocks: FormBlock[];
  answers: Record<string, unknown>;
  onChange: (blockId: string, value: unknown) => void;
  errors?: Record<string, string>;
}

function SignaturePad({
  value,
  onChange,
}: {
  value?: string;
  onChange: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(false);
    onChange(canvas.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        width={520}
        height={140}
        className="w-full rounded-md border border-border bg-background"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={endDrawing}
        onPointerLeave={endDrawing}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{value ? "Signature captured" : "Draw your signature"}</span>
        <button type="button" onClick={clear} className="text-primary">
          Clear
        </button>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function PublicFormFields({
  blocks,
  answers,
  onChange,
  errors,
}: PublicFormFieldsProps) {
  const errorMap = errors || {};
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const optionMap = useMemo(
    () => new Map(blocks.map((block) => [block.id, block.options || []])),
    [blocks],
  );

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => {
        const error = errorMap[block.id] ?? fileErrors[block.id];
        switch (block.type) {
          case "text":
            return block.content?.trim() ? (
              <p key={block.id} className="text-base leading-relaxed">
                {block.content}
              </p>
            ) : null;
          case "title":
            return (
              <h2 key={block.id} className="text-2xl font-semibold">
                {getLabel(block)}
              </h2>
            );
          case "label":
            return (
              <p
                key={block.id}
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                {getLabel(block)}
              </p>
            );
          case "heading1":
            return (
              <h2 key={block.id} className="text-3xl font-bold">
                {getLabel(block)}
              </h2>
            );
          case "heading2":
            return (
              <h3 key={block.id} className="text-2xl font-bold">
                {getLabel(block)}
              </h3>
            );
          case "heading3":
            return (
              <h4 key={block.id} className="text-xl font-semibold">
                {getLabel(block)}
              </h4>
            );
          case "paragraph":
            return (
              <p key={block.id} className="text-base leading-relaxed">
                {getLabel(block)}
              </p>
            );
          case "short-answer":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="text"
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border-b border-border py-2 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "long-answer":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <textarea
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border border-border rounded-md p-3 h-24 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "email":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="email"
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border-b border-border py-2 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "number":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="number"
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border-b border-border py-2 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "url":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="url"
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border-b border-border py-2 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "phone":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="tel"
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border-b border-border py-2 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "date":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="date"
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "time":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="time"
                  min={block.timeStart}
                  max={block.timeEnd}
                  step={block.timeStep ? block.timeStep * 60 : undefined}
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-transparent outline-none"
                />
                <FieldError message={error} />
              </div>
            );
          case "multiple-choice":
            return (
              <fieldset key={block.id} className="flex flex-col gap-2">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                {(block.options || []).map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name={`mc-${block.id}`}
                      onChange={() => onChange(block.id, option)}
                      className="h-4 w-4"
                    />
                    {option}
                  </label>
                ))}
                <FieldError message={error} />
              </fieldset>
            );
          case "checkboxes":
            return (
              <fieldset key={block.id} className="flex flex-col gap-2">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                {(block.options || []).map((option, index) => {
                  const current = (answers[block.id] as string[]) || [];
                  const checked = current.includes(option);
                  return (
                    <label
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...current, option]
                            : current.filter((item) => item !== option);
                          onChange(block.id, next);
                        }}
                        className="h-4 w-4"
                      />
                      {option}
                    </label>
                  );
                })}
                <FieldError message={error} />
              </fieldset>
            );
          case "dropdown":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <select
                  onChange={(e) => onChange(block.id, e.target.value)}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-transparent outline-none"
                >
                  <option value="">Select</option>
                  {(block.options || []).map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError message={error} />
              </div>
            );
          case "multi-select":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <select
                  multiple
                  onChange={(e) => {
                    const next = Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value,
                    );
                    onChange(block.id, next);
                  }}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-transparent outline-none"
                >
                  {(block.options || []).map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <FieldError message={error} />
              </div>
            );
          case "linear-scale":
            return (
              <fieldset key={block.id} className="flex flex-col gap-2">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                <div className="flex items-center gap-4">
                  {Array.from(
                    {
                      length: (block.scaleMax ?? 5) - (block.scaleMin ?? 1) + 1,
                    },
                    (_, i) => (block.scaleMin ?? 1) + i,
                  ).map((n) => (
                    <label key={n} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`scale-${block.id}`}
                        onChange={() => onChange(block.id, n)}
                        className="h-4 w-4"
                      />
                      {n}
                    </label>
                  ))}
                </div>
                <FieldError message={error} />
              </fieldset>
            );
          case "matrix":
            return (
              <fieldset key={block.id} className="flex flex-col gap-3">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="p-2" />
                        {(block.columns || []).map((col, ci) => (
                          <th
                            key={ci}
                            className="p-2 text-center font-normal text-muted-foreground"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(block.rows || []).map((row, ri) => (
                        <tr key={ri} className="border-t border-border">
                          <td className="p-2 text-foreground">{row}</td>
                          {(block.columns || []).map((col, ci) => {
                            const current =
                              (answers[block.id] as Record<string, string>) ||
                              {};
                            return (
                              <td key={ci} className="p-2 text-center">
                                <input
                                  type="radio"
                                  name={`matrix-${block.id}-${ri}`}
                                  checked={current[row] === col}
                                  onChange={() =>
                                    onChange(block.id, {
                                      ...current,
                                      [row]: col,
                                    })
                                  }
                                  className="h-4 w-4"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <FieldError message={error} />
              </fieldset>
            );
          case "rating":
            return (
              <fieldset key={block.id} className="flex flex-col gap-2">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                <div className="flex items-center gap-3">
                  {Array.from(
                    { length: block.ratingMax ?? 5 },
                    (_, i) => i + 1,
                  ).map((n) => (
                    <label key={n} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`rating-${block.id}`}
                        onChange={() => onChange(block.id, n)}
                        className="h-4 w-4"
                      />
                      {n}
                    </label>
                  ))}
                </div>
                <FieldError message={error} />
              </fieldset>
            );
          case "ranking": {
            const options = optionMap.get(block.id) || [];
            const selected = (answers[block.id] as string[]) || [];
            const ranks = options.map((option, index) =>
              selected[index] ? selected[index] : option,
            );
            return (
              <fieldset key={block.id} className="flex flex-col gap-3">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                {options.map((option, index) => (
                  <div key={option} className="flex items-center gap-3 text-sm">
                    <span className="w-6 text-muted-foreground">
                      {index + 1}.
                    </span>
                    <span className="flex-1">{option}</span>
                    <select
                      value={ranks[index]}
                      onChange={(e) => {
                        const next = [...ranks];
                        next[index] = e.target.value;
                        onChange(block.id, next);
                      }}
                      className="border border-border rounded-md px-2 py-1 text-sm bg-transparent outline-none"
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <FieldError message={error} />
              </fieldset>
            );
          }
          case "payment":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <div className="rounded-md border border-border/60 px-3 py-2 text-sm text-muted-foreground">
                  {block.paymentDescription ?? "Payment"} ·{" "}
                  {block.paymentAmount ?? 0} {block.paymentCurrency ?? "USD"}
                </div>
                <button
                  type="button"
                  disabled
                  className="w-fit px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm font-semibold cursor-not-allowed"
                >
                  Payments coming soon
                </button>
              </div>
            );
          case "signature":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <SignaturePad
                  value={(answers[block.id] as string) || ""}
                  onChange={(value) => onChange(block.id, value)}
                />
                <FieldError message={error} />
              </div>
            );
          case "wallet-connect":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <button
                  type="button"
                  disabled
                  className="w-fit px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm font-semibold cursor-not-allowed"
                >
                  Wallet connect coming soon
                </button>
              </div>
            );
          case "file-upload": {
            const handleFileSelect = (file: File) => {
              const maxBytes = (block.fileMaxSizeMb ?? 0.5) * 1024 * 1024;
              if (file.size > maxBytes) {
                setFileErrors((prev) => ({
                  ...prev,
                  [block.id]: `File exceeds ${(block.fileMaxSizeMb ?? 0.5).toFixed(1)}MB limit.`,
                }));
                return;
              }
              setFileErrors((prev) => {
                if (!prev[block.id]) return prev;
                const next = { ...prev };
                delete next[block.id];
                return next;
              });
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result !== "string") return;
                onChange(block.id, {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  data: reader.result,
                });
              };
              reader.readAsDataURL(file);
            };

            const [isDragOver, setIsDragOver] = useState(false);
            const fileInputRef = useRef<HTMLInputElement>(null);
            const currentFile = answers[block.id] as
              | { name?: string }
              | undefined;

            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  } ${fileErrors[block.id] ? "border-destructive" : ""}`}
                >
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 16v-4m0 0V8m0 4h4m-4 0H8M7 6h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2z"
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {currentFile?.name ? (
                        <span className="text-foreground font-medium">
                          {currentFile.name}
                        </span>
                      ) : (
                        <>
                          <span className="block font-medium text-foreground">
                            Drag and drop your file here
                          </span>
                          <span className="text-xs">or</span>
                        </>
                      )}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={(block.fileAllowedTypes || []).join(",")}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Choose file
                  </button>
                  {(block.fileMaxSizeMb || block.fileAllowedTypes?.length) && (
                    <p className="text-xs text-muted-foreground">
                      {block.fileMaxSizeMb && (
                        <span>
                          Max size: {block.fileMaxSizeMb.toFixed(1)}MB
                        </span>
                      )}
                      {block.fileMaxSizeMb &&
                        block.fileAllowedTypes?.length && <span> • </span>}
                      {block.fileAllowedTypes?.length && (
                        <span>
                          {block.fileAllowedTypes.slice(0, 2).join(", ")}
                          {block.fileAllowedTypes.length > 2 &&
                            ` +${block.fileAllowedTypes.length - 2}`}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <FieldError message={fileErrors[block.id] || error} />
              </div>
            );
          }
          case "image":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                {block.content ? (
                  <img
                    src={block.content}
                    alt={getLabel(block)}
                    className="rounded-md border border-border/40"
                  />
                ) : null}
              </div>
            );
          case "divider":
            return <hr key={block.id} className="border-border" />;
          case "video":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                {block.content ? (
                  <video
                    controls
                    className="w-full rounded-md border border-border/40"
                  >
                    <source src={block.content} />
                  </video>
                ) : null}
              </div>
            );
          case "audio":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                {block.content ? (
                  <audio controls className="w-full">
                    <source src={block.content} />
                  </audio>
                ) : null}
              </div>
            );
          case "embed":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                {block.content ? (
                  <iframe
                    src={block.content}
                    className="w-full min-h-[240px] rounded-md border border-border/40"
                    title={getLabel(block)}
                  />
                ) : null}
              </div>
            );
          case "page-break":
          case "new-page":
            return (
              <div key={block.id} className="flex items-center gap-3">
                <hr className="border-border flex-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {block.type === "new-page" ? "New page" : "Page break"}
                </span>
                <hr className="border-border flex-1" />
              </div>
            );
          case "respondent-country":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="text-sm font-medium">{getLabel(block)}</label>
                <input
                  type="text"
                  value={(answers[block.id] as string) || ""}
                  readOnly
                  className="border border-border rounded-md px-3 py-2 text-sm bg-muted text-muted-foreground"
                />
                <FieldError message={error} />
              </div>
            );
          case "recaptcha":
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      onChange(block.id, e.target.checked ? "verified" : "")
                    }
                    className="h-4 w-4"
                  />
                  I am not a robot
                </label>
                <FieldError message={error} />
              </div>
            );
          case "hidden-field":
          case "conditional-logic":
          case "calculated-field":
          case "thank-you-page":
            return null;
          default:
            return (
              <div key={block.id} className="text-sm text-muted-foreground">
                {getLabel(block)}
              </div>
            );
        }
      })}
    </div>
  );
}
