import { Activity, Droplets, Zap } from "lucide-react";

interface Props {
  healthScore: number;
  stats: { steps: number; water: number; sleep: number; mood: string };
  suggestions: { text: string; sub: string }[];
  hasData: boolean;
}

export default function HealthStatusRow({ healthScore, stats, suggestions, hasData }: Props) {
  const scoreColor = healthScore >= 70 ? "score-good" : healthScore >= 40 ? "score-warn" : "score-bad";
  const scoreBg = healthScore >= 70 ? "bg-good" : healthScore >= 40 ? "bg-warn" : "bg-bad";

  const currentSuggestion = suggestions.length > 0
    ? suggestions[Math.floor(Date.now() / 30000) % suggestions.length]
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Health Score */}
      <div className="glass-card p-6 flex flex-col items-center justify-center fade-up hover-card">
        <Activity size={24} className="text-primary mb-2" />
        <p className="text-sm text-muted-foreground mb-1">Health Score</p>
        <p className={`text-5xl font-heading font-bold ${hasData ? scoreColor : "text-muted-foreground"}`}>
          {hasData ? healthScore : "—"}
        </p>
        <div className="w-full mt-3 h-2.5 rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full ${hasData ? scoreBg : "bg-muted-foreground/20"} transition-all duration-700`} style={{ width: `${hasData ? healthScore : 0}%` }} />
        </div>
        {!hasData && <p className="text-xs text-muted-foreground mt-2">Enter your data to see score</p>}
      </div>

      {/* Today's Summary */}
      <div className="glass-card p-6 fade-up hover-card" style={{ animationDelay: "0.1s" }}>
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2"><Droplets size={16} className="text-primary" /> Today's Summary</p>
        <div className="space-y-2.5 text-sm">
          {[
            { label: "Sleep", value: hasData && stats.sleep > 0 ? `${stats.sleep} hours` : "No data yet" },
            { label: "Steps", value: hasData && stats.steps > 0 ? stats.steps.toLocaleString() : "No data yet" },
            { label: "Water", value: hasData && stats.water > 0 ? `${stats.water}L` : "No data yet" },
            { label: "Mood", value: stats.mood },
          ].map(r => (
            <div key={r.label} className="flex justify-between">
              <span className="text-muted-foreground">{r.label}</span>
              <span className={`font-medium ${r.value === "No data yet" ? "text-muted-foreground italic" : "text-foreground"}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Now Decision */}
      <div className="glow-card p-6 fade-up hover-card" style={{ animationDelay: "0.2s" }}>
        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2"><Zap size={16} className="text-accent" /> Right Now</p>
        {currentSuggestion ? (
          <>
            <p className="text-lg font-heading font-semibold text-foreground">{currentSuggestion.text}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentSuggestion.sub}</p>
          </>
        ) : (
          <>
            <p className="text-lg font-heading font-semibold text-muted-foreground">No suggestions yet</p>
            <p className="text-sm text-muted-foreground mt-1">Enter your daily data to get personalized recommendations</p>
          </>
        )}
      </div>
    </div>
  );
}
