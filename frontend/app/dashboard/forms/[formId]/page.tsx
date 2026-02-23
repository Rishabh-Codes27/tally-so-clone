"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getFormById } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  BarChart3,
  FileText,
  Share2,
  Plug,
  Settings,
  Copy,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  InsightsTab,
  SubmissionsTab,
  ShareTab,
  IntegrationsTab,
  SettingsTab,
} from "@/components/form-detail";

type Form = {
  id: number;
  title: string;
  share_id: string;
  blocks: any[];
  created_at: string;
  updated_at: string;
};

type Tab = "insights" | "submissions" | "share" | "integrations" | "settings";

export default function FormDetailPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("share");

  useEffect(() => {
    if (formId) {
      getFormById(parseInt(formId))
        .then((data: any) => {
          setForm(data);
        })
        .catch((err: any) => {
          toast({
            title: "Failed to load form",
            description:
              err instanceof Error ? err.message : "Please try again",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [formId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!form) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-sm text-muted-foreground">Form not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "insights", label: "Insights", icon: BarChart3 },
    { id: "submissions", label: "Submissions", icon: FileText },
    { id: "share", label: "Share", icon: Share2 },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/s/${form.share_id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Form link has been copied to clipboard",
    });
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
          <Link
            href="/dashboard/workspace"
            className="hover:text-foreground transition-colors"
          >
            My workspace
          </Link>
          <span>&gt;</span>
          <span className="text-foreground">{form.title || "Untitled"}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              {form.title || "Untitled"}
            </h1>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center w-9 h-9 border border-border rounded-md hover:bg-accent transition-colors"
              title="Copy form link"
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 text-white text-sm font-medium">
              R
            </div>
            <Link
              href={`/builder?formId=${formId}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "insights" && (
            <InsightsTab formId={parseInt(formId)} />
          )}
          {activeTab === "submissions" && (
            <SubmissionsTab formId={parseInt(formId)} />
          )}
          {activeTab === "share" && <ShareTab form={form} />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "settings" && (
            <SettingsTab formId={parseInt(formId)} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
