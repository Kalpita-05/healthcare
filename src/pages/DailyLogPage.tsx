import { useMemo, useState } from "react";
import { CalendarPlus, Save } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { useHealthStore } from "@/hooks/useHealthStore";

interface Props {
  store: ReturnType<typeof useHealthStore>;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function DailyLogPage({ store }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    date: todayDate(),
    sleepHours: String(store.latestLog?.sleepHours || 0),
    sleepQuality: String(store.latestLog?.sleepQuality || 3),
    steps: String(store.latestLog?.steps || 0),
    exercise: store.latestLog?.exercise ? "yes" : "no",
    waterIntake: String(store.latestLog?.waterIntake || 0),
    mealsHealthy: store.latestLog?.mealsHealthy ? "yes" : "no",
    mood: String(store.latestLog?.mood || 3),
    energyLevel: String(store.latestLog?.energyLevel || 3),
    heartRate: String(store.latestLog?.heartRate || 70),
    bloodPressure: store.latestLog?.bloodPressure || "120/80",
  });

  const canSubmit = useMemo(() => {
    return Number(form.sleepHours) >= 0 && Number(form.steps) >= 0 && Number(form.waterIntake) >= 0;
  }, [form]);

  const submitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    store.addDayLog({
      date: form.date,
      sleepHours: Number(form.sleepHours),
      sleepQuality: Number(form.sleepQuality),
      steps: Number(form.steps),
      exercise: form.exercise === "yes",
      waterIntake: Number(form.waterIntake),
      mealsHealthy: form.mealsHealthy === "yes",
      mood: Number(form.mood),
      energyLevel: Number(form.energyLevel),
      heartRate: Number(form.heartRate),
      bloodPressure: form.bloodPressure,
    });

    toast({
      title: "Daily log saved",
      description: "Your dashboard, timeline, insights, and score are now updated.",
    });
  };

  return (
    <div className="flex-1 min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 h-14 flex items-center px-4 gap-2">
        <SidebarTrigger />
        <h2 className="font-heading font-semibold text-2xl tracking-wide text-gradient">Daily Log</h2>
      </header>
      <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8 hover-card">
          <div className="flex items-center gap-2 mb-5">
            <CalendarPlus className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-2xl font-semibold">Track Today</h3>
          </div>

          <form onSubmit={submitLog} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Date</span>
              <Input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Sleep hours</span>
              <Input type="number" min="0" step="0.5" value={form.sleepHours} onChange={e => setForm(prev => ({ ...prev, sleepHours: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Sleep quality (1-5)</span>
              <Input type="number" min="1" max="5" value={form.sleepQuality} onChange={e => setForm(prev => ({ ...prev, sleepQuality: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Steps walked</span>
              <Input type="number" min="0" value={form.steps} onChange={e => setForm(prev => ({ ...prev, steps: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Exercise</span>
              <select value={form.exercise} onChange={e => setForm(prev => ({ ...prev, exercise: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Water intake (L)</span>
              <Input type="number" min="0" step="0.1" value={form.waterIntake} onChange={e => setForm(prev => ({ ...prev, waterIntake: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Healthy meals followed</span>
              <select value={form.mealsHealthy} onChange={e => setForm(prev => ({ ...prev, mealsHealthy: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Mood (1-5)</span>
              <Input type="number" min="1" max="5" value={form.mood} onChange={e => setForm(prev => ({ ...prev, mood: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Energy level (1-5)</span>
              <Input type="number" min="1" max="5" value={form.energyLevel} onChange={e => setForm(prev => ({ ...prev, energyLevel: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Heart rate (bpm)</span>
              <Input type="number" min="0" value={form.heartRate} onChange={e => setForm(prev => ({ ...prev, heartRate: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span className="text-muted-foreground">Blood pressure</span>
              <Input value={form.bloodPressure} onChange={e => setForm(prev => ({ ...prev, bloodPressure: e.target.value }))} className="rounded-xl" placeholder="120/80" />
            </label>

            <div className="md:col-span-2 pt-2">
              <Button disabled={!canSubmit} type="submit" className="w-full rounded-xl h-11 text-base hover:scale-[1.02] transition-all duration-300">
                <Save className="h-4 w-4 mr-2" />
                Save Daily Log
              </Button>
            </div>
          </form>
        </div>

        <div className="glass-card p-6">
          <h4 className="font-heading font-semibold text-lg mb-2">Recent Entries</h4>
          {store.weeklyLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {store.weeklyLogs.map(log => (
                <div key={log.id} className="rounded-2xl border border-border/70 p-3 bg-card/60">
                  <p className="font-medium text-sm">{new Date(log.date).toLocaleDateString()} ({log.day})</p>
                  <p className="text-xs text-muted-foreground">Sleep {log.sleepHours}h · Steps {log.steps.toLocaleString()} · Water {log.waterIntake}L</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
