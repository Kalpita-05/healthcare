import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DayLog } from "@/hooks/useHealthStore";

interface Props {
  weeklyLogs: DayLog[];
}

function getLevel(key: string, val: number): string {
  if (val <= 0) return "Very Low";
  if (key === "sleep") return val >= 7 ? "Optimal" : val >= 6 ? "Good" : val >= 4 ? "Low" : "Very Low";
  if (key === "water") return val >= 2.5 ? "Optimal" : val >= 2 ? "Good" : val >= 1 ? "Low" : "Very Low";
  if (key === "heartRate") return val <= 78 ? "Optimal" : val <= 92 ? "Good" : val <= 105 ? "Low" : "Very Low";
  if (key === "steps") return val >= 10000 ? "Optimal" : val >= 7000 ? "Good" : val >= 3000 ? "Low" : "Very Low";
  return "";
}

export default function GraphsRow({ weeklyLogs }: Props) {
  const hasLogs = weeklyLogs.length > 0;

  const ordered = [...weeklyLogs].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = hasLogs
    ? ordered.map(log => ({
      day: log.day,
      sleep: log.sleepHours,
      water: log.waterIntake,
      heartRate: log.heartRate,
      steps: log.steps,
    }))
    : Array.from({ length: 7 }, (_, idx) => ({ day: `D${idx + 1}`, sleep: 0, water: 0, heartRate: 0, steps: 0 }));

  const charts = [
    { title: "Sleep", dataKey: "sleep", color: "var(--primary)", unit: "h" },
    { title: "Hydration", dataKey: "water", color: "var(--accent)", unit: "L" },
    { title: "Heart Rate", dataKey: "heartRate", color: "var(--destructive)", unit: "bpm" },
    { title: "Activity", dataKey: "steps", color: "var(--primary)", unit: "steps" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {charts.map(({ title, dataKey, color, unit }) => (
        <div key={title} className="glass-card p-5 fade-up hover-card">
          <h4 className="font-heading font-medium text-foreground mb-3 text-sm">{title}</h4>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }}
                formatter={(v: number) => {
                  const level = getLevel(dataKey, Number(v));
                  return [`${Number(v)} ${unit} (${level})`, title];
                }}
              />
              <Area type="monotone" dataKey={dataKey} stroke={`hsl(${color})`} fill={`hsl(${color} / 0.15)`} strokeWidth={2} dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
          {!hasLogs && <p className="text-sm text-muted-foreground mt-2">No sufficient data yet</p>}
        </div>
      ))}
    </div>
  );
}
