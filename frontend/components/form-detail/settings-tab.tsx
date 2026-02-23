"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SettingsTabProps {
  formId: number;
}

export function SettingsTab({ formId }: SettingsTabProps) {
  const [language, setLanguage] = useState("english");
  const [redirectOnCompletion, setRedirectOnCompletion] = useState(false);
  const [progressBar, setProgressBar] = useState(false);
  const [partialSubmissions, setPartialSubmissions] = useState(false);
  const [tallyBranding, setTallyBranding] = useState(true);

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your form settings have been updated",
    });
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-semibold text-foreground mb-6">General</h2>

      <div className="space-y-8">
        {/* Language */}
        <div className="pb-8 border-b border-border">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                Language
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose in what language the respondents will see your form. This
                applies to the text which is not customized by you e.g. default
                buttons, errors, etc.
              </p>
            </div>
            <div className="w-48">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Redirect on completion */}
        <div className="pb-8 border-b border-border">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                Redirect on completion
              </h3>
              <p className="text-sm text-muted-foreground">
                Redirect to a custom URL when the form is submitted.
              </p>
            </div>
            <div>
              <button
                onClick={() => setRedirectOnCompletion(!redirectOnCompletion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  redirectOnCompletion ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    redirectOnCompletion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pb-8 border-b border-border">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                Progress bar
              </h3>
              <p className="text-sm text-muted-foreground">
                The progress bar provides a clear way for respondents to
                understand how much of the form they have completed, and
                encourages them to continue until the end.
              </p>
            </div>
            <div>
              <button
                onClick={() => setProgressBar(!progressBar)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  progressBar ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    progressBar ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Partial submissions */}
        <div className="pb-8 border-b border-border">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                Partial submissions{" "}
                <span className="text-pink-600 text-xs">Pro</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Collect answers from people who filled in a part of your form,
                but didn&apos;t click the submit button. You can&apos;t export
                partial submissions with integrations, nor enable email
                notifications.
              </p>
            </div>
            <div>
              <button
                onClick={() => setPartialSubmissions(!partialSubmissions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  partialSubmissions ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    partialSubmissions ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Tally branding */}
        <div className="pb-8">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                Tally branding{" "}
                <span className="text-pink-600 text-xs">Pro</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Remove Tally branding from your form.
              </p>
            </div>
            <div>
              <button
                onClick={() => setTallyBranding(!tallyBranding)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tallyBranding ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tallyBranding ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4 pt-6 border-t border-border">
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed"
          disabled
        >
          Save changes
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Learn about settings
        </button>
      </div>
    </div>
  );
}
