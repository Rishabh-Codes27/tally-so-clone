"use client";

import { useEffect, useState } from "react";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { Navbar } from "@/components/form-builder/navbar";
import { Space_Grotesk } from "next/font/google";
import {
  Ban,
  CornerDownLeft,
  LayoutTemplate,
  Sparkles,
  Wand2,
  Share2,
  BookOpen,
  Calculator,
  EyeOff,
  AtSign,
  DollarSign,
} from "lucide-react";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function BuilderPage() {
  const [started, setStarted] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  useEffect(() => {
    if (started) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setStarted(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started]);

  if (started) {
    return <FormBuilder initialTitle={draftTitle} autoFocusFirstBlock={true} />;
  }

  const noop = () => undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        formTitle="Untitled"
        isPreview={false}
        onTogglePreview={noop}
        onPublish={noop}
        isPublishing={false}
        shareUrl={null}
        responsesUrl={null}
      />

      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 text-center">
        <input
          autoFocus
          type="text"
          value={draftTitle}
          onChange={(event) => {
            setDraftTitle(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              setStarted(true);
            }
          }}
          placeholder="Form title"
          className={`${displayFont.className} w-full text-center text-4xl font-semibold text-foreground/70 placeholder:text-muted-foreground/50 outline-none bg-transparent md:text-5xl`}
          aria-label="Form title"
        />
        <div className="mt-10 flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <button
            onClick={() => setStarted(true)}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 hover:bg-accent"
          >
            <CornerDownLeft className="h-4 w-4" />
            Press Enter to start from scratch
          </button>
          <button className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-muted-foreground/80 hover:bg-accent">
            <LayoutTemplate className="h-4 w-4" />
            Use a template
          </button>
        </div>
        <p className="mt-8 max-w-xl text-sm text-muted-foreground">
          Tally is a form builder that{" "}
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
            works like a doc
          </span>
          . Just type{" "}
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
            /
          </span>{" "}
          to insert form blocks.
        </p>
        <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-8 text-left md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Get started
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="group inline-flex items-center gap-2 text-foreground hover:text-blue-600 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Create your first form
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <LayoutTemplate className="h-4 w-4" />
                Get started with templates
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <Share2 className="h-4 w-4" />
                Embed your form
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <BookOpen className="h-4 w-4" />
                Help center
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <Wand2 className="h-4 w-4" />
                Learn about Tally Pro
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              How-to guides
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                Conditional logic
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <Calculator className="h-4 w-4" />
                Calculator
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <EyeOff className="h-4 w-4" />
                Hidden fields
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <AtSign className="h-4 w-4" />
                Mentions
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
              <button
                type="button"
                aria-disabled="true"
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground transition-colors cursor-not-allowed"
              >
                <DollarSign className="h-4 w-4" />
                Collect payments
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Ban className="h-3.5 w-3.5 text-destructive" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
