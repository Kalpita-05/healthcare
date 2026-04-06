import { useState, useCallback, useMemo, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  waterIntake: number;
  walkingDistance: number;
  heartRate: number;
  chronicConditions: string;
  healthGoals: string;
  doctorVisitIntervalDays: number;
  isPregnant: boolean;
  isElderlyCare: boolean;
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
  id: string;
  date: string;
  day: string;
  sleepHours: number;
  sleepQuality: number;
  steps: number;
  exercise: boolean;
  waterIntake: number;
  mealsHealthy: boolean;
  mood: number;
  energyLevel: number;
  heartRate: number;
  bloodPressure: string;
}

export interface HealthBadge {
  key: string;
  label: string;
  earned: boolean;
}

export interface HealthNotification {
  id: string;
  message: string;
  type: "doctor" | "chronic" | "pregnancy" | "elderly";
}

const STORAGE_KEY = "healthflow-store-v2";

function toDayLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", { weekday: "short" });
}

function toDateKey(isoDate: string) {
  return new Date(isoDate).toISOString().slice(0, 10);
}

function moodEmojiFromScore(mood: number) {
  if (mood >= 5) return "😊";
  if (mood >= 4) return "🙂";
  if (mood >= 3) return "😐";
  if (mood >= 2) return "😴";
  return "😫";
}

function moodScoreFromEmoji(mood: string) {
  if (mood === "😊") return 5;
  if (mood === "🙂") return 4;
  if (mood === "😐") return 3;
  if (mood === "😴") return 2;
  return 1;
}

