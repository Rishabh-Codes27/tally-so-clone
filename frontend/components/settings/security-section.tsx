"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { updateUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { SettingsCard } from "./settings-card";
import { FormInput } from "./form-input";
import { FormActions } from "./form-actions";

export function SecuritySection() {
  const [isChanging, setIsChanging] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Invalid password",
        description: "Password fields cannot be empty",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match",
      });
      return;
    }

    if (newPassword.length < 3) {
      toast({
        title: "Password too short",
        description: "Password must be at least 3 characters",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateUser(undefined, newPassword);
      setIsChanging(false);
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsChanging(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SettingsCard
      icon={Lock}
      title="Security"
      description="Manage your password and security settings"
      iconColor="text-purple-600"
      iconBgColor="bg-purple-50"
    >
      {isChanging ? (
        <div className="space-y-4">
          <FormInput
            label="New password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter new password"
          />
          <FormInput
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm new password"
          />
          <FormActions
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
            saveLabel="Change password"
          />
        </div>
      ) : (
        <button
          onClick={() => setIsChanging(true)}
          className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Change password
        </button>
      )}
    </SettingsCard>
  );
}
