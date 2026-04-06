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

const quickReplies = [
  "How am I doing today?",
  "How can I improve sleep and energy?",
  "How do I use Daily Log and Simulation?",
  "What should I eat after a workout?",
];

const DOMAIN_KEYWORDS = [
  "health", "fitness", "workout", "exercise", "training", "cardio", "strength", "yoga", "run", "walk", "steps", "step",
  "diet", "meal", "nutrition", "protein", "carb", "fat", "calorie", "weight", "bmi", "water", "hydration", "sleep",
  "insomnia", "rest", "heart", "bp", "blood pressure", "mood", "stress", "energy", "wellness", "recovery", "tired",
  "dashboard", "daily log", "simulation", "profile", "timeline", "insights", "rewards", "tasks", "craving", "score", "app",
  "feature", "tracker", "habit", "goal", "doctor visit", "pregnancy", "elderly", "chronic"
];

const CLEARLY_OUT_OF_DOMAIN = [
  "capital of", "president", "election", "cricket score", "football score", "ipl", "movie", "song", "lyrics", "bitcoin",
  "stock", "share market", "javascript", "python", "math", "physics", "chemistry", "translate", "joke", "weather", "news"
];

const APP_FEATURE_HINTS = [
  "daily log", "simulation", "profile", "dashboard", "timeline", "insights", "rewards", "tasks", "chatbot", "craving", "graphs"
];

const OUT_OF_DOMAIN_REPLY = "I can help with health, fitness, diet, step tracking, recovery, and this app's features (dashboard, daily log, simulation, profile, insights, rewards). Please ask within these areas. 🌿";

function isDomainQuestion(text: string): boolean {
  const lower = text.toLowerCase();
  const domainHit = DOMAIN_KEYWORDS.some(k => lower.includes(k));
  const appFeatureHit = APP_FEATURE_HINTS.some(k => lower.includes(k));
  const outDomainHit = CLEARLY_OUT_OF_DOMAIN.some(k => lower.includes(k));
  const contextualHealthHit = ["my stats", "my score", "in this app", "here", "today", "how am i doing", "improve first"].some(k => lower.includes(k));

  if (domainHit || appFeatureHit) return true;
  if (contextualHealthHit) return true;
  if (outDomainHit) return false;

  return false;
}

function buildStatsContext(stats: QuickStats, hasData: boolean) {
  if (!hasData) {
    return "No user metrics logged yet.";
  }

  return [
    `Sleep: ${stats.sleep}h`,
    `Steps: ${stats.steps}`,
    `Water: ${stats.water}L`,
    `Heart rate: ${stats.heartRate} bpm`,
    `Mood: ${stats.mood}`,
  ].join(" | ");
}

async function getGeminiResponse(text: string, stats: QuickStats, hasData: boolean): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return null;

  const prompt = [
    "You are a health assistant inside a wellness tracking app.",
    "Allowed scope: health, fitness, diet, hydration, sleep, steps, activity, stress, recovery, and app features (Dashboard, Daily Log, Simulation, Profile, Insights, Rewards, Tasks, Craving panel).",
    "If the user asks outside allowed scope, reply exactly: __OUT_OF_DOMAIN__",
    "Do not diagnose diseases. Give safe practical guidance in plain language.",
    "Answer in 2-5 short sentences.",
    `Current user context: ${buildStatsContext(stats, hasData)}`,
    `User question: ${text}`,
  ].join("\n");

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const modelText = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join(" ").trim();
    if (!modelText) return null;
    if (modelText.includes("__OUT_OF_DOMAIN__")) return OUT_OF_DOMAIN_REPLY;
    return modelText;
  } catch {
    return null;
  }
}

