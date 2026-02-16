"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFormById, listFormSubmissions } from "@/lib/api";

type SubmissionRow = {
  id: number;
  form_id: number;
  data: Record<string, unknown>;
  created_at: string;
};

type FileAnswer = {
  name?: string;
  type?: string;
  data?: string;
};

export default function ResponsesPage() {
  const params = useParams<{ formId: string }>();
  const formId = Number(params?.formId);
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [questionMap, setQuestionMap] = useState<Record<string, string>>({});
  const [formTitle, setFormTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isUnauthorized = error?.includes("Unauthorized") ?? false;

  useEffect(() => {
    if (!Number.isFinite(formId)) return;
    setIsLoading(true);
    Promise.all([listFormSubmissions(formId), getFormById(formId)])
      .then(([data, form]) => {
        setRows(data);
        setFormTitle(form.title);
        const nextMap: Record<string, string> = {};
        form.blocks.forEach((block) => {
          const label = block.content?.trim() || "Untitled question";
          nextMap[block.id] = label;
        });
        setQuestionMap(nextMap);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => setIsLoading(false));
  }, [formId]);

  const formatValue = (value: unknown) => {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (value === null || value === undefined) return "-";
    return JSON.stringify(value);
  };

  const isFileAnswer = (value: unknown): value is FileAnswer => {
    if (!value || typeof value !== "object" || Array.isArray(value))
      return false;
    const record = value as FileAnswer;
    return Boolean(record.name && record.data);
  };

  const downloadDataUrl = async (dataUrl: string, filename: string) => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadFilesForResponse = async (row: SubmissionRow) => {
    const entries = Object.entries(row.data);
    for (const [key, value] of entries) {
      if (!isFileAnswer(value)) continue;
      const safeName = value.name || `${key}.bin`;
      await downloadDataUrl(value.data ?? "", safeName);
    }
  };

  const buildCsv = () => {
    const headers = ["Response ID", "Created At", ...Object.keys(questionMap)];
    const rowsCsv = rows.map((row) => {
      const base = [row.id, row.created_at];
      const values = Object.keys(questionMap).map((key) =>
        JSON.stringify(formatValue(row.data[key])),
      );
      return [...base, ...values].join(",");
    });
    return [headers.join(","), ...rowsCsv].join("\n");
  };

  const downloadCsv = () => {
    const csv = buildCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formTitle || "form"}-responses.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formTitle || "form"}-responses.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">Responses</h1>
          <a
            href="/dashboard"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Back to dashboard
          </a>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {formTitle ? formTitle : "Form"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadCsv}
            className="px-3 py-1.5 rounded-md border border-border text-sm"
          >
            Download CSV
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="px-3 py-1.5 rounded-md border border-border text-sm"
          >
            Download JSON
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 text-sm text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="mt-8 text-sm text-destructive">
            {isUnauthorized ? (
              <span>
                Please sign in to view responses.{" "}
                <a href="/signin" className="underline">
                  Sign in
                </a>
              </span>
            ) : (
              error
            )}
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-8 text-sm text-muted-foreground">
            No responses yet.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Response #{row.id}</span>
                  <span>{row.created_at}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => downloadFilesForResponse(row)}
                    className="px-3 py-1.5 rounded-md border border-border text-xs"
                  >
                    Download files
                  </button>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {Object.entries(row.data).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {questionMap[key] ?? key}
                      </span>
                      <span className="text-foreground">
                        {isFileAnswer(value) ? value.name : formatValue(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
