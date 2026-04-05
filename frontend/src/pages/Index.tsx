import { useState } from "react";
import { useTimeTheme } from "@/hooks/useTimeTheme";
import { useHealthStore } from "@/hooks/useHealthStore";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import DashboardLayout from "@/layouts/DashboardLayout";

type Step = "auth" | "profile" | "app";

export default function Index() {
  useTimeTheme();
  const store = useHealthStore();
  const [step, setStep] = useState<Step>("auth");

  if (step === "auth") {
    return (
      <AuthPage
        onLogin={(name, email, mood) => {
          store.login(name, email, mood);
          setStep("profile");
        }}
      />
    );
  }

  if (step === "profile") {
    return (
      <ProfilePage
        onComplete={profile => {
          store.setProfile(profile);
          setStep("app");
        }}
      />
    );
  }

  return <DashboardLayout store={store} />;
}
