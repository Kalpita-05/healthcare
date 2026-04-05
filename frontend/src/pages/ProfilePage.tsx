import { useState } from "react";
import { User, Droplets, Footprints, Heart, Utensils, Moon, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/hooks/useHealthStore";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const fields = [
  { key: "age", label: "Age", icon: User, type: "number", placeholder: "25" },
  { key: "waterIntake", label: "Avg Water Intake (L)", icon: Droplets, type: "number", placeholder: "2.0" },
  { key: "walkingDistance", label: "Avg Walking Distance (km)", icon: Footprints, type: "number", placeholder: "5" },
  { key: "heartRate", label: "Avg Heart Rate (bpm)", icon: Heart, type: "number", placeholder: "72" },
  { key: "chronicDiseases", label: "Chronic Diseases (if any)", icon: Activity, type: "text", placeholder: "None" },
  { key: "mealTimings", label: "Meal Timings", icon: Utensils, type: "text", placeholder: "8AM, 1PM, 7PM" },
  { key: "sleepDuration", label: "Avg Sleep Duration (hrs)", icon: Moon, type: "number", placeholder: "7" },
] as const;

export default function ProfilePage({ onComplete }: Props) {
  const [form, setForm] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: "",
      age: Number(form.age) || 25,
      waterIntake: Number(form.waterIntake) || 2,
      walkingDistance: Number(form.walkingDistance) || 5,
      heartRate: Number(form.heartRate) || 72,
      chronicDiseases: form.chronicDiseases || "None",
      mealTimings: form.mealTimings || "8AM, 1PM, 7PM",
      sleepDuration: Number(form.sleepDuration) || 7,
    });
  };

  return (
    <div className="min-h-screen health-gradient-bg flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-2xl p-8 fade-up">
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">Tell us about yourself</h2>
        <p className="text-muted-foreground mb-6">This helps personalize your health insights.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Icon size={16} className="text-primary" /> {label}
              </label>
              <Input
                type={type}
                placeholder={placeholder}
                value={form[key] || ""}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          ))}
          <div className="md:col-span-2 mt-4">
            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl">
              Continue to Dashboard →
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
