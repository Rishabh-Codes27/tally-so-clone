"use client";

import type { FormBlock } from "./types";

interface FormPreviewProps {
  formTitle: string;
  blocks: FormBlock[];
}

const fallbackLabels: Record<FormBlock["type"], string> = {
  text: "",
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
  "page-break": "",
  "new-page": "",
};

function getLabel(block: FormBlock) {
  const content = block.content?.trim();
  return content || fallbackLabels[block.type];
}

export function FormPreview({ formTitle, blocks }: FormPreviewProps) {
  return (
    <div className="max-w-[640px] mx-auto px-5 sm:px-6 py-14">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          {formTitle || "Untitled"}
        </h1>
      </div>
      <div className="flex flex-col gap-6">
        {blocks.map((block) => {
          if (block.type === "text") return null;

          const content = (() => {
            switch (block.type) {
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
                      type="number"
                      placeholder="0"
                      className="border-b border-border/60 py-2 text-sm text-foreground bg-transparent outline-none max-w-sm"
                    />
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
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="border-b border-border/60 py-2 text-sm text-foreground bg-transparent outline-none max-w-sm"
                    />
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
                      {[1, 2, 3, 4, 5].map((n) => (
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
                      {[1, 2, 3, 4, 5].map((n) => (
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
                      placeholder="Card number"
                      className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
                    />
                  </div>
                );
              case "signature":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <input
                      type="text"
                      placeholder="Type your name"
                      className="border border-border rounded-md px-3 py-2 text-sm text-foreground bg-transparent outline-none"
                    />
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
                  </div>
                );
              case "image":
                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {getLabel(block)}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="text-sm text-foreground"
                    />
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
            "heading1",
            "heading2",
            "heading3",
            "paragraph",
            "divider",
            "image",
            "page-break",
            "new-page",
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
