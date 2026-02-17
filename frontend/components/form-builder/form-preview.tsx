"use client";

import {
  useRef,
  useMemo,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { FormBlock } from "./types";
import { shouldShowBlock, shouldBeRequired } from "@/lib/conditional-logic";
import PhoneInput, {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

interface FormPreviewProps {
  formTitle: string;
  blocks: FormBlock[];
}

const fallbackLabels: Record<FormBlock["type"], string> = {
  text: "",
  title: "Title",
  label: "Label",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  paragraph: "Paragraph",
  "short-answer": "Question",
  "long-answer": "Question",
  email: "Email address",
  number: "Number",
  url: "URL",
  phone: "Phone number",
  date: "Date",
  time: "Time",
  "multiple-choice": "Question",
  checkboxes: "Question",
  dropdown: "Question",
  "multi-select": "Question",
  "linear-scale": "Question",
  matrix: "Question",
  rating: "Question",
  payment: "Payment",
  signature: "Signature",
  ranking: "Ranking",
  "wallet-connect": "Wallet Connect",
  "file-upload": "File upload",
  divider: "",
  image: "Image",
  video: "Video",
  audio: "Audio",
  embed: "Embed",
  "page-break": "",
  "new-page": "",
  "thank-you-page": "Thank you",
  "conditional-logic": "Conditional logic",
  "calculated-field": "Calculated field",
  "hidden-field": "Hidden field",
  recaptcha: "reCAPTCHA",
  "respondent-country": "Respondent's country",
};

const PHONE_INPUT_PATTERN = /^\+?\d*$/;
const MAX_PHONE_NATIONAL_DIGITS = 10;

function getLabel(block: FormBlock) {
  if (block.type === "image") {
    return fallbackLabels[block.type];
  }
  const content = block.content?.trim();
  return content || fallbackLabels[block.type];
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

export function FormPreview({ formTitle, blocks }: FormPreviewProps) {
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
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [phoneCountries, setPhoneCountries] = useState<
    Record<string, Country | undefined>
  >({});
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [isDrawing, setIsDrawing] = useState<Record<string, boolean>>({});
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

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

  const handleNumberChange = (blockId: string, raw: string) => {
    const normalized = normalizeNumberInput(raw);
    setInputError(
      blockId,
      raw !== normalized,
      "Only numbers, - and . are allowed.",
    );
    setInputValues((prev) => ({ ...prev, [blockId]: normalized }));
  };

  const handlePhoneChange = (blockId: string, value: string) => {
    const country = phoneCountries[blockId] ?? defaultCountry;
    const { normalized, exceeded } = applyPhoneLimit(value, country);
    if (exceeded) {
      setInputError(blockId, false);
      setInputValues((prev) => ({ ...prev, [blockId]: normalized }));
      return;
    }
    setInputError(
      blockId,
      !PHONE_INPUT_PATTERN.test(normalized),
      "Only numbers and + are allowed.",
    );
    setInputValues((prev) => ({ ...prev, [blockId]: normalized }));
  };

  const getSignatureCoordinates = (
    e: ReactPointerEvent<HTMLCanvasElement>,
  ): [number, number] => {
    const canvas = e.currentTarget;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return [x, y];
  };

  const handleSignatureStart = (
    blockId: string,
    e: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRefs.current[blockId];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [x, y] = getSignatureCoordinates(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing((prev) => ({ ...prev, [blockId]: true }));
  };

  const handleSignatureDraw = (
    blockId: string,
    e: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing[blockId]) return;
    const canvas = canvasRefs.current[blockId];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [x, y] = getSignatureCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleSignatureEnd = (blockId: string) => {
    const canvas = canvasRefs.current[blockId];
    if (!canvas) return;
    setIsDrawing((prev) => ({ ...prev, [blockId]: false }));
    setSignatures((prev) => ({
      ...prev,
      [blockId]: canvas.toDataURL("image/png"),
    }));
  };

  const handleSignatureClear = (blockId: string) => {
    const canvas = canvasRefs.current[blockId];
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatures((prev) => ({ ...prev, [blockId]: "" }));
  };

  return (
    <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-14">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          {formTitle || "Untitled"}
        </h1>
      </div>
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
            !shouldShowBlock(
              allRules.length > 0 ? allRules : undefined,
              inputValues,
            )
          ) {
            return null;
          }

          const isRequired =
            block.required ||
            shouldBeRequired(
              allRules.length > 0 ? allRules : undefined,
              inputValues,
            );

          const content = (() => {
            switch (block.type) {
              case "text":
                return (
                  <p className="text-base text-foreground leading-relaxed">
                    {block.content?.trim()}
                  </p>
                );
              case "heading1":
                return (
                  <h2 className="text-3xl font-bold text-foreground">
                    {getLabel(block)}
                  </h2>
                );
              case "heading2":
                return (
                  <h3 className="text-2xl font-bold text-foreground">
                    {getLabel(block)}
                  </h3>
                );
              case "heading3":
                return (
                  <h4 className="text-xl font-semibold text-foreground">
                    {getLabel(block)}
                  </h4>
                );
              case "title":
                return (
                  <h3 className="text-2xl font-semibold text-foreground">
                    {getLabel(block)}
                  </h3>
                );
              case "label":
                return (
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {getLabel(block)}
                  </p>
                );
              case "paragraph":
                return (
                  <p className="text-base text-foreground leading-relaxed">
                    {getLabel(block)}
                  </p>
                );
              case "short-answer":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/90">
                      {getLabel(block)}
                    </label>
                    <input
                      type="text"
                      placeholder="Short answer"
                      className="border-b border-border/60 py-2 text-sm text-foreground bg-transparent outline-none max-w-sm"
                    />
                  </div>
                );
              case "long-answer":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/90">
                      {getLabel(block)}
                    </label>
                    <textarea
                      placeholder="Long answer"
                      className="border border-border/60 rounded-md p-3 h-24 text-sm text-foreground bg-transparent outline-none"
                    />
                  </div>
                );
              case "email":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/90">
                      {getLabel(block)}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="border-b border-border/60 py-2 text-sm text-foreground bg-transparent outline-none max-w-sm"
                    />
                  </div>
                );
              case "number":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/90">
                      {getLabel(block)}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      value={inputValues[block.id] ?? ""}
                      onChange={(event) =>
                        handleNumberChange(block.id, event.target.value)
                      }
                      className="border-b border-border/60 py-2 text-sm text-foreground bg-transparent outline-none max-w-sm"
                    />
                    {inputErrors[block.id] && (
                      <p className="text-xs text-destructive">
                        {inputErrors[block.id]}
                      </p>
                    )}
                  </div>
                );
              case "url":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/90">
                      {getLabel(block)}
                    </label>
                    <input
                      type="url"
                      placeholder="https://"
                      className="border-b border-border/60 py-2 text-sm text-foreground bg-transparent outline-none max-w-sm"
                    />
                  </div>
                );
              case "phone":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/90">
                      {getLabel(block)}
                    </label>
                    <PhoneInput
                      defaultCountry={defaultCountry}
                      value={inputValues[block.id] ?? ""}
                      onChange={(value) =>
                        handlePhoneChange(block.id, value ?? "")
                      }
                      international
                      withCountryCallingCode
                      countryCallingCodeEditable
                      className="phone-input"
                      numberInputProps={{
                        className: "bg-transparent outline-none text-sm",
                      }}
                    />
                    {inputErrors[block.id] && (
                      <p className="text-xs text-destructive">
                        {inputErrors[block.id]}
                      </p>
                    )}
                  </div>
                );
              case "date":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <input
                      type="date"
                      className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
                    />
                  </div>
                );
              case "time":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <input
                      type="time"
                      min={block.timeStart}
                      max={block.timeEnd}
                      step={block.timeStep ? block.timeStep * 60 : undefined}
                      className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
                    />
                    {(block.timeStart || block.timeEnd) && (
                      <div className="text-xs text-muted-foreground">
                        Working hours: {block.timeStart || "--:--"} to{" "}
                        {block.timeEnd || "--:--"}
                      </div>
                    )}
                  </div>
                );
              case "multiple-choice":
                return (
                  <fieldset className="flex flex-col gap-2">
                    <legend className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </legend>
                    {(block.options || []).map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <input
                          type="radio"
                          name={`mc-${block.id}`}
                          className="h-4 w-4"
                        />
                        {option}
                      </label>
                    ))}
                  </fieldset>
                );
              case "checkboxes":
                return (
                  <fieldset className="flex flex-col gap-2">
                    <legend className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </legend>
                    {(block.options || []).map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <input type="checkbox" className="h-4 w-4" />
                        {option}
                      </label>
                    ))}
                  </fieldset>
                );
              case "dropdown":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <select className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none">
                      {(block.options || []).map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              case "multi-select":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <select
                      multiple
                      className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
                    >
                      {(block.options || []).map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              case "linear-scale":
                return (
                  <fieldset className="flex flex-col gap-2">
                    <legend className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </legend>
                    <div className="flex items-center gap-4">
                      {Array.from(
                        {
                          length:
                            (block.scaleMax ?? 5) - (block.scaleMin ?? 1) + 1,
                        },
                        (_, i) => (block.scaleMin ?? 1) + i,
                      ).map((n) => (
                        <label
                          key={n}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <input
                            type="radio"
                            name={`scale-${block.id}`}
                            className="h-4 w-4"
                          />
                          {n}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              case "matrix":
                return (
                  <fieldset className="flex flex-col gap-3">
                    <legend className="text-sm font-medium text-foreground">
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
                              {(block.columns || []).map((_, ci) => (
                                <td key={ci} className="p-2 text-center">
                                  <input
                                    type="radio"
                                    name={`matrix-${block.id}-${ri}`}
                                    className="h-4 w-4"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </fieldset>
                );
              case "rating":
                return (
                  <fieldset className="flex flex-col gap-2">
                    <legend className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </legend>
                    <div className="flex items-center gap-3">
                      {Array.from(
                        { length: block.ratingMax ?? 5 },
                        (_, i) => i + 1,
                      ).map((n) => (
                        <label
                          key={n}
                          className="flex items-center gap-2 text-sm text-foreground"
                        >
                          <input
                            type="radio"
                            name={`rating-${block.id}`}
                            className="h-4 w-4"
                          />
                          {n}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              case "payment":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <input
                      type="text"
                      placeholder={`Amount ${block.paymentCurrency ?? "USD"}`}
                      className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
                    />
                    <div className="text-xs text-muted-foreground">
                      {block.paymentDescription ?? "Payment"} ·{" "}
                      {block.paymentAmount ?? 0}{" "}
                      {block.paymentCurrency ?? "USD"}
                    </div>
                  </div>
                );
              case "signature":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <div className="flex flex-col gap-2">
                      <canvas
                        ref={(el) => {
                          if (el) canvasRefs.current[block.id] = el;
                        }}
                        width={520}
                        height={140}
                        className="w-full rounded-md border border-border bg-background cursor-crosshair"
                        style={{ maxWidth: "100%" }}
                        onPointerDown={(e) => handleSignatureStart(block.id, e)}
                        onPointerMove={(e) => handleSignatureDraw(block.id, e)}
                        onPointerUp={() => handleSignatureEnd(block.id)}
                        onPointerLeave={() => handleSignatureEnd(block.id)}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {signatures[block.id]
                            ? "Signature captured"
                            : "Draw your signature"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSignatureClear(block.id)}
                          className="text-primary cursor-pointer hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                );
              case "ranking":
                return (
                  <fieldset className="flex flex-col gap-3">
                    <legend className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </legend>
                    {(block.options || []).map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <span className="w-6 text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="flex-1">{option}</span>
                        <select
                          className="border border-border rounded-md px-2 py-1 text-sm text-foreground bg-transparent outline-none"
                          defaultValue={index + 1}
                        >
                          {(block.options || []).map((_, rank) => (
                            <option key={rank} value={rank + 1}>
                              {rank + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </fieldset>
                );
              case "wallet-connect":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <button className="w-fit px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                      Connect wallet
                    </button>
                  </div>
                );
              case "file-upload":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <input type="file" className="text-sm text-foreground" />
                    <div className="text-xs text-muted-foreground">Max 1MB</div>
                  </div>
                );
              case "video":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    {block.content ? (
                      <video
                        controls
                        controlsList="nodownload"
                        className="w-full rounded-md border border-border/40"
                        style={{ maxHeight: "400px" }}
                      >
                        <source src={block.content} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                        Add a video URL in the builder to preview it here.
                      </div>
                    )}
                  </div>
                );
              case "thank-you-page":
                return (
                  <div className="rounded-md border border-border/40 px-4 py-3">
                    <div className="text-sm font-semibold text-foreground">
                      {getLabel(block)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Thank you message after submission.
                    </div>
                  </div>
                );
              case "calculated-field":
              case "hidden-field":
              case "recaptcha":
                return (
                  <div className="text-sm text-muted-foreground">
                    {getLabel(block)}
                  </div>
                );
              case "respondent-country":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <select
                      className="border border-border rounded-md px-3 py-2 text-sm bg-transparent outline-none"
                      defaultValue={defaultCountry ?? ""}
                    >
                      <option value="">Select country</option>
                      {countryOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              case "image":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    {block.content ? (
                      <img
                        src={block.content}
                        alt={getLabel(block)}
                        className="rounded-md border border-border/40"
                      />
                    ) : (
                      <div className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                        Upload an image in the builder to display it here.
                      </div>
                    )}
                  </div>
                );
              case "video":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    {block.content ? (
                      <video
                        controls
                        className="w-full rounded-md border border-border/40"
                      >
                        <source src={block.content} />
                      </video>
                    ) : (
                      <div className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                        Add a video URL in the builder to preview it here.
                      </div>
                    )}
                  </div>
                );
              case "audio":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    {block.content ? (
                      <audio controls className="w-full">
                        <source src={block.content} />
                        Your browser does not support the audio tag.
                      </audio>
                    ) : (
                      <div className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                        Add an audio URL in the builder to preview it here.
                      </div>
                    )}
                  </div>
                );
              case "embed":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    {block.content ? (
                      <iframe
                        src={block.content}
                        className="w-full min-h-[400px] rounded-md border border-border/40"
                        title={getLabel(block)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                        Add an embed URL in the builder to preview it here.
                      </div>
                    )}
                  </div>
                );
              case "divider":
                return <hr className="border-border" />;
              case "page-break":
              case "new-page":
                return (
                  <div className="flex items-center gap-3">
                    <hr className="border-border flex-1" />
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {block.type === "new-page" ? "New page" : "Page break"}
                    </span>
                    <hr className="border-border flex-1" />
                  </div>
                );
              default:
                return null;
            }
          })();

          if (!content) return null;

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

          if (showFieldShell) {
            return (
              <div
                key={block.id}
                className="rounded-md border border-border/40 px-4 py-3"
              >
                {content}
              </div>
            );
          }

          return <div key={block.id}>{content}</div>;
        })}
      </div>
    </div>
  );
}
