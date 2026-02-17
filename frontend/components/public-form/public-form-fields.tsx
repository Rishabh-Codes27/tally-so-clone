"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { FormBlock } from "@/components/form-builder/types";
import { getLabel } from "./labels";
import { shouldShowBlock, shouldBeRequired } from "@/lib/conditional-logic";
import PhoneInput, {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

const PHONE_INPUT_PATTERN = /^\+?\d*$/;
const MAX_PHONE_NATIONAL_DIGITS = 10;

interface PublicFormFieldsProps {
  blocks: FormBlock[];
  answers: Record<string, unknown>;
  onChange: (blockId: string, value: unknown) => void;
  errors?: Record<string, string>;
}

function getApplicableConditionalRules(
  blockIndex: number,
  blocks: FormBlock[],
): FormBlock[] {
  // Find all conditional-logic blocks that appear before this block
  const applicableLogicBlocks: FormBlock[] = [];
  for (let i = blockIndex - 1; i >= 0; i--) {
    if (blocks[i].type === "conditional-logic") {
      applicableLogicBlocks.push(blocks[i]);
      // Keep going to find all conditional-logic blocks before this one
      // (they may all apply, or we stop at the most recent one)
    } else if (
      blocks[i].type === "new-page" ||
      blocks[i].type === "page-break"
    ) {
      // Stop at page breaks - conditional logic doesn't cross pages
      break;
    }
  }
  return applicableLogicBlocks.reverse(); // Return in chronological order
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

  const getCoordinates = (
    e: ReactPointerEvent<HTMLCanvasElement>,
  ): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return [x, y];
  };

  const startDrawing = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [x, y] = getCoordinates(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [x, y] = getCoordinates(e);
    ctx.lineTo(x, y);
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
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [draggingItem, setDraggingItem] = useState<
    Record<string, string | null>
  >({});
  const [dragOverItem, setDragOverItem] = useState<
    Record<string, string | null>
  >({});
  const [detectedCountry, setDetectedCountry] = useState<Country | undefined>(
    undefined,
  );
  const [manualCountrySelection, setManualCountrySelection] = useState<
    Record<string, boolean>
  >({});
  const [phoneCountries, setPhoneCountries] = useState<
    Record<string, Country | undefined>
  >({});
  const [manualPhoneCountry, setManualPhoneCountry] = useState<
    Record<string, boolean>
  >({});
  const defaultCountry = useMemo<Country | undefined>(() => {
    if (typeof navigator === "undefined") return undefined;
    const locale = navigator.language || "";
    const parts = locale.split("-");
    const country = parts.length > 1 ? parts[1].toUpperCase() : "";
    return country ? (country as Country) : undefined;
  }, []);
  const countryOptions = useMemo(() => {
    const locale = typeof navigator !== "undefined" ? navigator.language : "en";
    const displayNames =
      typeof Intl !== "undefined" && "DisplayNames" in Intl
        ? new Intl.DisplayNames([locale], { type: "region" })
        : null;
    return getCountries()
      .map((code) => ({
        code,
        name: displayNames?.of(code) ?? code,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const optionMap = useMemo(
    () => new Map(blocks.map((block) => [block.id, block.options || []])),
    [blocks],
  );

  useEffect(() => {
    if (detectedCountry || typeof navigator === "undefined") return;
    if (!navigator.geolocation) {
      setDetectedCountry(defaultCountry);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          if (!response.ok) throw new Error("Geocode failed");
          const data = (await response.json()) as { countryCode?: string };
          const code = data.countryCode?.toUpperCase();
          setDetectedCountry(
            code ? (code as Country) : (defaultCountry ?? undefined),
          );
        } catch {
          setDetectedCountry(defaultCountry);
        }
      },
      () => setDetectedCountry(defaultCountry),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 },
    );
  }, [defaultCountry, detectedCountry]);

  useEffect(() => {
    const country = detectedCountry ?? defaultCountry;
    if (!country) return;
    blocks.forEach((block) => {
      if (block.type === "respondent-country") {
        if (manualCountrySelection[block.id]) return;
        if (answers[block.id] !== country) {
          onChange(block.id, country);
        }
      }
      if (block.type === "phone") {
        if (manualPhoneCountry[block.id]) return;
        if (phoneCountries[block.id] !== country) {
          setPhoneCountries((prev) => ({ ...prev, [block.id]: country }));
        }
      }
    });
  }, [
    answers,
    blocks,
    defaultCountry,
    detectedCountry,
    manualCountrySelection,
    manualPhoneCountry,
    onChange,
    phoneCountries,
  ]);

  const setInputError = (
    blockId: string,
    hasError: boolean,
    message = "Only numbers are allowed.",
  ) => {
    if (hasError) {
      setInputErrors((prev) => ({
        ...prev,
        [blockId]: message,
      }));
      return;
    }

    setInputErrors((prev) => {
      if (!prev[blockId]) return prev;
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
  };

  const normalizeNumberInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const hasLeadingMinus = cleaned.startsWith("-");
    const withoutMinus = cleaned.replace(/-/g, "");
    const [intPart, ...decimals] = withoutMinus.split(".");
    const decimalPart = decimals.length ? `.${decimals.join("")}` : "";
    return `${hasLeadingMinus ? "-" : ""}${intPart}${decimalPart}`;
  };

  const normalizePhoneInput = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) {
      return "+" + cleaned.slice(1).replace(/\+/g, "");
    }
    return cleaned.replace(/\+/g, "");
  };

  const applyPhoneLimit = (value: string, country?: Country) => {
    const normalized = normalizePhoneInput(value);
    const digits = normalized.replace(/\D/g, "");
    if (!country) return { normalized, exceeded: false };
    const countryCode = getCountryCallingCode(country);
    if (!digits.startsWith(countryCode)) {
      return { normalized, exceeded: false };
    }
    const national = digits.slice(countryCode.length);
    if (national.length <= MAX_PHONE_NATIONAL_DIGITS) {
      return { normalized, exceeded: false };
    }
    const trimmed = national.slice(0, MAX_PHONE_NATIONAL_DIGITS);
    return {
      normalized: `+${countryCode}${trimmed}`,
      exceeded: true,
    };
  };

  const handlePhoneChange = (blockId: string, value: string) => {
    const country =
      phoneCountries[blockId] ?? detectedCountry ?? defaultCountry;
    const { normalized, exceeded } = applyPhoneLimit(value, country);
    if (exceeded) {
      setInputError(blockId, false);
      onChange(blockId, normalized);
      return;
    }
    setInputError(
      blockId,
      !PHONE_INPUT_PATTERN.test(normalized),
      "Only numbers and + are allowed.",
    );
    onChange(blockId, normalized);
  };

  const handleNumberChange = (blockId: string, raw: string) => {
    const normalized = normalizeNumberInput(raw);
    setInputError(
      blockId,
      raw !== normalized,
      "Only numbers, - and . are allowed.",
    );
    onChange(blockId, normalized);
  };

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, blockIndex) => {
        // Skip rendering the conditional-logic block itself
        if (block.type === "conditional-logic") {
          return null;
        }

        // Get conditional rules from preceding conditional-logic blocks
        const conditionalLogicBlocks = getApplicableConditionalRules(
          blockIndex,
          blocks,
        );
        const allRules = [
          ...conditionalLogicBlocks.flatMap((b) => b.conditionalRules || []),
          ...(block.conditionalRules || []),
        ];

        // Check if block should be shown based on conditional logic
        if (
          !shouldShowBlock(allRules.length > 0 ? allRules : undefined, answers)
        ) {
          return null;
        }

        const error =
          errorMap[block.id] ?? inputErrors[block.id] ?? fileErrors[block.id];
        const isRequired =
          block.required ||
          shouldBeRequired(allRules.length > 0 ? allRules : undefined, answers);

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
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={
                    typeof answers[block.id] === "number"
                      ? String(answers[block.id])
                      : typeof answers[block.id] === "string"
                        ? (answers[block.id] as string)
                        : ""
                  }
                  onChange={(e) => handleNumberChange(block.id, e.target.value)}
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
                <PhoneInput
                  defaultCountry={detectedCountry ?? defaultCountry}
                  country={
                    phoneCountries[block.id] ??
                    detectedCountry ??
                    defaultCountry
                  }
                  onCountryChange={(country) => {
                    setManualPhoneCountry((prev) => ({
                      ...prev,
                      [block.id]: true,
                    }));
                    setPhoneCountries((prev) => ({
                      ...prev,
                      [block.id]: country,
                    }));
                  }}
                  value={
                    typeof answers[block.id] === "string"
                      ? (answers[block.id] as string)
                      : ""
                  }
                  onChange={(value) => handlePhoneChange(block.id, value ?? "")}
                  international
                  withCountryCallingCode
                  countryCallingCodeEditable
                  className="phone-input"
                  numberInputProps={{
                    className: "bg-transparent outline-none text-sm",
                  }}
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
            const ranks = selected.length ? selected : options;
            const activeDrag = draggingItem[block.id];
            const activeOver = dragOverItem[block.id];
            return (
              <fieldset key={block.id} className="flex flex-col gap-3">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                <p className="text-xs text-muted-foreground">
                  Drag items to rank them in order.
                </p>
                <div className="flex flex-col gap-2">
                  {ranks.map((option, index) => (
                    <div
                      key={option}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", option);
                        event.dataTransfer.effectAllowed = "move";
                        setDraggingItem((prev) => ({
                          ...prev,
                          [block.id]: option,
                        }));
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragOverItem((prev) => ({
                          ...prev,
                          [block.id]: option,
                        }));
                      }}
                      onDragLeave={() =>
                        setDragOverItem((prev) => ({
                          ...prev,
                          [block.id]: null,
                        }))
                      }
                      onDrop={(event) => {
                        event.preventDefault();
                        const dragged =
                          draggingItem[block.id] ??
                          event.dataTransfer.getData("text/plain");
                        if (!dragged || dragged === option) return;
                        const next = ranks.filter((item) => item !== dragged);
                        const targetIndex = next.indexOf(option);
                        next.splice(targetIndex, 0, dragged);
                        onChange(block.id, next);
                        setDraggingItem((prev) => ({
                          ...prev,
                          [block.id]: null,
                        }));
                        setDragOverItem((prev) => ({
                          ...prev,
                          [block.id]: null,
                        }));
                      }}
                      onDragEnd={() => {
                        setDraggingItem((prev) => ({
                          ...prev,
                          [block.id]: null,
                        }));
                        setDragOverItem((prev) => ({
                          ...prev,
                          [block.id]: null,
                        }));
                      }}
                      className={`flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm bg-transparent transition-colors ${
                        activeDrag === option
                          ? "opacity-60"
                          : activeOver === option
                            ? "border-primary bg-primary/5"
                            : ""
                      }`}
                    >
                      <span className="w-6 text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span className="flex-1 text-foreground">{option}</span>
                      <span className="text-muted-foreground">⋮⋮</span>
                    </div>
                  ))}
                </div>
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
              const maxBytes = 1 * 1024 * 1024;
              if (file.size > maxBytes) {
                setFileErrors((prev) => ({
                  ...prev,
                  [block.id]: "File exceeds 1.0MB limit.",
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

            const acceptTypes = (block.fileAllowedTypes || [])
              .map((entry) => {
                const trimmed = entry.trim();
                if (!trimmed) return "";
                if (trimmed.includes("/")) return trimmed;
                if (trimmed.startsWith(".")) return trimmed;
                return `.${trimmed}`;
              })
              .filter(Boolean)
              .join(",");

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
                    accept={acceptTypes}
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
                  {(block.fileAllowedTypes?.length || true) && (
                    <p className="text-xs text-muted-foreground">
                      <span>Max size: 1.0MB</span>
                      {block.fileAllowedTypes?.length && <span> • </span>}
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
                <select
                  value={
                    (answers[block.id] as string) ||
                    detectedCountry ||
                    defaultCountry ||
                    ""
                  }
                  onChange={(e) => {
                    setManualCountrySelection((prev) => ({
                      ...prev,
                      [block.id]: true,
                    }));
                    onChange(block.id, e.target.value);
                  }}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-transparent outline-none"
                >
                  <option value="">Select country</option>
                  {countryOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
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
