import { Activity, Droplets, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  healthScore: number;
  stats: { steps: number; water: number; sleep: number; mood: string };
  suggestions: { text: string; sub: string }[];
  hasData: boolean;
}

export default function HealthStatusRow({ healthScore, stats, suggestions, hasData }: Props) {
  const scoreColor = healthScore >= 70 ? "score-good" : healthScore >= 40 ? "score-warn" : "score-bad";
  const currentSuggestion = suggestions.length > 0 ? suggestions[0] : null;
  const chartData = [
    { name: "score", value: hasData ? healthScore : 0 },
    { name: "remaining", value: hasData ? 100 - healthScore : 100 },
  ];
  const scoreStroke = hasData ? (healthScore >= 70 ? "hsl(var(--health-good))" : healthScore >= 40 ? "hsl(var(--health-warn))" : "hsl(var(--health-bad))") : "hsl(var(--muted-foreground))";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="glass-card p-6 flex flex-col items-center justify-center fade-up hover-card">
        <Activity size={24} className="text-primary mb-3" />
        <p className="text-sm text-muted-foreground mb-1">Health Score</p>
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius={55}
                outerRadius={72}
                stroke="none"
                isAnimationActive
                animationDuration={900}
              >
                <Cell fill={scoreStroke} />
                <Cell fill="hsl(var(--muted) / 0.6)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-4xl font-heading font-bold ${hasData ? scoreColor : "text-muted-foreground"}`}>{hasData ? healthScore : "0"}</p>
            <p className="text-xs text-muted-foreground">/100</p>
          </div>
        </div>
        {!hasData && <p className="text-xs text-muted-foreground mt-2">Enter your data to see score</p>}
      </div>

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
