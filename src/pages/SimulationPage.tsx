import { useMemo, useState } from "react";
import { FlaskConical, TrendingUp } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import type { useHealthStore } from "@/hooks/useHealthStore";

interface Props {
  store: ReturnType<typeof useHealthStore>;
}

export default function SimulationPage({ store }: Props) {
  const [sleepHours, setSleepHours] = useState<number>(store.latestLog?.sleepHours || 7);
  const [steps, setSteps] = useState<number>(store.latestLog?.steps || 6000);
  const [waterIntake, setWaterIntake] = useState<number>(store.latestLog?.waterIntake || 2);

  const comparison = useMemo(() => {
    return store.predictHealthScore({ sleepHours, steps, waterIntake });
  }, [sleepHours, steps, waterIntake, store]);

  const improvement = Math.max(0, comparison.predicted - comparison.baseline);

  return (
    <div className="flex-1 min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 h-14 flex items-center px-4 gap-2">
        <SidebarTrigger />
        <h2 className="font-heading font-semibold text-2xl tracking-wide text-gradient">Simulation</h2>
      </header>
      <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-2xl font-semibold">What If Explorer</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Adjust your sleep, steps, and water to preview your potential health score.</p>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Sleep hours</span><span>{sleepHours.toFixed(1)}h</span></div>
              <Slider min={0} max={12} step={0.5} value={[sleepHours]} onValueChange={v => setSleepHours(v[0])} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Steps</span><span>{Math.round(steps).toLocaleString()}</span></div>
              <Slider min={0} max={20000} step={250} value={[steps]} onValueChange={v => setSteps(v[0])} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Water intake</span><span>{waterIntake.toFixed(1)}L</span></div>
              <Slider min={0} max={5} step={0.1} value={[waterIntake]} onValueChange={v => setWaterIntake(v[0])} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <p className="text-sm text-muted-foreground">Current baseline</p>
            <p className="text-4xl font-heading font-bold mt-1">{comparison.baseline}/100</p>
          </div>
          <div className="glow-card p-6">
            <p className="text-sm text-muted-foreground">Predicted score</p>
            <p className="text-4xl font-heading font-bold mt-1">{comparison.predicted}/100</p>
            <p className="text-sm mt-2 text-primary flex items-center gap-1"><TrendingUp className="h-4 w-4" /> +{improvement} projected</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="font-heading font-semibold mb-2">AI Coach Message</h4>
          <p className="text-foreground">
            {improvement > 0
              ? `If you follow this routine, your health score can improve to ${comparison.predicted} 🎯`
              : "Your current routine is already strong. Keep this consistency to maintain momentum."}
          </p>
        </div>
      </main>
    </div>
  );
}
