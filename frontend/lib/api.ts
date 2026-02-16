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
  response_count: number;
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

type PaymentSessionPayload = {
  block_id: string;
};

type PaymentSessionResponse = {
  id: string;
  url: string;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
};

type UserResponse = {
  id: number;
  username: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";
const TOKEN_KEY = "tally_auth_token";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized. Please sign in.");
    }
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function login(username: string, password: string) {
  const body = new URLSearchParams({ username, password });
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await handleJson<TokenResponse>(res);
  setAuthToken(data.access_token);
  return data;
}

export async function register(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleJson<TokenResponse>(res);
  setAuthToken(data.access_token);
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...authHeaders() },
  });
  return handleJson<UserResponse>(res);
}

export async function updateUser(username?: string, password?: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ username, password }),
  });
  return handleJson<UserResponse>(res);
}

export async function createForm(payload: FormCreatePayload) {
  const res = await fetch(`${API_BASE}/forms`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
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

export async function createPaymentSession(
  shareId: string,
  payload: PaymentSessionPayload,
) {
  const res = await fetch(`${API_BASE}/s/${shareId}/payment-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson<PaymentSessionResponse>(res);
}

export async function listFormSubmissions(formId: number) {
  const res = await fetch(`${API_BASE}/forms/${formId}/submissions`, {
    headers: { ...authHeaders() },
  });
  return handleJson<SubmissionResponse[]>(res);
}

export async function getFormById(formId: number) {
  const res = await fetch(`${API_BASE}/forms/${formId}`, {
    headers: { ...authHeaders() },
  });
  return handleJson<FormResponse>(res);
}

export async function listForms() {
  const res = await fetch(`${API_BASE}/forms`, {
    headers: { ...authHeaders() },
  });
  return handleJson<FormResponse[]>(res);
}

export async function deleteForm(formId: number) {
  const res = await fetch(`${API_BASE}/forms/${formId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to delete form");
  }
}
