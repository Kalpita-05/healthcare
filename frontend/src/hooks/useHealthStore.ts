import { useState, useCallback, useMemo } from "react";

export interface UserProfile {
  name: string;
  age: number;
  waterIntake: number;
  walkingDistance: number;
  heartRate: number;
  chronicDiseases: string;
  mealTimings: string;
  sleepDuration: number;
}

export interface QuickStats {
  steps: number;
  water: number;
  sleep: number;
  heartRate: number;
  mood: string;
}

export interface DailyTask {
  id: string;
  label: string;
  done: boolean;
}

export interface DayLog {
  day: string;
  sleep: number;
  steps: number;
  water: number;
  mood: number; // 1-5
  calories: number;
}

const defaultTasks: DailyTask[] = [
  { id: "1", label: "Sleep for 7+ hours", done: false },
  { id: "2", label: "Eat a healthy breakfast", done: false },
  { id: "3", label: "Avoid junk food", done: false },
  { id: "4", label: "Drink 2.5L water", done: false },
  { id: "5", label: "Walk 10,000 steps", done: false },
  { id: "6", label: "Meditate for 15 mins", done: false },
  { id: "7", label: "Eat a healthy lunch", done: false },
  { id: "8", label: "Dinner before 8 PM", done: false },
];

export function useHealthStore() {
  const [user, setUser] = useState<{ name: string; email: string; mood: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Start with zeroed stats — user must input data
  const [stats, setStats] = useState<QuickStats>({ steps: 0, water: 0, sleep: 0, heartRate: 0, mood: "😊" });
  const [tasks, setTasks] = useState<DailyTask[]>(defaultTasks);
  // Weekly logs — empty by default, user fills via daily log
  const [weeklyLogs, setWeeklyLogs] = useState<DayLog[]>([]);
  const [streak, setStreak] = useState(0);

  const login = useCallback((name: string, email: string, mood: string) => {
    setUser({ name, email, mood });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const addTask = useCallback((label: string) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), label, done: false }]);
  }, []);

  const addDayLog = useCallback((log: DayLog) => {
    setWeeklyLogs(prev => {
      const existing = prev.filter(l => l.day !== log.day);
      return [...existing, log].slice(-7);
    });
  }, []);

  const updateStats = useCallback((partial: Partial<QuickStats>) => {
    setStats(prev => ({ ...prev, ...partial }));
  }, []);

  const hasData = stats.steps > 0 || stats.water > 0 || stats.sleep > 0;

  const healthScore = useMemo(() => {
    if (!hasData) return 0;
    const targetWater = profile?.waterIntake || 2.5;
    const targetSleep = profile?.sleepDuration || 7;
    const targetSteps = (profile?.age && profile.age > 50) ? 6000 : 10000;
    return Math.min(100, Math.round(
      (Math.min(stats.water / targetWater, 1)) * 20 +
      (Math.min(stats.sleep / targetSleep, 1)) * 25 +
      (Math.min(stats.steps / targetSteps, 1)) * 25 +
      (tasks.filter(t => t.done).length / tasks.length) * 30
    ));
  }, [stats, tasks, profile, hasData]);

  // Context-aware insights based on actual user data
  const insights = useMemo(() => {
    if (!hasData) return [];
    const result: { title: string; desc: string; severity: "warn" | "bad" }[] = [];
    const targetWater = profile?.waterIntake || 2.5;
    const targetSleep = profile?.sleepDuration || 7;
    const targetSteps = (profile?.age && profile.age > 50) ? 6000 : 10000;

    if (stats.sleep > 0 && stats.sleep < targetSleep)
      result.push({ title: "Low Sleep", desc: `You slept ${stats.sleep}h — below your ${targetSleep}h target`, severity: stats.sleep < targetSleep - 1.5 ? "bad" : "warn" });
    if (stats.water > 0 && stats.water < targetWater)
      result.push({ title: "Low Hydration", desc: `Only ${stats.water}L — aim for ${targetWater}L`, severity: stats.water < targetWater * 0.6 ? "bad" : "warn" });
    if (stats.steps > 0 && stats.steps < targetSteps)
      result.push({ title: "Low Activity", desc: `${stats.steps.toLocaleString()} steps — target is ${targetSteps.toLocaleString()}`, severity: stats.steps < targetSteps * 0.5 ? "bad" : "warn" });
    if (stats.heartRate > 100)
      result.push({ title: "High Heart Rate", desc: `${stats.heartRate} bpm is elevated — consider resting`, severity: "warn" });
    return result;
  }, [stats, profile, hasData]);

  // Context-aware AI insight
  const aiInsight = useMemo(() => {
    if (!hasData) return null;
    const parts: string[] = [];
    const tags: string[] = [];
    const targetSleep = profile?.sleepDuration || 7;
    const targetWater = profile?.waterIntake || 2.5;

    if (stats.sleep > 0 && stats.sleep < targetSleep) { parts.push(`low sleep (${stats.sleep}h)`); tags.push("Sleep"); }
    if (stats.water > 0 && stats.water < targetWater) { parts.push(`low hydration (${stats.water}L)`); tags.push("Hydration"); }
    if (stats.steps > 0 && stats.steps < 5000) { parts.push("low activity"); tags.push("Activity"); }

    if (parts.length === 0) return { text: "Great job! Your health metrics look good today. Keep it up! 🎉", tags: ["Wellness"] };
    return {
      text: `Detected: ${parts.join(" + ")}. Consider adjusting your routine to improve these areas.`,
      tags,
    };
  }, [stats, profile, hasData]);

  // Context-aware suggestions
  const suggestions = useMemo(() => {
    if (!hasData) return [];
    const result: { text: string; sub: string }[] = [];
    const targetWater = profile?.waterIntake || 2.5;
    const targetSteps = (profile?.age && profile.age > 50) ? 6000 : 10000;
    const hour = new Date().getHours();

    if (stats.water < targetWater) {
      const diff = (targetWater - stats.water).toFixed(1);
      result.push({ text: "Drink water now 💧", sub: `You're ${diff}L behind target` });
    }
    if (stats.steps < targetSteps) {
      const diff = targetSteps - stats.steps;
      result.push({ text: "Take a walk 🚶", sub: `${diff.toLocaleString()} steps to go` });
    }
    if (stats.sleep > 0 && stats.sleep < 6 && hour < 14) {
      result.push({ text: "Consider a power nap 😴", sub: "Low sleep detected — 20 min nap helps" });
    }
    if (hour >= 20 && stats.sleep === 0) {
      result.push({ text: "Time to wind down 🌙", sub: "Prepare for a good night's sleep" });
    }
    return result;
  }, [stats, profile, hasData]);

  // Action items based on data
  const actions = useMemo(() => {
    if (!hasData) return { immediate: [], recovery: [], plan: [] };
    const targetWater = profile?.waterIntake || 2.5;
    const targetSteps = (profile?.age && profile.age > 50) ? 6000 : 10000;
    const hour = new Date().getHours();

    const immediate: string[] = [];
    if (stats.water < targetWater) immediate.push(`Drink ${Math.ceil(targetWater - stats.water)} glasses of water`);
    if (stats.steps < targetSteps) immediate.push("Take a 10-minute walk");
    if (immediate.length === 0) immediate.push("You're on track! Keep it up 👍");

    const recovery: string[] = [];
    if (stats.sleep > 0 && stats.sleep < 6) recovery.push("Missed sleep → take a 20-min nap");
    if (stats.steps < 3000) recovery.push("Missed walk → walk for 15 mins now");
    if (recovery.length === 0) recovery.push("No missed habits today!");

    const plan: { text: string; status: string }[] = [];
    if (hour < 12) {
      plan.push({ text: "Morning routine", status: "⏳" });
      plan.push({ text: "Afternoon check-in", status: "⏳" });
      plan.push({ text: "Evening wind-down", status: "⏳" });
    } else if (hour < 17) {
      plan.push({ text: "Morning routine", status: "✔" });
      plan.push({ text: "Afternoon check-in", status: "⏳" });
      plan.push({ text: "Evening wind-down", status: "⏳" });
    } else {
      plan.push({ text: "Morning routine", status: "✔" });
      plan.push({ text: "Afternoon check-in", status: "✔" });
      plan.push({ text: "Evening wind-down", status: "⏳" });
    }

    return { immediate, recovery, plan };
  }, [stats, profile, hasData]);

  return {
    user, profile, stats, tasks, healthScore, weeklyLogs, streak, hasData,
    insights, aiInsight, suggestions, actions,
    login, setProfile, setStats: updateStats, toggleTask, addTask, addDayLog, setStreak,
  };
}
