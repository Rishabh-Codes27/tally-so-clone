"use client";

import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  // Pricing calculations
  const monthlyProPrice = 29;
  const monthlyBusinessPrice = 89;
  const yearlyProPrice = (12 - 2) * monthlyProPrice; // 10 * 29 = 290
  const yearlyBusinessPrice = (12 - 2) * monthlyBusinessPrice; // 10 * 89 = 890

  const proPrice =
    billingCycle === "monthly" ? monthlyProPrice : yearlyProPrice;
  const businessPrice =
    billingCycle === "monthly" ? monthlyBusinessPrice : yearlyBusinessPrice;

  const proPaymentText =
    billingCycle === "monthly"
      ? `Pay $${monthlyProPrice} Every Month`
      : `Pay $${yearlyProPrice} Every Year`;
  const businessPaymentText =
    billingCycle === "monthly"
      ? `Pay $${monthlyBusinessPrice} Every Month`
      : `Pay $${yearlyBusinessPrice} Every Year`;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Header with back and close buttons */}
      <div className="sticky top-0 border-b border-border bg-background z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Do more with Tally
          </h1>
          <p className="text-lg text-muted-foreground">
            Upgrade to access advanced features designed for growing teams and
            creators.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={`text-sm font-medium ${
              billingCycle === "monthly"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Pay monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
              billingCycle === "yearly" ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                billingCycle === "yearly" ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                billingCycle === "yearly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Pay yearly
            </span>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
              2 months off
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pro Plan */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Pro</h2>
            <div className="mb-6">
              <span className="text-5xl font-bold text-foreground">
                ${proPrice}
              </span>
              <span className="text-muted-foreground ml-2">
                {billingCycle === "monthly" ? "per month" : "per year"}
              </span>
            </div>

            <Button className="w-full mb-8 bg-pink-500 hover:bg-pink-600 text-white">
              Upgrade to Pro
            </Button>

            <div className="text-sm text-muted-foreground mb-4">
              {proPaymentText}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    className="h-5 w-5 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H2a2 2 0 01-2-2V8a2 2 0 012-2h15.25a2 2 0 012 2v4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Remove Tally branding.
                  </div>
                  <div className="text-muted-foreground">
                    Hide all branding and make your forms truly your own.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    className="h-5 w-5 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H2a2 2 0 01-2-2V8a2 2 0 012-2h15.25a2 2 0 012 2v4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Custom domains.
                  </div>
                  <div className="text-muted-foreground">
                    Host forms on your custom (sub)domain to create branded
                    links.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    className="h-5 w-5 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H2a2 2 0 01-2-2V8a2 2 0 012-2h15.25a2 2 0 012 2v4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Collaboration.
                  </div>
                  <div className="text-muted-foreground">
                    Invite unlimited team members to shared workspaces.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Plan */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Business
            </h2>
            <div className="mb-6">
              <span className="text-5xl font-bold text-foreground">
                ${businessPrice}
              </span>
              <span className="text-muted-foreground ml-2">
                {billingCycle === "monthly" ? "per month" : "per year"}
              </span>
            </div>

            <Button className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white">
              Upgrade to Business
            </Button>

            <div className="text-sm text-muted-foreground mb-4">
              {businessPaymentText}
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-foreground mb-4">
                Everything in Pro. Plus the following features tailored for
                organizations with advanced needs.
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H2a2 2 0 01-2-2V8a2 2 0 012-2h15.25a2 2 0 012 2v4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Control data retention.
                  </div>
                  <div className="text-muted-foreground">
                    Automatically delete form submissions after a set period to
                    comply with privacy regulations.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H2a2 2 0 01-2-2V8a2 2 0 012-2h15.25a2 2 0 012 2v4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Partial submissions.
                  </div>
                  <div className="text-muted-foreground">
                    Capture unfinished form responses before respondents submit
                    the form.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="mt-16" />
      </div>
    </div>
  );
}
