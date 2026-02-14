"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { updateUser } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { SettingsCard } from "./settings-card";
import { FormInput } from "./form-input";
import { FormActions } from "./form-actions";

interface ProfileSectionProps {
  currentUsername: string;
  onUsernameUpdate: (username: string) => void;
}

export function ProfileSection({
  currentUsername,
  onUsernameUpdate,
}: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!newUsername.trim()) {
      toast({
        title: "Invalid username",
        description: "Username cannot be empty",
      });
      return;
    }

    setIsSaving(true);
    try {
      const user = await updateUser(newUsername, undefined);
      onUsernameUpdate(user.username);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your username has been changed successfully",
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
    setIsEditing(false);
    setNewUsername(currentUsername);
  };

  return (
    <SettingsCard
      icon={User}
      title="Profile"
      description="Update your personal information"
      iconColor="text-blue-600"
      iconBgColor="bg-blue-50"
    >
      {isEditing ? (
        <div className="space-y-4">
          <FormInput
            label="Username"
            value={newUsername}
            onChange={setNewUsername}
            placeholder="Enter new username"
          />
          <FormActions
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
            saveLabel="Save changes"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Username
            </label>
            <div className="mt-2 px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm text-foreground">
              {currentUsername}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Edit profile
          </button>
        </div>
      )}
    </SettingsCard>
  );
}
