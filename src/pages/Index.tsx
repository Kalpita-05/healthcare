import { useState } from "react";
import { useEffect } from "react";
import { useTimeTheme } from "@/hooks/useTimeTheme";
import { useHealthStore } from "@/hooks/useHealthStore";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import IntroVideoPage from "@/pages/IntroVideoPage";
import DashboardLayout from "@/layouts/DashboardLayout";

type Step = "auth" | "login_success" | "intro_video" | "onboarding" | "main_app";

export default function Index() {
  useTimeTheme();
  const store = useHealthStore();
  const [step, setStep] = useState<Step>("auth");

  useEffect(() => {
    if (step !== "login_success") return;
    const timer = setTimeout(() => setStep("intro_video"), 450);
    return () => clearTimeout(timer);
  }, [step]);

  if (step === "auth") {
    return (
      <AuthPage
        onLogin={(name, email, mood) => {
          store.login(name, email, mood);
          setStep("login_success");
        }}
      />
    );
  }

  if (step === "login_success") {
    return (
      <div className="min-h-screen health-gradient-bg flex items-center justify-center p-6 transition-all duration-500 ease-in-out opacity-100">
        <div className="glass-card p-8 fade-up text-center max-w-lg w-full">
          <p className="font-heading text-2xl text-gradient tracking-wide">Login Successful</p>
          <p className="text-sm text-muted-foreground mt-2">Preparing your cinematic health intro...</p>
        </div>
      </div>
    );
  }

  if (step === "intro_video") {
    return (
      <IntroVideoPage
        userName={store.user?.name || "User"}
        hasExistingData={Boolean(store.profile || store.dailyLogs.length > 0)}
        onDone={() => setStep("onboarding")}
      />
    );
  }

  if (step === "onboarding") {
    return (
      <div className="min-h-screen transition-all duration-500 ease-in-out animate-in fade-in-0 slide-in-from-bottom-2">
        <ProfilePage
          userName={store.user?.name || ""}
          userEmail={store.user?.email || ""}
          onComplete={profile => {
            store.setProfile(profile);
            setStep("main_app");
          }}
        />
      </div>
    );
  }

  return <DashboardLayout store={store} onLogout={() => { store.logout(); setStep("auth"); }} />;
}
