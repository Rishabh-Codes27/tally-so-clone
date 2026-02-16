"use client";

import { useEffect, useState } from "react";
import { getFormByShareId, submitForm } from "@/lib/api";
import type { AnswerMap, FormResponse, PublicFormState } from "./types";
import { PublicFormFields } from "./public-form-fields";
import { validateAnswers } from "@/lib/form-validation";

interface PublicFormProps {
  shareId: string;
}

export function PublicForm({ shareId }: PublicFormProps) {
  const [state, setState] = useState<PublicFormState>({
    form: null,
    error: null,
    isLoading: true,
    isSubmitting: false,
    submitSuccess: false,
  });
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getCountryFromLocale = () => {
    if (typeof navigator === "undefined") return "";
    const locale = navigator.language || "";
    const parts = locale.split("-");
    return parts.length > 1 ? parts[1].toUpperCase() : "";
  };

  useEffect(() => {
    if (!shareId) return;
    let isMounted = true;
    setState((prev) => ({ ...prev, isLoading: true }));
    getFormByShareId(shareId)
      .then((form: FormResponse) => {
        if (!isMounted) return;
        setState({
          form,
          error: null,
          isLoading: false,
          isSubmitting: false,
          submitSuccess: false,
        });
      })
      .catch((error) => {
        if (!isMounted) return;
        setState({
          form: null,
          error: error instanceof Error ? error.message : "Form not found",
          isLoading: false,
          isSubmitting: false,
          submitSuccess: false,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [shareId]);

  useEffect(() => {
    const form = state.form;
    if (!form) return;
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;

    setAnswers((prev) => {
      const next = { ...prev };
      for (const block of form.blocks) {
        if (block.type === "hidden-field") {
          const key = block.content?.trim() || block.id;
          if (params && params.has(key)) {
            next[block.id] = params.get(key) || "";
          }
        }
        if (block.type === "respondent-country" && !next[block.id]) {
          next[block.id] = getCountryFromLocale();
        }
      }
      return next;
    });
  }, [state.form]);

  const handleChange = (blockId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [blockId]: value }));
    setErrors((prev) => {
      if (!prev[blockId]) return prev;
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!state.form) return;
    const validation = validateAnswers(state.form.blocks, answers);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await submitForm(state.form.share_id, { data: answers });
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitSuccess: true,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : "Submit failed",
      }));
    }
  };

  if (!shareId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-destructive">
        Invalid share link
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading form...
      </div>
    );
  }

  if (state.error || !state.form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-destructive">
        {state.error || "Form not found"}
      </div>
    );
  }

  const thankYouBlock = state.form.blocks.find(
    (block) => block.type === "thank-you-page",
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            {state.form.title || "Untitled"}
          </h1>
        </div>

        <PublicFormFields
          blocks={state.form.blocks}
          answers={answers}
          onChange={handleChange}
          errors={errors}
        />

        <div className="mt-10 flex justify-start">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={state.isSubmitting}
            className="px-6 py-2 rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {state.isSubmitting ? "Submitting..." : "Submit response"}
          </button>
        </div>

        {state.submitSuccess ? (
          <div className="mt-6 rounded-md border border-border/50 bg-muted/30 px-4 py-3 text-sm text-foreground">
            <div className="font-semibold">
              {thankYouBlock?.content || "Thanks!"}
            </div>
            <div className="text-xs text-muted-foreground">
              Your response has been recorded.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
