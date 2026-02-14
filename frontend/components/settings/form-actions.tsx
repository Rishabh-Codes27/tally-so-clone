interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

export function FormActions({
  onSave,
  onCancel,
  isSaving,
  saveLabel = "Save",
  cancelLabel = "Cancel",
}: FormActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
      >
        {isSaving ? "Saving..." : saveLabel}
      </button>
      <button
        onClick={onCancel}
        disabled={isSaving}
        className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
