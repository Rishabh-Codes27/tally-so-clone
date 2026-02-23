"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormBuilder } from "@/components/form-builder/form-builder";
import type { FormBlock } from "@/components/form-builder/types";
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
  ArrowLeft,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { getFormById } from "@/lib/api";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function BuilderPageClient() {
  const searchParams = useSearchParams();
  const formIdParam = searchParams.get("formId");
  const formId = useMemo(
    () => (formIdParam ? Number(formIdParam) : null),
    [formIdParam],
  );
  const [started, setStarted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [editingForm, setEditingForm] = useState<{
    id: number;
    title: string;
    blocks: FormBlock[];
    share_id: string;
  } | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId || Number.isNaN(formId)) return;
    setEditLoading(true);
    setEditError(null);
    getFormById(formId)
      .then((form) => {
        setEditingForm(form);
      })
      .catch((error) => {
        setEditError(error instanceof Error ? error.message : "Load failed");
      })
      .finally(() => setEditLoading(false));
  }, [formId]);

  useEffect(() => {
    if (started || selectedTemplate !== null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setStarted(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, selectedTemplate]);

  if (formId) {
    if (editLoading) {
      return <div className="min-h-screen bg-background" />;
    }
    if (editError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-sm text-destructive">{editError}</div>
        </div>
      );
    }
    if (editingForm) {
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/s/${editingForm.share_id}`
          : null;
      const responsesUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/responses/${editingForm.id}`
          : null;
      return (
        <FormBuilder
          initialTitle={editingForm.title}
          initialBlocks={editingForm.blocks}
          autoFocusFirstBlock={true}
          formId={editingForm.id}
          initialShareUrl={shareUrl}
          initialResponsesUrl={responsesUrl}
        />
      );
    }
  }

  if (selectedTemplate !== null) {
    const template = TEMPLATES[selectedTemplate];
    return (
      <FormBuilder
        initialTitle={template.title}
        initialBlocks={template.blocks}
        autoFocusFirstBlock={true}
      />
    );
  }

  if (started) {
    return <FormBuilder initialTitle={draftTitle} autoFocusFirstBlock={true} />;
  }

  const noop = () => undefined;
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar
        formTitle="Untitled"
        isPreview={false}
        onTogglePreview={noop}
        onPublish={noop}
        isPublishing={false}
        shareUrl={null}
        responsesUrl={null}
        publishLabel="Publish"
      />

      <main className="mx-auto flex max-w-4xl flex-col items-start px-6 pt-20 pb-20">
        <div className="w-full max-w-2xl">
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
            className={`${displayFont.className} w-full text-left text-5xl md:text-6xl font-bold text-gray-400 placeholder:text-gray-300 outline-none bg-transparent`}
            aria-label="Form title"
          />

          <div className="mt-12 flex flex-col items-start gap-4 text-sm text-gray-600">
            <button
              onClick={() => setStarted(true)}
              className="flex items-center gap-2 px-4 py-2 hover:text-gray-800 transition-colors"
            >
              <CornerDownLeft className="h-4 w-4" />
              Press Enter to start from scratch
            </button>
            <button
              onClick={() => router.push("/templates")}
              className="flex items-center gap-2 px-4 py-2 hover:text-gray-800 transition-colors"
            >
              <LayoutTemplate className="h-4 w-4" />
              Use a template
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              Tally is a form builder that{" "}
              <span className="font-semibold text-pink-500">
                works like a doc
              </span>
              .
              <br />
              Just type{" "}
              <span className="font-semibold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">
                /
              </span>{" "}
              to insert form blocks and{" "}
              <span className="font-semibold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">
                @
              </span>{" "}
              to mention question answers.
            </p>
          </div>
        </div>

        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="text-sm font-bold text-gray-900 mb-6">
              Get started
            </div>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors text-sm"
              >
                <Sparkles className="h-4 w-4" />
                Create your first form
              </button>
              <button
                type="button"
                onClick={() => router.push("/templates")}
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors text-sm"
              >
                <LayoutTemplate className="h-4 w-4" />
                Get started with templates
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <Share2 className="h-4 w-4" />
                Embed your form
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <BookOpen className="h-4 w-4" />
                Help center
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <Wand2 className="h-4 w-4" />
                Learn about Tally Pro
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900 mb-6">
              How-to guides
            </div>
            <div className="space-y-4">
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                Conditional logic
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <Calculator className="h-4 w-4" />
                Calculator
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <EyeOff className="h-4 w-4" />
                Hidden fields
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <AtSign className="h-4 w-4" />
                Mentions
              </button>
              <button
                type="button"
                className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors text-sm cursor-not-allowed"
              >
                <DollarSign className="h-4 w-4" />
                Collect payments
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
