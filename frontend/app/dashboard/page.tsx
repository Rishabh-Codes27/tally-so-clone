"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout, type FormData } from "@/components/dashboard";
import { listForms } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listForms()
      .then((data) => {
        setForms(data);
      })
      .catch((err) => {
        toast({
          title: "Failed to load forms",
          description: err instanceof Error ? err.message : "Please try again",
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getTimeAgo = (dateString: string) => {
    const distance = formatDistanceToNow(new Date(dateString), {
      addSuffix: false,
    });

    // Convert to simpler format like "37m" or "just now"
    if (distance.includes("less than a minute")) {
      return "just now";
    }
    if (distance.includes("minute")) {
      const mins = parseInt(distance);
      return `${mins}m`;
    }
    if (distance.includes("hour")) {
      const hours = parseInt(distance);
      return `${hours}h`;
    }
    if (distance.includes("day")) {
      const days = parseInt(distance);
      return `${days}d`;
    }
    return distance;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Home</h1>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New workspace
            </button>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New form
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : forms.length === 0 ? (
          <div className="py-12">
            <p className="text-muted-foreground mb-4">No forms yet</p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Create your first form
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <Link
                  href={`/builder?formId=${form.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {form.title || "Untitled"}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        Draft
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Edited {getTimeAgo(form.created_at)} ago
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/builder?formId=${form.id}`}
                    className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Link>
                  <button
                    className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button
                    className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                    title="More options"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 12a2 2 0 11-4 0 2 2 0 014 0zM12 12a2 2 0 11-4 0 2 2 0 014 0zM16 14a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
