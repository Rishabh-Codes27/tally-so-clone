import type { FormBlock } from "@/components/form-builder/types";

type FormCreatePayload = {
  title: string;
  blocks: FormBlock[];
};

type FormResponse = {
  id: number;
  title: string;
  blocks: FormBlock[];
  share_id: string;
  share_url: string | null;
  created_at: string;
  updated_at: string;
};

type SubmissionCreatePayload = {
  data: Record<string, unknown>;
};

type SubmissionResponse = {
  id: number;
  form_id: number;
  data: Record<string, unknown>;
  created_at: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function createForm(payload: FormCreatePayload) {
  const res = await fetch(`${API_BASE}/forms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson<FormResponse>(res);
}

export async function getFormByShareId(shareId: string) {
  const res = await fetch(`${API_BASE}/s/${shareId}`);
  return handleJson<FormResponse>(res);
}

export async function submitForm(
  shareId: string,
  data: SubmissionCreatePayload,
) {
  const res = await fetch(`${API_BASE}/s/${shareId}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleJson(res);
}

export async function listFormSubmissions(formId: number) {
  const res = await fetch(`${API_BASE}/forms/${formId}/submissions`);
  return handleJson<SubmissionResponse[]>(res);
}

export async function listForms() {
  const res = await fetch(`${API_BASE}/forms`);
  return handleJson<FormResponse[]>(res);
}

export async function deleteForm(formId: number) {
  const res = await fetch(`${API_BASE}/forms/${formId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to delete form");
  }
}
