"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { listFormSubmissions } from "@/lib/api";

type SubmissionRow = {
  id: number;
  form_id: number;
  data: Record<string, unknown>;
  created_at: string;
};

export default function ResponsesPage() {
  const params = useParams<{ formId: string }>();
  const formId = Number(params?.formId);
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(formId)) return;
    setIsLoading(true);
    listFormSubmissions(formId)
      .then((data) => {
        setRows(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => setIsLoading(false));
  }, [formId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-foreground">Responses</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {Number.isFinite(formId) ? `Form ID: ${formId}` : "Form ID missing"}
        </p>

        {isLoading ? (
          <div className="mt-8 text-sm text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="mt-8 text-sm text-destructive">{error}</div>
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
                <pre className="mt-3 text-xs whitespace-pre-wrap break-words">
                  {JSON.stringify(row.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
