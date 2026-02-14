import { LucideIcon } from "lucide-react";

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  iconColor,
  iconBgColor,
  children,
  disabled = false,
}: SettingsCardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 ${disabled ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`h-10 w-10 rounded-lg ${iconBgColor} flex items-center justify-center`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
