import { Moon, Footprints, Smile } from "lucide-react";
import type { DayLog } from "@/hooks/useHealthStore";

interface Props {
  weeklyLogs: DayLog[];
}

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const moodEmoji = (mood: number) => {
  if (mood >= 5) return "😊";
  if (mood >= 4) return "🙂";
  if (mood >= 3) return "😐";
  if (mood >= 2) return "😴";
  return "😫";
};

export default function TimelineRow({ weeklyLogs }: Props) {
  const logMap = new Map(weeklyLogs.map(l => [l.day, l]));

  // Find best/worst days based on mood
  const best = weeklyLogs.length > 0 ? weeklyLogs.reduce((a, b) => a.mood > b.mood ? a : b) : null;
  const worst = weeklyLogs.length > 0 ? weeklyLogs.reduce((a, b) => a.mood < b.mood ? a : b) : null;

  return (
    <div className="glass-card p-6 fade-up hover-card">
      <h3 className="font-heading font-semibold text-foreground mb-1">Weekly Timeline</h3>
      {weeklyLogs.length > 0 && (
        <div className="flex gap-4 text-xs text-muted-foreground mb-4">
          {best && <span>🏆 Best: <strong className="text-foreground">{best.day}</strong></span>}
          {worst && <span>⚠️ Worst: <strong className="text-foreground">{worst.day}</strong></span>}
        </div>
      )}

      {weeklyLogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">No data yet</p>
          <p className="text-muted-foreground text-xs mt-1">Log your daily data to see your weekly timeline</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {allDays.map(day => {
            const log = logMap.get(day);
            const isBest = best && best.day === day;
            const isWorst = worst && worst.day === day && weeklyLogs.length > 1;

            return (
              <div
                key={day}
                className={`rounded-2xl p-3 text-center transition-all duration-300 ${
                  log
                    ? isBest
                      ? "bg-health-good/10 ring-2 ring-health-good shadow-md"
                      : isWorst
                        ? "bg-destructive/10 ring-2 ring-destructive"
                        : "bg-muted/50"
                    : "bg-muted/30 opacity-50"
                }`}
              >
                <p className="text-xs font-semibold text-foreground mb-2">{day}</p>
                {log ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Moon size={10} /> {log.sleep}h
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Footprints size={10} /> {(log.steps / 1000).toFixed(1)}k
                    </div>
                    <p className="text-lg">{moodEmoji(log.mood)}</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">—</p>
                    <p className="text-xs text-muted-foreground">—</p>
                    <p className="text-lg opacity-30">😶</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
