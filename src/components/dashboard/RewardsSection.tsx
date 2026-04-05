import { Trophy, Flame, Star, Award, Droplets } from "lucide-react";
import type { DailyTask } from "@/hooks/useHealthStore";

interface Props {
  streak: number;
  tasks: DailyTask[];
  hasData: boolean;
}

export default function RewardsSection({ streak, tasks, hasData }: Props) {
  const doneTasks = tasks.filter(t => t.done).length;
  const badges = [
    { icon: Flame, label: "Streak Starter", earned: streak >= 3 },
    { icon: Droplets, label: "Hydration Hero", earned: hasData && doneTasks >= 4 },
    { icon: Star, label: "Step Master", earned: hasData && doneTasks >= 6 },
    { icon: Trophy, label: "Perfect Day", earned: hasData && doneTasks === tasks.length },
  ];

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
        {badges.map(({ icon: Icon, label, earned }) => (
          <div key={label} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 ${earned ? "bg-primary/10 hover:bg-primary/15 shadow-sm" : "bg-muted opacity-50"}`}>
            <Icon size={24} className={earned ? "text-primary" : "text-muted-foreground"} />
            <span className="text-xs text-center font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
