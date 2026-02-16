import Link from "next/link";
import { FileText, Plus, LayoutTemplate } from "lucide-react";

interface QuickAction {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

const quickActions: QuickAction[] = [
  {
    href: "/builder",
    icon: Plus,
    title: "Create new form",
    description: "Start from scratch",
    iconBgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    href: "/builder?view=templates",
    icon: LayoutTemplate,
    title: "Use a template",
    description: "Start with a template",
    iconBgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    href: "/dashboard/forms",
    icon: FileText,
    title: "View all forms",
    description: "Manage your forms",
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Quick actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all"
            >
              <div
                className={`h-10 w-10 rounded-lg ${action.iconBgColor} flex items-center justify-center`}
              >
                <Icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {action.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
