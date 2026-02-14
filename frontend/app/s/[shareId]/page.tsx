"use client";

import { useParams } from "next/navigation";
import { PublicForm } from "@/components/public-form/public-form";

export default function PublicFormPage() {
  const params = useParams<{ shareId: string }>();
  const shareId = params?.shareId ?? "";
  return <PublicForm shareId={shareId} />;
}