function getResponse(text: string, stats: QuickStats, hasData: boolean): string {
  const lower = text.toLowerCase();

  if (!isDomainQuestion(text)) {
    return OUT_OF_DOMAIN_REPLY;
  }

  if (lower.includes("what can you do") || lower.includes("help with") || lower.includes("your scope")) {
    return "I can help with sleep, hydration, diet, workouts, recovery, stress, step goals, cravings, and app features like Dashboard, Daily Log, Simulation, Profile, Insights, Tasks, and Rewards.";
  }

  if (lower.includes("daily log") || lower.includes("log data") || lower.includes("enter data")) {
    return "Use Daily Log to save today's sleep, steps, hydration, mood, energy, heart rate, and blood pressure. Once logged, your timeline, insights, and graphs refresh with the new data.";
  }

  if (lower.includes("simulation") || lower.includes("predict") || lower.includes("what if")) {
    return "Simulation lets you test habit changes before doing them in real life. Increase sleep, steps, or water in the simulator to preview how your health score and suggestions might improve.";
  }

  if (lower.includes("profile") || lower.includes("goals") || lower.includes("target")) {
    return "Update your Profile with age, hydration target, walking distance, sleep duration, and health goals. The app uses these targets to personalize insights, suggestions, and progress feedback.";
  }

  if (lower.includes("insight") || lower.includes("warning") || lower.includes("alert")) {
    return "Insights are generated from your latest metrics and targets. They highlight gaps like low sleep, low hydration, low activity, or elevated heart rate so you can prioritize the highest-impact fix first.";
  }

  if (lower.includes("reward") || lower.includes("badge") || lower.includes("streak") || lower.includes("task")) {
    return "Complete daily tasks and keep logging healthy habits to grow your streak and unlock badges. Focus on consistency each day rather than perfection on a single day.";
  }

  if (lower.includes("diet") || lower.includes("meal") || lower.includes("nutrition") || lower.includes("eat")) {
    if (!hasData) {
      return "For a balanced meal, use protein + fiber-rich vegetables + a quality carb source, and drink water with meals. Log your stats to get more personalized diet guidance from your progress.";
    }

    if (stats.steps >= 9000) {
      return "You had strong activity today, so include good protein (eggs/paneer/chicken/beans), vegetables, and a moderate carb portion for recovery. Keep hydration steady through the evening.";
    }
    return "Keep meals simple: protein + vegetables + whole grains, and avoid high-sugar snacks late in the day. A short post-meal walk can also support energy and glucose control.";
  }

  if (lower.includes("tired") || lower.includes("energy") || lower.includes("fatigue")) {
    if (!hasData) {
      return "Low energy is often linked to sleep, hydration, meal timing, and stress. Start with 7-8 hours sleep, regular hydration, and light movement; then log your daily stats for tailored guidance.";
    }

    const reasons: string[] = [];
    if (stats.sleep < 7) reasons.push(`low sleep (${stats.sleep}h)`);
    if (stats.water < 2) reasons.push(`low hydration (${stats.water}L)`);
    if (stats.steps < 5000) reasons.push("low activity");
    return reasons.length > 0
      ? `Likely contributors: ${reasons.join(" + ")}. Start with the biggest gap first and recheck how you feel in 2-3 hours.`
      : "Your tracked metrics look decent, so energy dips may be from stress, meal quality, or screen fatigue. Try a 10-minute walk and a balanced snack.";
  }

  if (lower.includes("health") || lower.includes("score") || lower.includes("how am i doing") || lower.includes("progress")) {
    if (!hasData) {
      return "You can get a reliable health summary after logging sleep, steps, and hydration for today. Start with those three metrics in Quick Stats or Daily Log.";
    }

    return `Today: Sleep ${stats.sleep}h, Steps ${stats.steps.toLocaleString()}, Water ${stats.water}L, Heart rate ${stats.heartRate} bpm. ${stats.sleep >= 7 && stats.water >= 2.5 && stats.steps >= 8000 ? "Great momentum today. Keep consistency." : "You're progressing, and improving one weak metric first will have the biggest impact."}`;
  }

  if (lower.includes("water") || lower.includes("hydrat")) {
    if (!hasData) {
      return "General target is around 2-3L/day depending on climate and activity. Spread intake through the day instead of drinking most of it at night.";
    }

    const target = 2.5;
    return `You've had ${stats.water}L today. ${stats.water < target ? `Add about ${(target - stats.water).toFixed(1)}L more in small intervals.` : "Hydration is on track today."}`;
  }

  if (lower.includes("sleep") || lower.includes("rest")) {
    if (!hasData) {
      return "For better sleep, keep a fixed sleep-wake schedule, avoid heavy meals late, and reduce screen exposure 45-60 minutes before bed.";
    }

    return `You slept ${stats.sleep}h. ${stats.sleep < 7 ? "Try adding 30-45 minutes tonight and keep the same wake time tomorrow." : "Nice sleep duration. Keep the same routine for consistency."}`;
  }

  if (lower.includes("step") || lower.includes("walk") || lower.includes("exercise") || lower.includes("workout")) {
    if (!hasData) {
      return "A good baseline is 7,000-10,000 steps per day plus 20-30 minutes of moderate activity. Start where you are and increase gradually each week.";
    }

    const stepTarget = 10000;
    return `You've taken ${stats.steps.toLocaleString()} steps today. ${stats.steps < stepTarget ? `${(stepTarget - stats.steps).toLocaleString()} steps to reach the daily target.` : "You hit your step goal. Great job."}`;
  }

  if (lower.includes("heart") || lower.includes("pulse") || lower.includes("bpm")) {
    if (!hasData) {
      return "Resting heart rate is usually lower in fitter individuals. Track your resting value over time and watch for unusual sustained increases.";
    }

    return `Your current heart rate is ${stats.heartRate} bpm. If this is resting and repeatedly high, prioritize rest, hydration, and lower stress; seek professional care for persistent concerns.`;
  }

  if (!hasData) {
    return "I can answer general health, fitness, diet, hydration, recovery, and app-feature questions now. Add today's data for more personalized guidance.";
  }

  return "I can help with sleep, hydration, activity, diet, recovery, stress management, and app features like Daily Log, Simulation, Profile, Insights, and Rewards. Ask me anything in these areas.";
}

async function getSmartResponse(text: string, stats: QuickStats, hasData: boolean): Promise<string> {
  if (!isDomainQuestion(text)) return OUT_OF_DOMAIN_REPLY;

  const geminiResponse = await getGeminiResponse(text, stats, hasData);
  if (geminiResponse) return geminiResponse;

  return getResponse(text, stats, hasData);
}

export default function ChatbotFloat({ stats, hasData }: Props) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([{ role: "bot", text: "Hey! How can I help with your health today? 🌿" }]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  useEffect(() => {
    if (location.hash === "#chatbot" || location.pathname === "/chatbot") {
      setOpen(true);
    }
  }, [location.hash, location.pathname]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userText = text.trim();
    setMsgs(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsThinking(true);

    const reply = await getSmartResponse(userText, stats, hasData);
    setMsgs(prev => [...prev, { role: "bot", text: reply }]);
    setIsThinking(false);
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
            {isThinking && (
              <div className="max-w-[80%] text-sm p-3 rounded-2xl bg-muted text-foreground">
                Thinking...
              </div>
            )}
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
              <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !isThinking && send(input)} placeholder="Ask about fitness, diet, sleep, steps, or app features..." className="rounded-xl text-sm" disabled={isThinking} />
              <Button size="icon" onClick={() => send(input)} className="rounded-xl shrink-0" disabled={isThinking}><Send size={16} /></Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
