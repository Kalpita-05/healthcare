import { useState } from "react";
import { Footprints, Droplets, Moon, Heart, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { QuickStats } from "@/hooks/useHealthStore";

interface Props {
  stats: QuickStats;
  onUpdateStats: (partial: Partial<QuickStats>) => void;
  hasData: boolean;
}

const statItems = [
  { key: "steps" as const, label: "Steps", icon: Footprints, unit: "", color: "text-primary" },
  { key: "water" as const, label: "Water", icon: Droplets, unit: "L", color: "text-accent" },
  { key: "sleep" as const, label: "Sleep", icon: Moon, unit: "h", color: "text-primary" },
  { key: "heartRate" as const, label: "Heart Rate", icon: Heart, unit: "bpm", color: "text-destructive" },
];

export default function QuickStatsRow({ stats, onUpdateStats, hasData }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const startEdit = (key: string, val: number) => {
    setEditing(key);
    setEditVal(String(val));
  };

  const commitEdit = (key: keyof QuickStats) => {
    const num = parseFloat(editVal);
    if (!isNaN(num) && num >= 0) {
      onUpdateStats({ [key]: num });
    }
    setEditing(null);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-up">
      {statItems.map(({ key, label, icon: Icon, unit, color }) => (
        <div key={key} className="glass-card p-4 hover-card group">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl bg-primary/10 ${color}`}>
              <Icon size={20} />
            </div>
            {editing !== key && (
              <button
                onClick={() => startEdit(key, stats[key] as number)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
          {editing === key ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && commitEdit(key)}
                className="h-8 text-sm rounded-lg"
                autoFocus
              />
              <button onClick={() => commitEdit(key)} className="text-primary hover:text-primary/80">
                <Check size={16} />
              </button>
            </div>
          ) : (
            <p className="text-2xl font-heading font-bold text-foreground">
              {(stats[key] as number) === 0 && !hasData ? "—" : `${key === "steps" ? (stats[key] as number).toLocaleString() : stats[key]}${unit}`}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
