"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type SubTab = "answers" | "visits" | "drop-offs";

interface InsightsTabProps {
  formId: number;
}

export function InsightsTab({ formId }: InsightsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("answers");
  const [timeRange, setTimeRange] = useState("last-24-hours");

  const subTabs: { id: SubTab; label: string }[] = [
    { id: "answers", label: "Answers" },
    { id: "visits", label: "Visits" },
    { id: "drop-offs", label: "Drop-offs" },
  ];

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSubTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none pl-3 pr-10 py-2 text-sm border border-border rounded-md bg-background text-muted-foreground cursor-pointer hover:bg-accent transition-colors"
          >
            <option value="last-24-hours">Last 24 hours</option>
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="all-time">All time</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {activeSubTab === "answers" && <AnswersContent />}
      {activeSubTab === "visits" && <VisitsContent />}
      {activeSubTab === "drop-offs" && <DropOffsContent />}
    </div>
  );
}

function AnswersContent() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <svg
            className="h-24 w-24 text-muted-foreground opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No completed submissions yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your form is published and ready to be shared with the world!
        </p>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          Share
        </button>
      </div>
    </div>
  );
}

function VisitsContent() {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Visits</div>
          <div className="text-2xl font-semibold">0</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">
            Unique visitors
          </div>
          <div className="text-2xl font-semibold">0</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Submissions</div>
          <div className="text-2xl font-semibold">0</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">
            Unique respondents
          </div>
          <div className="text-2xl font-semibold">0</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">
            Visit duration
          </div>
          <div className="text-2xl font-semibold">0s</div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <svg
              className="h-20 w-20 text-muted-foreground opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Waiting for respondents
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            You&apos;ll see insights here once your form is out in the wild.
          </p>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Share your form
          </button>
        </div>
      </div>
    </div>
  );
}

function DropOffsContent() {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Form views</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">
            Started answering
          </div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Completions</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">
            Completion rate
          </div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">
            Completion duration
          </div>
          <div className="text-2xl font-semibold">—</div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <svg
              className="h-20 w-20 text-muted-foreground opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Waiting for respondents
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            You&apos;ll see insights here once your form is out in the wild.
          </p>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Share your form
          </button>
        </div>
      </div>
    </div>
  );
}
