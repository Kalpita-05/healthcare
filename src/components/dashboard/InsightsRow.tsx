import { AlertTriangle, Brain, Info } from "lucide-react";

interface Props {
  insights: { title: string; desc: string; severity: "warn" | "bad" }[];
  aiInsight: { text: string; tags: string[] } | null;
  hasData: boolean;
}

export default function InsightsRow({ insights, aiInsight, hasData }: Props) {
  if (!hasData) {
    return (
      <div className="glass-card p-6 fade-up hover-card text-center">
        <Info size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">No insights yet</p>
        <p className="text-muted-foreground text-xs mt-1">Enter your health data above to get personalized insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map(p => (
            <div key={p.title} className={`glass-card p-5 border-l-4 fade-up hover-card ${p.severity === "bad" ? "border-l-destructive" : "border-l-accent"}`}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} className={p.severity === "bad" ? "text-destructive" : "text-accent"} />
                <h4 className="font-heading font-medium text-foreground">{p.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      )}

      {aiInsight && (
        <div className="glow-card p-6 fade-up hover-card">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={20} className="text-primary" />
            <h4 className="font-heading font-semibold text-foreground">AI Insight</h4>
          </div>
          <p className="text-foreground">{aiInsight.text}</p>
          <div className="flex gap-2 mt-3">
            {aiInsight.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
