import { Utensils, Sun, CloudSun, Moon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const meals = [
  {
    time: "Breakfast",
    icon: Sun,
    items: ["Oatmeal with berries & nuts", "Green tea or black coffee", "1 boiled egg"],
  },
  {
    time: "Lunch",
    icon: CloudSun,
    items: ["Grilled chicken salad", "Brown rice / quinoa", "Steamed vegetables"],
  },
  {
    time: "Snack",
    icon: Utensils,
    items: ["Mixed nuts & seeds", "Greek yogurt", "Fresh fruit"],
  },
  {
    time: "Dinner",
    icon: Moon,
    items: ["Grilled fish / tofu", "Sweet potato", "Green leafy vegetables"],
  },
];

export default function DietPage() {
  return (
    <div className="flex-1 min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 h-14 flex items-center px-4 gap-2">
        <SidebarTrigger />
        <h2 className="font-heading font-semibold text-2xl tracking-wide text-gradient">Diet Recommendations</h2>
      </header>
      <main className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <p className="text-sm text-muted-foreground fade-up">Personalized daily diet plan based on your health profile.</p>
        {meals.map(({ time, icon: Icon, items }) => (
          <div key={time} className="glass-card p-5 fade-up">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={18} className="text-primary" />
              <h3 className="font-heading font-medium text-foreground">{time}</h3>
            </div>
            <ul className="space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="glass-card p-5 fade-up border-l-4 border-l-primary">
          <p className="text-sm text-muted-foreground">
            💡 <strong className="text-foreground">Tip:</strong> Eating dinner before 8 PM helps improve sleep quality and digestion.
          </p>
        </div>
      </main>
    </div>
  );
}
