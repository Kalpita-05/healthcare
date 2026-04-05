import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { DayLog } from "@/hooks/useHealthStore";

interface Props {
  weeklyLogs: DayLog[];
}

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getLevel(key: string, val: number): string {
  if (val === 0) return "";
  if (key === "sleep") return val >= 7 ? "Optimal" : val >= 5 ? "Moderate" : "Low";
  if (key === "water") return val >= 2.5 ? "Optimal" : val >= 1.5 ? "Moderate" : "Low";
  if (key === "calories") return val >= 1800 && val <= 2400 ? "Optimal" : val >= 1500 ? "Moderate" : "Low";
  if (key === "steps") return val >= 10000 ? "Optimal" : val >= 5000 ? "Moderate" : "Low";
  return "";
}

export default function GraphsRow({ weeklyLogs }: Props) {
  const hasLogs = weeklyLogs.length > 0;

  const logMap = new Map(weeklyLogs.map(l => [l.day, l]));
  const chartData = allDays.map(day => {
    const log = logMap.get(day);
    return {
      day,
      sleep: log?.sleep || 0,
      water: log?.water || 0,
      calories: log?.calories || 0,
      steps: log?.steps || 0,
    };
  });

  const charts = [
    { title: "Sleep", dataKey: "sleep", color: "var(--primary)", unit: "h" },
    { title: "Hydration", dataKey: "water", color: "var(--accent)", unit: "L" },
    { title: "Calories", dataKey: "calories", color: "var(--destructive)", unit: "kcal" },
    { title: "Activity", dataKey: "steps", color: "var(--primary)", unit: "steps" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {charts.map(({ title, dataKey, color, unit }) => (
        <div key={title} className="glass-card p-5 fade-up hover-card">
          <h4 className="font-heading font-medium text-foreground mb-3 text-sm">{title}</h4>
          {!hasLogs ? (
            <div className="flex items-center justify-center h-[160px]">
              <p className="text-sm text-muted-foreground">No sufficient data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }}
                  formatter={(v: number) => {
                    const level = getLevel(dataKey, v);
                    return [`${v} ${unit}${level ? ` (${level})` : ""}`, title];
                  }}
                />
                <Area type="monotone" dataKey={dataKey} stroke={`hsl(${color})`} fill={`hsl(${color} / 0.15)`} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      ))}
    </div>
  );
}
