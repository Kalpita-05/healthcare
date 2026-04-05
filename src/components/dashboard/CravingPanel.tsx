import { useState } from "react";
import { Cookie, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const cravingResponses: Record<string, string> = {
  chocolate: "Try dark chocolate (70%+) with almonds — satisfies the craving with antioxidants!",
  chips: "Try air-popped popcorn with a pinch of salt, or baked veggie chips.",
  soda: "Try sparkling water with lemon or mint. Refreshing and zero sugar!",
  "ice cream": "Try frozen yogurt with berries, or a frozen banana blend.",
  pizza: "Try a whole-wheat tortilla with tomato, mozzarella, and veggies — baked crispy!",
  candy: "Try fresh fruit like grapes or mango slices — natural sweetness!",
  burger: "Try a grilled chicken or turkey patty with fresh veggies.",
  fries: "Try baked sweet potato fries with a dash of paprika.",
  cake: "Try a banana oat muffin — naturally sweet and filling.",
  coffee: "Try green tea or matcha — gentler caffeine with antioxidants.",
  sweet: "Try dates with peanut butter — naturally sweet and protein-rich.",
  spicy: "Try roasted chickpeas with chili powder — crunchy and spicy!",
  crunchy: "Try carrot sticks with hummus, or mixed nuts and seeds.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(cravingResponses)) {
    if (lower.includes(key)) return response;
  }
  return "Try a handful of mixed nuts or fresh fruit — healthy, satisfying alternatives!";
}

export default function CravingPanel() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setResponse(getResponse(input));
  };

  return (
    <div className="glass-card p-6 fade-up hover-card">
      <div className="flex items-center gap-2 mb-3">
        <Cookie size={18} className="text-accent" />
        <h4 className="font-heading font-medium text-foreground">Craving Control</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-3">Tell us what you're craving and we'll suggest a healthier alternative.</p>
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
        <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-sm text-foreground">🌿 {response}</p>
        </div>
      )}
    </div>
  );
}
