import { LucideIcon } from "lucide-react";

export interface StatCard {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface StatCardProps {
  stat: StatCard;
}

export function StatsCard({ stat }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {stat.value}
          </p>
        </div>
        <div className={`${stat.bgColor} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${stat.color}`} />
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatCard[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <StatsCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
