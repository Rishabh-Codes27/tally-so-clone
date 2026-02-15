"use client";

import type { FormBlock } from "@/components/form-builder/types";
import { getLabel } from "./labels";

interface PublicFormFieldsProps {
  blocks: FormBlock[];
  answers: Record<string, unknown>;
  onChange: (blockId: string, value: unknown) => void;
}

export function PublicFormFields({
  blocks,
  answers,
  onChange,
}: PublicFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return block.content?.trim() ? (
              <p key={block.id} className="text-base leading-relaxed">
                {block.content}
              </p>
            ) : null;
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
              </div>
            );
          case "linear-scale":
            return (
              <fieldset key={block.id} className="flex flex-col gap-2">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                <div className="flex items-center gap-4">
                  {[1, 2, 3, 4, 5].map((n) => (
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
              </fieldset>
            );
          case "rating":
            return (
              <fieldset key={block.id} className="flex flex-col gap-2">
                <legend className="text-sm font-medium">
                  {getLabel(block)}
                </legend>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
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
              </fieldset>
            );
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
