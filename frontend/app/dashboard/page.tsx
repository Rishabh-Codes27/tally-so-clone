"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DashboardLayout,
  StatsGrid,
  FormsGrid,
  QuickActions,
  EmptyState,
  type StatCard,
  type FormData,
} from "@/components/dashboard";
import { listForms } from "@/lib/api";
import { FileText, BarChart3, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  const totalResponses = forms.reduce(
    (sum, form) => sum + (form.response_count || 0),
    0,
  );
  const responseRate =
    forms.length > 0
      ? `${Math.round((forms.filter((f) => (f.response_count || 0) > 0).length / forms.length) * 100)}%`
      : "0%";

  const statsCards: StatCard[] = [
    {
      label: "Total forms",
      value: forms.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total responses",
      value: totalResponses,
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Response rate",
      value: responseRate,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your forms.
          </p>
        </div>

        <StatsGrid stats={statsCards} />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Recent forms
            </h2>
            <Link
              href="/dashboard/forms"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : forms.length === 0 ? (
            <EmptyState
              title="No forms yet"
              description="Create your first form to get started."
              action={{ label: "Create form", href: "/builder" }}
            />
          ) : (
            <FormsGrid forms={forms} maxItems={6} />
          )}
        </div>

        <QuickActions />
      </div>
    </DashboardLayout>
  );
}
