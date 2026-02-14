"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  ProfileSection,
  SecuritySection,
  SettingsCard,
} from "@/components/settings";
import { getCurrentUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Bell, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [currentUsername, setCurrentUsername] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setCurrentUsername(user.username);
      })
      .catch(() => {
        toast({
          title: "Failed to load user",
          description: "Please try refreshing the page",
        });
      })
      .finally(() => setIsLoadingUser(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        {isLoadingUser ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-6">
            <ProfileSection
              currentUsername={currentUsername}
              onUsernameUpdate={setCurrentUsername}
            />

            <SecuritySection />

            <SettingsCard
              icon={Bell}
              title="Notifications"
              description="Configure how you receive notifications (Coming soon)"
              iconColor="text-green-600"
              iconBgColor="bg-green-50"
              disabled
            >
              <div className="space-y-3">
                <label className="flex items-center justify-between opacity-50">
                  <span className="text-sm text-foreground">
                    Email notifications for new responses
                  </span>
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 rounded border-border"
                  />
                </label>
                <label className="flex items-center justify-between opacity-50">
                  <span className="text-sm text-foreground">
                    Weekly summary emails
                  </span>
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 rounded border-border"
                  />
                </label>
              </div>
            </SettingsCard>

            <SettingsCard
              icon={CreditCard}
              title="Billing"
              description="Manage your subscription and billing"
              iconColor="text-orange-600"
              iconBgColor="bg-orange-50"
              disabled
            >
              <p className="text-sm text-muted-foreground">
                No active subscription • This is a demo
              </p>
            </SettingsCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
