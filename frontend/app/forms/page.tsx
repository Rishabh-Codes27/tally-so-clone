"use client";

import { useEffect, useState } from "react";
import { deleteForm, listForms } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type FormRow = {
  id: number;
  title: string;
  share_id: string;
  created_at: string;
};

export default function FormsPage() {
  const [forms, setForms] = useState<FormRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isUnauthorized = error?.includes("Unauthorized") ?? false;

  const loadForms = () => {
    setIsLoading(true);
    listForms()
      .then((data) => {
        setForms(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load forms");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleDelete = async (formId: number) => {
    try {
      await deleteForm(formId);
      setForms((prev) => prev.filter((form) => form.id !== formId));
      toast({ title: "Form deleted" });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Your forms</h1>
          <button
            onClick={loadForms}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 text-sm text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="mt-8 text-sm text-destructive">
            {isUnauthorized ? (
              <span>
                Please sign in to view your forms.{" "}
                <a href="/signin" className="underline">
                  Sign in
                </a>
              </span>
            ) : (
              error
            )}
          </div>
        ) : forms.length === 0 ? (
          <div className="mt-8 text-sm text-muted-foreground">
            No forms yet.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {form.title || "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {form.id}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created: {form.created_at}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/responses/${form.id}`}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Responses
                    </a>
                    <a
                      href={`/s/${form.share_id}`}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => handleDelete(form.id)}
                      className="text-xs font-medium text-destructive hover:text-destructive/80"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
