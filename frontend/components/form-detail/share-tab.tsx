"use client";

import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareTabProps {
  form: {
    id: number;
    title: string;
    share_id: string;
  };
}

export function ShareTab({ form }: ShareTabProps) {
  const shareUrl = `${window.location.origin}/s/${form.share_id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Copied to clipboard",
      description: "Share link has been copied",
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Share Link Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Share Link
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your form is now published and ready to be shared with the world!
            Copy this link to share your form on social media, messaging apps or
            via email.
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
          <button className="text-sm text-primary hover:text-primary/80">
            Use custom domain
          </button>
        </div>

        {/* Link Preview Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Link Preview
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            When you share a link, it will embed with a preview similar to the
            one below on social media, messaging apps, and search engines.{" "}
            <button className="text-primary hover:text-primary/80">
              Customize
            </button>{" "}
            <span className="text-pink-600">Pro</span>
          </p>
          <div className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-start gap-3">
              <svg
                className="h-6 w-6 shrink-0 mt-1"
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
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground mb-1">
                  Tally Forms
                </div>
                <div className="text-sm font-semibold text-primary mb-1">
                  {form.title || "Untitled"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Made with Tally, the simplest way to create forms.
                </div>
              </div>
            </div>
            <div className="mt-4 aspect-video bg-gradient-to-br from-pink-50 to-purple-50 rounded-md flex items-center justify-center">
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
                  Tally
                </div>
                <div className="text-xs text-muted-foreground">
                  the simplest way to create forms for free.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embed Form Section */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Embed Form
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use these options to embed your form into your own website.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-6 hover:border-primary cursor-pointer transition-colors">
            <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-sm font-medium text-foreground">Standard</div>
          </div>
          <div className="border border-border rounded-lg p-6 hover:border-primary cursor-pointer transition-colors">
            <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div className="text-sm font-medium text-foreground">Popup</div>
          </div>
          <div className="border border-border rounded-lg p-6 hover:border-primary cursor-pointer transition-colors bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="aspect-video bg-white rounded mb-3 flex items-center justify-center">
              <svg
                className="h-12 w-12 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div className="text-sm font-medium text-foreground">
              Popup button
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
