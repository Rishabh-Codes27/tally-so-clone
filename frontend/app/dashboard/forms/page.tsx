"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { deleteForm, listForms } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  FileText,
  MoreVertical,
  Trash2,
  ExternalLink,
  BarChart3,
  Pencil,
} from "lucide-react";

type FormRow = {
  id: number;
  title: string;
  share_id: string;
  response_count: number;
  created_at: string;
};

export default function AllFormsPage() {
  const [forms, setForms] = useState<FormRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
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
    if (!confirm("Are you sure you want to delete this form?")) return;

    try {
      await deleteForm(formId);
      setForms((prev) => prev.filter((form) => form.id !== formId));
      toast({ title: "Form deleted successfully" });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Sign in required
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            Please sign in to view your forms.
          </p>
          <Link
            href="/signin"
            className="inline-flex px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">All forms</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all your forms in one place.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">
              Loading forms...
            </div>
          </div>
        ) : error && !isUnauthorized ? (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No forms yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first form to get started collecting responses.
            </p>
            <Link
              href="/builder"
              className="inline-flex px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Create form
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => (
              <div
                key={form.id}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 hover:shadow-sm hover:border-border/80 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Form icon and info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {form.title || "Untitled"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created {new Date(form.created_at).toLocaleDateString()}{" "}
                        at {new Date(form.created_at).toLocaleTimeString()}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="text-xs text-muted-foreground">
                          {form.response_count}{" "}
                          {form.response_count === 1 ? "response" : "responses"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • ID: {form.share_id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Link
                      href={`/builder?formId=${form.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    <Link
                      href={`/responses/${form.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Responses
                    </Link>
                    <Link
                      href={`/s/${form.share_id}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === form.id ? null : form.id)
                        }
                        className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {openMenuId === form.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-20 py-1">
                            <button
                              onClick={() => {
                                handleDelete(form.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete form
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
