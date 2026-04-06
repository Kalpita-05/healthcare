import { useState } from "react";
import { Cookie, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { analyzeCraving, type CravingAnalysisResult } from "@/lib/cravingAnalysis";
import type { QuickStats } from "@/hooks/useHealthStore";

interface Props {
  stats: QuickStats;
}

const quickCravings = ["sweet", "salty", "spicy", "junk food"];

function formatCravingTitle(craving: string) {
  const key = craving.trim().toLowerCase();
  if (!key) return "Craving";
  if (key.includes("junk")) return "Junk Food Craving 🍔";
  if (key.includes("sweet")) return "Sweet Craving 🍫";
  if (key.includes("salty")) return "Salty Craving 🥨";
  if (key.includes("spicy")) return "Spicy Craving 🌶️";
  return `${key.charAt(0).toUpperCase()}${key.slice(1)} Craving`;
}

function toMoodBucket(mood: string): "low" | "normal" | "good" {
  if (mood === "😫" || mood === "😴") return "low";
  if (mood === "😊" || mood === "🙂") return "good";
  return "normal";
}

export default function CravingPanel({ stats }: Props) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<CravingAnalysisResult | null>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setResponse(
      analyzeCraving(
        {
          sleepHours: stats.sleep,
          steps: stats.steps,
          waterIntake: stats.water,
          mood: toMoodBucket(stats.mood),
        },
        input,
      ),
    );
  };

  return (
    <div className="glass-card p-6 fade-up hover-card">
      <div className="flex items-center gap-2 mb-3">
        <Cookie size={18} className="text-accent" />
        <h4 className="font-heading font-medium text-foreground">Craving Control</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-3">Tell us what you're craving and we'll explain why, then offer two smart options.</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {quickCravings.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setInput(item)}
            className="px-3 py-1.5 rounded-full text-xs bg-secondary text-secondary-foreground hover:bg-primary/10"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="I am craving chocolate..."
          className="rounded-xl text-sm"
        />
        <Button onClick={handleSubmit} size="sm" className="rounded-xl shrink-0">
          <Sparkles size={14} className="mr-1" /> Suggest
        </Button>
      </div>
      {response && (
        <div className="mt-3 p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
          <h5 className="font-heading text-lg font-semibold text-foreground">{formatCravingTitle(response.craving)}</h5>

          <div>
            <p className="text-sm font-medium text-foreground">Why this craving</p>
            <ul className="mt-1 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {response.reasons.length > 0 ? (
                response.reasons.map(reason => <li key={reason}>{reason}</li>)
              ) : (
                <li>No major trigger detected from your current health data.</li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Option 1 (Activity)</p>
            <p className="text-sm text-muted-foreground mt-1">{response.activitySuggestion}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Option 2 (Smart Eating)</p>
            <p className="text-sm text-muted-foreground mt-1">{response.foodSuggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
