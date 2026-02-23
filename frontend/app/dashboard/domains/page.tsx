"use client";

import { useState } from "react";
import { DashboardLayout, PricingDialog } from "@/components/dashboard";
import { Button } from "@/components/ui/button";

export default function DomainsPage() {
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-3xl font-bold text-foreground mb-8">Domains</h2>

        <div className="flex items-center justify-center min-h-96 rounded-lg border border-border bg-card">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg
                className="h-24 w-24 text-muted-foreground mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No custom domains yet
            </h3>
            <p className="text-muted-foreground mb-2">
              <span className="font-medium">Pro</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Personalize the form links with your own domain.{" "}
              <a href="#" className="text-primary hover:underline">
                Learn about custom domains
              </a>
              .
            </p>
            <Button
              onClick={() => setPricingOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              + Add domain
            </Button>
          </div>
        </div>
      </div>
      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </DashboardLayout>
  );
}
