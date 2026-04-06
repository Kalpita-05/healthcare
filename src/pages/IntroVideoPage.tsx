import { useEffect, useRef, useState } from "react";
import { Sparkles, Activity, Footprints, Moon } from "lucide-react";

interface Props {
  userName: string;
  hasExistingData: boolean;
  onDone: () => void;
}

const VIDEO_SRC = "/kk.mp4";

export default function IntroVideoPage({ userName, hasExistingData, onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const preloader = document.createElement("video");
    preloader.preload = "auto";
    preloader.src = VIDEO_SRC;
    preloader.load();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    const promise = videoRef.current.play();
    if (promise) {
      promise.catch(() => {
        // Autoplay policies can block media playback; keep controls visible.
      });
    }
  }, [canPlay]);

  return (
    <div className="min-h-screen health-gradient-bg flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl glass-card overflow-hidden fade-up relative">
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur text-sm font-medium text-foreground">
          {hasExistingData ? `Welcome back, ${userName}` : `Welcome, ${userName}`}
        </div>

        <button
          type="button"
          onClick={onDone}
          className="absolute top-4 right-4 z-20 rounded-xl px-3 py-1.5 text-sm bg-card/80 backdrop-blur border border-border hover-card"
        >
          Skip
        </button>

        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={VIDEO_SRC}
            preload="auto"
            playsInline
            muted
            autoPlay
            onCanPlay={() => setCanPlay(true)}
            onEnded={onDone}
            controls
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="glass-card p-3 md:p-4 hover-card">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Moon size={12} /> Sleep Insight</p>
              <p className="text-sm font-medium text-foreground">Rest impacts your full-day energy curve.</p>
            </div>
            <div className="glass-card p-3 md:p-4 hover-card">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Footprints size={12} /> Activity Insight</p>
              <p className="text-sm font-medium text-foreground">Small walks compound into major progress.</p>
            </div>
            <div className="glow-card p-3 md:p-4 hover-card">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Activity size={12} /> Health AI</p>
              <p className="text-sm font-medium text-foreground">Your dashboard will adapt to your daily logs.</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-5 border-t border-border bg-card/70 backdrop-blur">
          <p className="text-sm md:text-base text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Preparing your personalized onboarding experience...
          </p>
        </div>
      </div>
    </div>
  );
}
