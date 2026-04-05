import { Zap, RotateCcw, CalendarCheck, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Props {
  actions: {
    immediate: string[];
    recovery: string[];
    plan: { text: string; status: string }[];
  };
  hasData: boolean;
}

export default function ActionRow({ actions, hasData }: Props) {
  const navigate = useNavigate();

  if (!hasData) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-6 fade-up hover-card text-center">
          <Info size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No actions yet</p>
          <p className="text-muted-foreground text-xs mt-1">Enter your health data to get personalized action items</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/tasks")} className="rounded-xl font-semibold">
            📅 Let's See Today's Tasks
          </Button>
          <Button variant="outline" onClick={() => navigate("/diet")} className="rounded-xl font-semibold">
            🍽️ Diet Recommendations
          </Button>
        </div>
      </div>
    );
  }

  const sections = [
    { title: "Immediate Actions", icon: Zap, items: actions.immediate },
    { title: "Missed Habit Recovery", icon: RotateCcw, items: actions.recovery },
    {
      title: "Daily Health Plan",
      icon: CalendarCheck,
      items: actions.plan.map(p => `${p.text} ${p.status}`),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map(({ title, icon: Icon, items }) => (
          <div key={title} className="glass-card p-5 fade-up hover-card">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={18} className="text-primary" />
              <h4 className="font-heading font-medium text-foreground">{title}</h4>
            </div>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={14} className="text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate("/tasks")} className="rounded-xl font-semibold">
          📅 Let's See Today's Tasks
        </Button>
        <Button variant="outline" onClick={() => navigate("/diet")} className="rounded-xl font-semibold">
          🍽️ Diet Recommendations
        </Button>
      </div>
    </div>
  );
}
