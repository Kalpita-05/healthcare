import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FloatingIcons from "@/components/FloatingIcons";
import { getGreeting } from "@/hooks/useTimeTheme";

const moods = ["😊", "😐", "😴", "😫"];

interface Props {
  onLogin: (name: string, email: string, mood: string) => void;
}

export default function AuthPage({ onLogin }: Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [mood, setMood] = useState("😊");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) onLogin(name, email, mood);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - animated bg */}
      <div className="hidden lg:flex lg:w-1/2 health-gradient-bg relative items-center justify-center overflow-hidden">
        <FloatingIcons />
        <div className="relative z-10 text-center px-12 fade-up">
          <h1 className="text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
            Your Personal<br />Health AI Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            A calm, intelligent companion guiding you toward better daily health decisions.
          </p>
          <div className="flex justify-center gap-6 text-4xl">
            <span className="floating-element" style={{ animationDelay: "0s" }}>❤️</span>
            <span className="floating-element" style={{ animationDelay: "0.5s" }}>💧</span>
            <span className="floating-element" style={{ animationDelay: "1s" }}>👣</span>
            <span className="floating-element" style={{ animationDelay: "1.5s" }}>😴</span>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 health-gradient-bg lg:bg-none">
        <div className="glass-card w-full max-w-md p-8 fade-up hover-card" style={{ animationDelay: "0.15s" }}>
          <h2 className="text-2xl font-heading font-semibold text-foreground mb-1">{getGreeting()}</h2>
          <p className="text-muted-foreground mb-6">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User size={14} className="text-primary" /> Name
              </label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="mt-1 rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail size={14} className="text-primary" /> Email
              </label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1 rounded-xl" />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock size={14} className="text-primary" /> Password
              </label>
              <div className="relative mt-1">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mood selector */}
            <div>
              <label className="text-sm font-medium text-foreground">How are you feeling?</label>
              <div className="flex gap-3 mt-2">
                {moods.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`text-2xl p-2 rounded-xl transition-all duration-200 ${mood === m ? "bg-primary/20 scale-110 ring-2 ring-primary shadow-md" : "hover:bg-muted hover:scale-105"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:shadow-lg">
              {isSignUp ? "Start Your Health Journey" : "Sign In"} →
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
