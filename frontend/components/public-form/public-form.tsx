"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
  const [pageIndex, setPageIndex] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!shareId) return;
    let isMounted = true;
    setPageIndex(0);
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
      }
      return next;
    });
  }, [state.form]);

  const pages = useMemo(() => {
    if (!state.form) return [] as FormResponse["blocks"][];
    const result: FormResponse["blocks"][] = [];
    let current: FormResponse["blocks"] = [];

    for (const block of state.form.blocks) {
      if (block.type === "new-page") {
        result.push(current);
        current = [];
        continue;
      }
      current.push(block);
    }

    if (current.length || result.length === 0) {
      result.push(current);
    }

    return result;
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

    // Check if form has reCAPTCHA block
    const hasRecaptcha = state.form.blocks.some(
      (block) => block.type === "recaptcha",
    );

    if (hasRecaptcha && !recaptchaToken) {
      setErrors({ recaptcha: "Please complete the reCAPTCHA" });
      return;
    }

    const validation = validateAnswers(state.form.blocks, answers);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await submitForm(state.form.share_id, {
        data: answers,
        recaptchaToken: hasRecaptcha
          ? (recaptchaToken ?? undefined)
          : undefined,
      });
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitSuccess: true,
      }));
      // Reset reCAPTCHA after successful submission
      if (hasRecaptcha && recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : "Submit failed",
      }));
      // Reset reCAPTCHA on error
      if (hasRecaptcha && recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    }
  };

  const handleNextPage = () => {
    if (!state.form) return;
    const currentBlocks = pages[pageIndex] ?? [];
    const validation = validateAnswers(currentBlocks, answers);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const handlePreviousPage = () => {
    setErrors({});
    setPageIndex((prev) => Math.max(prev - 1, 0));
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

  const hasRecaptcha = state.form.blocks.some(
    (block) => block.type === "recaptcha",
  );
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const isLastPage = pageIndex >= pages.length - 1;
  const currentBlocks = pages[pageIndex] ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-foreground">
            {state.form.title || "Untitled"}
          </h1>
        </div>

        <PublicFormFields
          blocks={currentBlocks}
          answers={answers}
          onChange={handleChange}
          errors={errors}
        />

        {hasRecaptcha && isLastPage && recaptchaSiteKey && (
          <div className="mt-8">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              onChange={(token) => {
                setRecaptchaToken(token);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.recaptcha;
                  return next;
                });
              }}
              onExpired={() => setRecaptchaToken(null)}
              onErrored={() => setRecaptchaToken(null)}
            />
            {errors.recaptcha && (
              <div className="mt-2 text-sm text-destructive">
                {errors.recaptcha}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {pageIndex > 0 ? (
            <button
              type="button"
              onClick={handlePreviousPage}
              className="px-5 py-2 rounded-md text-sm font-semibold text-foreground border border-border hover:bg-muted"
            >
              Back
            </button>
          ) : null}
          <button
            type="button"
            onClick={isLastPage ? handleSubmit : handleNextPage}
            disabled={state.isSubmitting}
            className="px-6 py-2 rounded-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {state.isSubmitting
              ? "Submitting..."
              : isLastPage
                ? "Submit response"
                : "Next"}
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
