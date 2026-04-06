import { Moon, Footprints, Smile } from "lucide-react";
import type { DayLog, UserProfile } from "@/hooks/useHealthStore";

interface Props {
  weeklyLogs: DayLog[];
  profile: UserProfile | null;
  userMood: string;
}

const moodEmoji = (mood: number) => {
  if (mood >= 5) return "😊";
  if (mood >= 4) return "🙂";
  if (mood >= 3) return "😐";
  if (mood >= 2) return "😴";
  return "😫";
};

function timelineMessage(log: DayLog) {
  if (log.steps >= 10000) return "You walked like a warrior today 👣🔥";
  if (log.sleepHours < 6) return "Sleep was weak... your bed misses you 😴";
  if (log.waterIntake >= 2.5) return "Hydration legend mode unlocked 💧";
  if (log.energyLevel >= 4) return "Energy levels look elite today ⚡";
  return "Steady progress beats perfect progress 🌿";
}

function scoreForLog(log: DayLog) {
  return log.steps / 1200 + log.sleepHours * 8 + log.waterIntake * 12 + log.mood * 9 + log.energyLevel * 7;
}

export default function TimelineRow({ weeklyLogs, profile, userMood }: Props) {
  const baselineLog: DayLog | null = profile ? {
    id: "baseline",
    date: new Date().toISOString().slice(0, 10),
    day: "Start",
    sleepHours: profile.sleepDuration || 0,
    sleepQuality: 3,
    steps: Math.round((profile.walkingDistance || 0) * 1200),
    exercise: false,
    waterIntake: profile.waterIntake || 0,
    mealsHealthy: false,
    mood: userMood === "😊" ? 5 : userMood === "🙂" ? 4 : userMood === "😐" ? 3 : userMood === "😴" ? 2 : 1,
    energyLevel: 3,
    heartRate: profile.heartRate || 0,
    bloodPressure: "--",
  } : null;

  const ordered = [...(baselineLog ? [baselineLog] : []), ...weeklyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const best = ordered.length > 0 ? ordered.reduce((a, b) => scoreForLog(a) > scoreForLog(b) ? a : b) : null;
  const worst = ordered.length > 0 ? ordered.reduce((a, b) => scoreForLog(a) < scoreForLog(b) ? a : b) : null;

  return (
    <div className="glass-card p-6 fade-up hover-card">
      <h3 className="font-heading font-semibold text-foreground mb-1 text-xl">Interactive Timeline</h3>
      {ordered.length > 0 && (
        <div className="flex gap-4 text-xs text-muted-foreground mb-4">
          {best && <span>🏆 Best: <strong className="text-foreground">{best.day}</strong></span>}
          {worst && <span>⚠️ Worst: <strong className="text-foreground">{worst.day}</strong></span>}
        </div>
      )}

      {ordered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">No data yet</p>
          <p className="text-muted-foreground text-xs mt-1">Log your daily data to see your weekly timeline</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-max gap-1 px-2">
            {ordered.map((log, idx) => {
              const isBest = best && best.id === log.id;
              const isWorst = worst && worst.id === log.id && ordered.length > 1;
            return (
                <div key={log.id} className="group flex items-center">
                  <div
                    className={`relative rounded-full w-16 h-16 border-2 flex items-center justify-center text-lg transition-all duration-300 hover:scale-105 ${
                      isBest
                        ? "border-green-500 shadow-[0_0_18px_rgba(34,197,94,0.45)]"
                        : isWorst
                          ? "border-red-500"
                          : "border-border bg-card/70"
                    }`}
                  >
                    {moodEmoji(log.mood)}
                    <div className="pointer-events-none absolute z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-[72px] left-1/2 -translate-x-1/2 w-64 rounded-xl bg-card/95 border border-border p-3 text-xs shadow-xl">
                      <p className="font-semibold text-foreground mb-1">{new Date(log.date).toLocaleDateString()} ({log.day})</p>
                      <p className="text-muted-foreground flex items-center gap-1"><Moon size={10} /> Sleep: {log.sleepHours}h</p>
                      <p className="text-muted-foreground flex items-center gap-1"><Footprints size={10} /> Steps: {log.steps.toLocaleString()}</p>
                      <p className="text-muted-foreground flex items-center gap-1"><Smile size={10} /> Mood: {log.mood}/5</p>
                      <p className="text-foreground mt-2">{timelineMessage(log)}</p>
                    </div>
                  </div>
                  <div className="text-center mx-2 min-w-16">
                    <p className="text-xs font-semibold text-foreground">{log.day}</p>
                    <p className="text-[11px] text-muted-foreground">{log.sleepHours}h · {(log.steps / 1000).toFixed(1)}k</p>
                  </div>
                  {idx < ordered.length - 1 && (
                    <div className="h-1 w-10 rounded-full bg-gradient-to-r from-primary/50 to-accent/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
