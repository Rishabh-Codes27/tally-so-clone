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
          <div className="space-y-4">
            {forms.map((form) => (
              <Link
                key={form.id}
                href={`/builder?formId=${form.id}`}
                className="block"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-medium text-foreground hover:text-primary transition-colors">
                      {form.title || "Untitled"}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Draft
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Edited {getTimeAgo(form.created_at)} ago
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
