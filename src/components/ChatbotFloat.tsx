import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuickStats } from "@/hooks/useHealthStore";
import { useLocation } from "react-router-dom";

interface Message {
  role: "user" | "bot";
  text: string;
}

interface Props {
  stats: QuickStats;
  hasData: boolean;
}

const quickReplies = ["How am I doing today?", "Why am I tired?", "What should I improve first?"];

function getResponse(text: string, stats: QuickStats, hasData: boolean): string {
  const lower = text.toLowerCase();

  // Only health/fitness/app-related
  const healthKeywords = ["health", "tired", "sleep", "eat", "water", "steps", "walk", "exercise", "heart", "mood", "weight", "diet", "calor", "hydrat", "stress", "energy", "score", "help", "feel"];
  const isHealthRelated = healthKeywords.some(k => lower.includes(k));

  if (!isHealthRelated) {
    return "I can only help with health, fitness, and app-related questions. Try asking about your sleep, steps, hydration, or diet! 🌿";
  }

  if (!hasData) {
    return "I don't have enough data yet. Please enter your health stats (steps, water, sleep) on the dashboard first!";
  }

  if (lower.includes("tired") || lower.includes("energy")) {
    const reasons: string[] = [];
    if (stats.sleep < 7) reasons.push(`low sleep (${stats.sleep}h)`);
    if (stats.water < 2) reasons.push(`low hydration (${stats.water}L)`);
    if (stats.steps < 5000) reasons.push("low activity");
    return reasons.length > 0
      ? `Based on your data: ${reasons.join(" + ")}. ${stats.sleep < 7 ? "Try sleeping 30 min earlier tonight." : "Drink a glass of water now."}`
      : "Your metrics look okay! Tiredness could be related to stress or nutrition. Try a light walk. 🚶";
  }

  if (lower.includes("health") || lower.includes("score")) {
    return `Your current stats — Sleep: ${stats.sleep}h, Steps: ${stats.steps.toLocaleString()}, Water: ${stats.water}L. ${stats.sleep >= 7 && stats.water >= 2 ? "Looking good! 🎉" : "There's room for improvement."}`;
  }

  if (lower.includes("eat") || lower.includes("diet")) {
    return "For your next meal, try grilled protein with vegetables and whole grains. Stay hydrated! Check the Diet Planner for a full plan. 🥗";
  }

  if (lower.includes("water") || lower.includes("hydrat")) {
    return `You've had ${stats.water}L today. ${stats.water < 2.5 ? `You need about ${(2.5 - stats.water).toFixed(1)}L more. Drink a glass now! 💧` : "Great hydration level! Keep it up! 💧"}`;
  }

  if (lower.includes("sleep")) {
    return `You slept ${stats.sleep}h. ${stats.sleep < 7 ? "That's below recommended. Try winding down 30 min earlier tonight. 😴" : "Good sleep! Keep maintaining this routine. ✨"}`;
  }

  if (lower.includes("step") || lower.includes("walk") || lower.includes("exercise")) {
    return `You've taken ${stats.steps.toLocaleString()} steps today. ${stats.steps < 10000 ? `${(10000 - stats.steps).toLocaleString()} more to go! Try a short walk. 🚶` : "Amazing! You've hit your step goal! 🎉"}`;
  }

  return "I can help with sleep, hydration, activity, and diet questions. Try asking about your health! 🌿";
}

export default function ChatbotFloat({ stats, hasData }: Props) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([{ role: "bot", text: "Hey! How can I help with your health today? 🌿" }]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  useEffect(() => {
    if (location.hash === "#chatbot" || location.pathname === "/chatbot") {
      setOpen(true);
    }
  }, [location.hash, location.pathname]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: "bot", text: getResponse(text, stats, hasData) }]);
    }, 600);
  };

  return (
    <>
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          <div className="glass-card px-3 py-1.5 text-xs text-muted-foreground animate-fade-in">
            Need help? 💬
          </div>
          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[28rem] glass-card flex flex-col animate-scale-in overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h4 className="font-heading font-semibold text-foreground">🤖 Health Assistant</h4>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[80%] text-sm p-3 rounded-2xl ${m.role === "bot" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground ml-auto"}`}>
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="px-4 pb-2">
            <div className="flex gap-1.5 mb-2 overflow-x-auto">
              {quickReplies.map(q => (
                <button key={q} onClick={() => send(q)} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground whitespace-nowrap hover:bg-primary/10 transition-colors">
                  {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask about your health…" className="rounded-xl text-sm" />
              <Button size="icon" onClick={() => send(input)} className="rounded-xl shrink-0"><Send size={16} /></Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