function getRecentLogs(logs: DayLog[]) {
  return [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map(log => ({ ...log, day: toDayLabel(log.date) }));
}

function computeStreak(logs: DayLog[]) {
  if (logs.length === 0) return 0;
  const dateSet = new Set(logs.map(log => toDateKey(log.date)));
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!dateSet.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
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
  const [stats, setStats] = useState<QuickStats>({ steps: 0, water: 0, sleep: 0, heartRate: 0, mood: "😊" });
  const [tasks, setTasks] = useState<DailyTask[]>(defaultTasks);
  const [dailyLogs, setDailyLogs] = useState<DayLog[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        user: typeof user;
        profile: UserProfile | null;
        stats: QuickStats;
        tasks: DailyTask[];
        dailyLogs: DayLog[];
      };
      setUser(parsed.user || null);
      setProfile(parsed.profile || null);
      setStats(parsed.stats || { steps: 0, water: 0, sleep: 0, heartRate: 0, mood: "😊" });
      setTasks(parsed.tasks && parsed.tasks.length > 0 ? parsed.tasks : defaultTasks);
      setDailyLogs(parsed.dailyLogs || []);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, profile, stats, tasks, dailyLogs }));
  }, [user, profile, stats, tasks, dailyLogs]);

  const login = useCallback((name: string, email: string, mood: string) => {
    setUser({ name, email, mood });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    setStats({ steps: 0, water: 0, sleep: 0, heartRate: 0, mood: "😊" });
    setTasks(defaultTasks);
    setDailyLogs([]);
    setStreak(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const addTask = useCallback((label: string) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), label, done: false }]);
  }, []);

  const addDayLog = useCallback((log: Omit<DayLog, "id" | "day">) => {
    const normalized: DayLog = {
      ...log,
      id: `${toDateKey(log.date)}-${Date.now()}`,
      day: toDayLabel(log.date),
    };

    setDailyLogs(prev => {
      const sameDay = prev.filter(item => toDateKey(item.date) !== toDateKey(normalized.date));
      return [...sameDay, normalized].sort((a, b) => a.date.localeCompare(b.date));
    });

    setStats({
      steps: normalized.steps,
      water: normalized.waterIntake,
      sleep: normalized.sleepHours,
      heartRate: normalized.heartRate,
      mood: moodEmojiFromScore(normalized.mood),
    });
  }, []);

  const updateStats = useCallback((partial: Partial<QuickStats>) => {
    setStats(prev => {
      const merged = { ...prev, ...partial };
      const today = new Date().toISOString().slice(0, 10);

      setDailyLogs(logs => {
        const existing = logs.find(log => toDateKey(log.date) === today);
        const nextLog: DayLog = existing
          ? {
            ...existing,
            sleepHours: merged.sleep,
            steps: merged.steps,
            waterIntake: merged.water,
            heartRate: merged.heartRate,
            mood: moodScoreFromEmoji(merged.mood),
          }
          : {
            id: `${today}-${Date.now()}`,
            date: today,
            day: toDayLabel(today),
            sleepHours: merged.sleep,
            sleepQuality: 3,
            steps: merged.steps,
            exercise: false,
            waterIntake: merged.water,
            mealsHealthy: false,
            mood: moodScoreFromEmoji(merged.mood),
            energyLevel: 3,
            heartRate: merged.heartRate,
            bloodPressure: "120/80",
          };

        const withoutToday = logs.filter(log => toDateKey(log.date) !== today);
        return [...withoutToday, nextLog].sort((a, b) => a.date.localeCompare(b.date));
      });

      return merged;
    });
  }, []);

  const weeklyLogs = useMemo(() => getRecentLogs(dailyLogs), [dailyLogs]);

  useEffect(() => {
    setStreak(computeStreak(dailyLogs));
  }, [dailyLogs]);

  const hasData = dailyLogs.length > 0;

  const latestLog = useMemo(() => {
    if (dailyLogs.length === 0) return null;
    return [...dailyLogs].sort((a, b) => a.date.localeCompare(b.date))[dailyLogs.length - 1];
  }, [dailyLogs]);

  const healthScore = useMemo(() => {
    if (!hasData) return 0;
    if (!latestLog) return 0;
    const targetWater = profile?.waterIntake || 2.5;
    const targetSleep = profile?.sleepDuration || 7;
    const targetSteps = profile?.age && profile.age > 50 ? 6000 : 10000;
    const sleepPart = Math.min(latestLog.sleepHours / targetSleep, 1) * 22;
    const waterPart = Math.min(latestLog.waterIntake / targetWater, 1) * 18;
    const stepsPart = Math.min(latestLog.steps / targetSteps, 1) * 22;
    const qualityPart = Math.min(latestLog.sleepQuality / 5, 1) * 10;
    const energyPart = Math.min(latestLog.energyLevel / 5, 1) * 8;
    const mealPart = latestLog.mealsHealthy ? 8 : 0;
    const exercisePart = latestLog.exercise ? 6 : 0;
    const taskPart = (tasks.filter(t => t.done).length / tasks.length) * 6;

    return Math.min(100, Math.round(
      sleepPart + waterPart + stepsPart + qualityPart + energyPart + mealPart + exercisePart + taskPart
    ));
  }, [latestLog, tasks, profile, hasData]);

  // Context-aware insights based on actual user data
  const insights = useMemo(() => {
    if (!hasData) return [];
    const result: { title: string; desc: string; severity: "warn" | "bad" }[] = [];
    if (!latestLog) return result;
    const targetWater = profile?.waterIntake || 2.5;
    const targetSleep = profile?.sleepDuration || 7;
    const targetSteps = profile?.age && profile.age > 50 ? 6000 : 10000;

    if (latestLog.sleepHours < targetSleep)
      result.push({ title: "Low Sleep", desc: `You slept ${latestLog.sleepHours}h — below your ${targetSleep}h target`, severity: latestLog.sleepHours < targetSleep - 1.5 ? "bad" : "warn" });
    if (latestLog.waterIntake < targetWater)
      result.push({ title: "Low Hydration", desc: `Only ${latestLog.waterIntake}L — aim for ${targetWater}L`, severity: latestLog.waterIntake < targetWater * 0.6 ? "bad" : "warn" });
    if (latestLog.steps < targetSteps)
      result.push({ title: "Low Activity", desc: `${latestLog.steps.toLocaleString()} steps — target is ${targetSteps.toLocaleString()}`, severity: latestLog.steps < targetSteps * 0.5 ? "bad" : "warn" });
    if (latestLog.heartRate > 100)
      result.push({ title: "High Heart Rate", desc: `${latestLog.heartRate} bpm is elevated — consider resting`, severity: "warn" });
    if (latestLog.energyLevel <= 2)
      result.push({ title: "Low Energy", desc: `Energy is ${latestLog.energyLevel}/5. Prioritize hydration and recovery today.`, severity: "warn" });
    return result;
  }, [latestLog, profile, hasData]);

  // Context-aware AI insight
  const aiInsight = useMemo(() => {
    if (!hasData) return null;
    if (!latestLog) return null;
    const parts: string[] = [];
    const tags: string[] = [];
    const targetSleep = profile?.sleepDuration || 7;
    const targetWater = profile?.waterIntake || 2.5;

    if (latestLog.sleepHours < targetSleep) { parts.push(`low sleep (${latestLog.sleepHours}h)`); tags.push("Sleep"); }
    if (latestLog.waterIntake < targetWater) { parts.push(`low hydration (${latestLog.waterIntake}L)`); tags.push("Hydration"); }
    if (latestLog.steps < 5000) { parts.push("low activity"); tags.push("Activity"); }
    if (latestLog.energyLevel <= 2) { parts.push("low energy"); tags.push("Energy"); }

    if (parts.length === 0) return { text: "Great job! Your health metrics look good today. Keep it up! 🎉", tags: ["Wellness"] };
    return {
      text: `Detected: ${parts.join(" + ")}. Consider adjusting your routine to improve these areas.`,
      tags,
    };
  }, [latestLog, profile, hasData]);

  // Context-aware suggestions
  const suggestions = useMemo(() => {
    if (!hasData) return [];
    const result: { text: string; sub: string }[] = [];
    if (!latestLog) return [];
    const targetWater = profile?.waterIntake || 2.5;
    const targetSteps = profile?.age && profile.age > 50 ? 6000 : 10000;
    const hour = new Date().getHours();

    if (latestLog.waterIntake < targetWater) {
      const diff = (targetWater - latestLog.waterIntake).toFixed(1);
      result.push({ text: "Drink water now 💧", sub: `You're ${diff}L behind target` });
    }
    if (latestLog.steps < targetSteps) {
      const diff = targetSteps - latestLog.steps;
      result.push({ text: "Take a walk 🚶", sub: `${diff.toLocaleString()} steps to go` });
    }
    if (latestLog.sleepHours < 6 && hour < 14) {
      result.push({ text: "Consider a power nap 😴", sub: "Low sleep detected — 20 min nap helps" });
    }
    if (hour >= 20 && latestLog.sleepHours < 7) {
      result.push({ text: "Time to wind down 🌙", sub: "Prepare for a good night's sleep" });
    }
    return result;
  }, [latestLog, profile, hasData]);

  // Action items based on data
  const actions = useMemo(() => {
    if (!hasData) return { immediate: [], recovery: [], plan: [] };
    if (!latestLog) return { immediate: [], recovery: [], plan: [] };
    const targetWater = profile?.waterIntake || 2.5;
    const targetSteps = profile?.age && profile.age > 50 ? 6000 : 10000;
    const hour = new Date().getHours();

    const immediate: string[] = [];
    if (latestLog.waterIntake < targetWater) immediate.push(`Drink ${Math.ceil((targetWater - latestLog.waterIntake) * 4)} small glasses of water`);
    if (latestLog.steps < targetSteps) immediate.push("Take a 10-minute walk");
    if (immediate.length === 0) immediate.push("You're on track! Keep it up 👍");

    const recovery: string[] = [];
    if (latestLog.sleepHours < 6) recovery.push("Missed sleep -> take a 20-min nap");
    if (latestLog.steps < 3000) recovery.push("Missed walk -> walk for 15 mins now");
    if (!latestLog.mealsHealthy) recovery.push("Missed balanced meals -> add protein + vegetables at next meal");
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
  }, [latestLog, profile, hasData]);

  const badges = useMemo<HealthBadge[]>(() => {
    const recent7 = getRecentLogs(dailyLogs);
    const last30 = [...dailyLogs].slice(-30);
    const hydrationDays = recent7.filter(log => log.waterIntake >= (profile?.waterIntake || 2.5)).length;
    const sleepDays = recent7.filter(log => log.sleepHours >= (profile?.sleepDuration || 7)).length;
    return [
      { key: "7-day", label: "7 Day Consistency", earned: recent7.length >= 7 },
      { key: "hydration", label: "Hydration Hero", earned: hydrationDays >= 5 },
      { key: "sleep", label: "Sleep Master", earned: sleepDays >= 5 },
      { key: "30-day", label: "30-Day Discipline", earned: last30.length >= 30 },
    ];
  }, [dailyLogs, profile]);

  const notifications = useMemo<HealthNotification[]>(() => {
    if (!profile) return [];
    const items: HealthNotification[] = [];
    const interval = profile.doctorVisitIntervalDays || 90;
    if (dailyLogs.length === 0) {
      items.push({ id: "doctor-start", message: "Time to check in with your doctor 🩺", type: "doctor" });
    }
    if (dailyLogs.length >= interval) {
      items.push({ id: "doctor-follow", message: "Doctor follow-up due based on your logging cycle 🩺", type: "doctor" });
    }
    if (profile.chronicConditions && profile.chronicConditions.toLowerCase() !== "none") {
      items.push({ id: "chronic", message: `Reminder: monitor ${profile.chronicConditions} and log symptoms regularly.`, type: "chronic" });
    }
    if (profile.isPregnant) {
      items.push({ id: "pregnancy", message: "Pregnancy checkup reminder: track hydration, sleep, and appointments 🤰", type: "pregnancy" });
    }
    if (profile.isElderlyCare || profile.age >= 60) {
      items.push({ id: "elderly", message: "Elderly care reminder: keep blood pressure and heart-rate logs updated 👴", type: "elderly" });
    }
    return items;
  }, [profile, dailyLogs]);

  const predictHealthScore = useCallback((input: { sleepHours: number; steps: number; waterIntake: number }) => {
    const targetSleep = profile?.sleepDuration || 7;
    const targetSteps = profile?.age && profile.age > 50 ? 6000 : 10000;
    const targetWater = profile?.waterIntake || 2.5;
    const baseline = healthScore || 0;
    const sleepPart = Math.min(input.sleepHours / targetSleep, 1) * 30;
    const stepsPart = Math.min(input.steps / targetSteps, 1) * 35;
    const waterPart = Math.min(input.waterIntake / targetWater, 1) * 25;
    const taskPart = (tasks.filter(t => t.done).length / tasks.length) * 10;
    const predicted = Math.round(Math.min(100, sleepPart + stepsPart + waterPart + taskPart));
    return { baseline, predicted };
  }, [profile, tasks, healthScore]);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return null;
      return { ...prev, ...partial };
    });
  }, []);

  const setProfileData = useCallback((nextProfile: UserProfile) => {
    setProfile(nextProfile);
  }, []);

  return {
    user, profile, stats, tasks, healthScore, weeklyLogs, dailyLogs, latestLog, streak, hasData,
    insights, aiInsight, suggestions, actions, badges, notifications,
    login, logout, setProfile: setProfileData, updateProfile, setStats: updateStats, toggleTask, addTask, addDayLog, setStreak,
    predictHealthScore,
  };
}
