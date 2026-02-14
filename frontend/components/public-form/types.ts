import type { FormBlock } from "@/components/form-builder/types";

type FormResponse = {
  id: number;
  title: string;
  blocks: FormBlock[];
  share_id: string;
  share_url: string | null;
  created_at: string;
  updated_at: string;
};

type AnswerMap = Record<string, unknown>;

type PublicFormState = {
  form: FormResponse | null;
  error: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  submitSuccess: boolean;
};

export type { FormResponse, AnswerMap, PublicFormState };
