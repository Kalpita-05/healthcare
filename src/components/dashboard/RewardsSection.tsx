import { Trophy, Flame, Star, Award, Droplets } from "lucide-react";
import type { DailyTask, HealthBadge } from "@/hooks/useHealthStore";

interface Props {
  streak: number;
  tasks: DailyTask[];
  hasData: boolean;
  badges: HealthBadge[];
}

export default function RewardsSection({ streak, tasks, hasData, badges }: Props) {
  const iconMap: Record<string, typeof Flame> = {
    "7 Day Consistency": Flame,
    "Hydration Hero": Droplets,
    "Sleep Master": Star,
    "30-Day Discipline": Award,
  };

  return (
    <div className="glass-card p-6 fade-up hover-card">
      <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <Trophy size={18} className="text-accent" /> Rewards & Streaks
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <Flame size={20} className="text-accent" />
        <span className="text-2xl font-bold text-foreground">{streak}</span>
        <span className="text-sm text-muted-foreground">day streak</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map(({ key, label, earned }) => {
          const Icon = iconMap[label] || Trophy;
          return (
          <div key={label} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ${earned ? "bg-primary/10 hover:bg-primary/15 shadow-sm" : "bg-muted opacity-50"}`}>
            <Icon size={24} className={earned ? "text-primary" : "text-muted-foreground"} />
            <span className="text-xs text-center font-medium text-foreground">{label}</span>
          </div>
          );
        })}
      </div>
      {!hasData && <p className="text-xs text-muted-foreground mt-3">Start logging daily entries to unlock badges.</p>}
    </div>
  );
}
