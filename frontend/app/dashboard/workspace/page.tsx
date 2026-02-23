"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { listForms } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";

type FormData = {
  id: number;
  title: string;
  share_id: string;
  response_count: number;
  created_at: string;
  updated_at: string;
};

export default function WorkspacePage() {
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <span>My workspace</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-foreground">
              My workspace
            </h1>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 text-white text-sm font-medium">
              R
            </div>
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

        {/* Forms List */}
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
                href={`/dashboard/forms/${form.id}`}
                className="block"
              >
                <div className="flex flex-col gap-2 py-3 hover:bg-accent/50 -mx-2 px-2 rounded-md transition-colors">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-medium text-foreground">
                      {form.title || "Untitled"}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {form.response_count === 0
                      ? "No completed submissions yet"
                      : `${form.response_count} submission${
                          form.response_count === 1 ? "" : "s"
                        }`}{" "}
                    · Edited {getTimeAgo(form.updated_at)} ago
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
