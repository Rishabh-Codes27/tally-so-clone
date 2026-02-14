import Link from "next/link";
import { FileText } from "lucide-react";

export interface FormData {
  id: number;
  title: string;
  share_id: string;
  response_count?: number;
  created_at: string;
}

interface FormCardProps {
  form: FormData;
}

export function FormCard({ form }: FormCardProps) {
  return (
    <Link
      href={`/responses/${form.id}`}
      className="rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-border/80 transition-all group"
    >
      <div className="w-full h-32 rounded-lg bg-muted/50 mb-4 flex items-center justify-center">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
        {form.title || "Untitled"}
      </h3>
      <p className="text-xs text-muted-foreground mt-1">
        Created {new Date(form.created_at).toLocaleDateString()}
      </p>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {form.response_count || 0}{" "}
          {(form.response_count || 0) === 1 ? "response" : "responses"}
        </span>
      </div>
    </Link>
  );
}

interface FormsGridProps {
  forms: FormData[];
  maxItems?: number;
}

export function FormsGrid({ forms, maxItems }: FormsGridProps) {
  const displayForms = maxItems ? forms.slice(0, maxItems) : forms;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayForms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
}
