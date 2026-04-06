import TopNav from "@/components/TopNav";
import QuickStatsRow from "@/components/dashboard/QuickStatsRow";
import HealthStatusRow from "@/components/dashboard/HealthStatusRow";
import TimelineRow from "@/components/dashboard/TimelineRow";
import GraphsRow from "@/components/dashboard/GraphsRow";
import InsightsRow from "@/components/dashboard/InsightsRow";
import ActionRow from "@/components/dashboard/ActionRow";
import RewardsSection from "@/components/dashboard/RewardsSection";
import CravingPanel from "@/components/dashboard/CravingPanel";
import SmartBodyWarningSection from "@/components/dashboard/smart-body/SmartBodyWarningSection";
import type { useHealthStore } from "@/hooks/useHealthStore";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  store: ReturnType<typeof useHealthStore>;
  onLogout: () => void;
}

export default function DashboardPage({ store, onLogout }: Props) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#insights") {
      const el = document.getElementById("insights-section");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopNav userName={store.user?.name || "User"} userEmail={store.user?.email || "No email"} stats={store.stats} notifications={store.notifications} onLogout={onLogout} />
      <main className="flex-1 p-4 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
        <QuickStatsRow stats={store.stats} onUpdateStats={store.setStats} hasData={store.hasData} />
        <HealthStatusRow healthScore={store.healthScore} stats={store.stats} suggestions={store.suggestions} hasData={store.hasData} />
        <TimelineRow weeklyLogs={store.weeklyLogs} profile={store.profile} userMood={store.user?.mood || "😐"} />
        <GraphsRow weeklyLogs={store.weeklyLogs} />
        <section id="insights-section">
          <InsightsRow insights={store.insights} aiInsight={store.aiInsight} hasData={store.hasData} />
        </section>
        <ActionRow actions={store.actions} hasData={store.hasData} />
        <CravingPanel stats={store.stats} />
        <SmartBodyWarningSection stats={store.stats} latestLog={store.latestLog} weeklyLogs={store.weeklyLogs} />
        <RewardsSection streak={store.streak} tasks={store.tasks} hasData={store.hasData} badges={store.badges} />
      </main>
    </div>
  );
}
