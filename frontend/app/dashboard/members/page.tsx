"use client";

import { useState } from "react";
import { DashboardLayout, PricingDialog } from "@/components/dashboard";

export default function MembersPage() {
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
        </div>

        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="h-20 w-20 text-muted-foreground mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292m0 0H8.646a4 4 0 010-5.292m3.354 0H16a4 4 0 010 5.292m0 0v4.586a2 2 0 01-2 2H8a2 2 0 01-2-2v-4.586m0 0a4 4 0 010-5.292"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Invite team members
            </h2>
            <p className="text-muted-foreground mb-6">
              Collaborate with your team by inviting members to your workspace.
            </p>
            <button
              onClick={() => setPricingOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Upgrade to unlock
            </button>
          </div>
        </div>
      </div>
      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </DashboardLayout>
  );
}
