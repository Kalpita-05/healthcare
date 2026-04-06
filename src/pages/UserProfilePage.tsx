import { useMemo, useState } from "react";
import { Save, UserRound } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { useHealthStore } from "@/hooks/useHealthStore";

interface Props {
  store: ReturnType<typeof useHealthStore>;
}

export default function UserProfilePage({ store }: Props) {
  const { toast } = useToast();
  const profile = store.profile;

  const initial = useMemo(() => ({
    name: profile?.name || store.user?.name || "",
    email: profile?.email || store.user?.email || "",
    age: String(profile?.age || 25),
    healthGoals: profile?.healthGoals || "General wellness",
    chronicConditions: profile?.chronicConditions || "None",
    waterIntake: String(profile?.waterIntake || 2.5),
    sleepDuration: String(profile?.sleepDuration || 7),
  }), [profile, store.user]);

  const [form, setForm] = useState(initial);

  if (!profile) {
    return (
      <div className="flex-1 min-h-screen p-8">
        <p className="text-muted-foreground">No profile data yet</p>
      </div>
    );
  }

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateProfile({
      name: form.name,
      email: form.email,
      age: Number(form.age),
      healthGoals: form.healthGoals,
      chronicConditions: form.chronicConditions,
      waterIntake: Number(form.waterIntake),
      sleepDuration: Number(form.sleepDuration),
    });
    toast({ title: "Profile updated", description: "Your personalized goals and reminders were refreshed." });
  };

  return (
    <div className="flex-1 min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 h-14 flex items-center px-4 gap-2">
        <SidebarTrigger />
        <h2 className="font-heading font-semibold text-2xl tracking-wide text-gradient">Profile</h2>
      </header>
      <main className="p-4 md:p-8 max-w-3xl mx-auto">
        <form onSubmit={saveProfile} className="glass-card p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-2xl font-semibold">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Name</span>
              <Input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Email</span>
              <Input value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Age</span>
              <Input type="number" value={form.age} onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Health goals</span>
              <Input value={form.healthGoals} onChange={e => setForm(prev => ({ ...prev, healthGoals: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Chronic conditions</span>
              <Input value={form.chronicConditions} onChange={e => setForm(prev => ({ ...prev, chronicConditions: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Water target (L)</span>
              <Input type="number" step="0.1" value={form.waterIntake} onChange={e => setForm(prev => ({ ...prev, waterIntake: e.target.value }))} className="rounded-xl" />
            </label>
            <label className="space-y-1 text-sm md:col-span-2">
              <span className="text-muted-foreground">Sleep target (hours)</span>
              <Input type="number" step="0.5" value={form.sleepDuration} onChange={e => setForm(prev => ({ ...prev, sleepDuration: e.target.value }))} className="rounded-xl" />
            </label>
          </div>

          <Button type="submit" className="rounded-xl w-full h-11 hover:scale-[1.01] transition-all duration-300">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </form>
      </main>
    </div>
  );
}
