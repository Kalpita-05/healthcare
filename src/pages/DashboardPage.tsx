import TopNav from "@/components/TopNav";
import QuickStatsRow from "@/components/dashboard/QuickStatsRow";
import HealthStatusRow from "@/components/dashboard/HealthStatusRow";
import TimelineRow from "@/components/dashboard/TimelineRow";
import GraphsRow from "@/components/dashboard/GraphsRow";
import InsightsRow from "@/components/dashboard/InsightsRow";
import ActionRow from "@/components/dashboard/ActionRow";
import RewardsSection from "@/components/dashboard/RewardsSection";
import CravingPanel from "@/components/dashboard/CravingPanel";
import type { useHealthStore } from "@/hooks/useHealthStore";

interface Props {
  store: ReturnType<typeof useHealthStore>;
}

export default function DashboardPage({ store }: Props) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopNav userName={store.user?.name || "User"} stats={store.stats} />
      <main className="flex-1 p-4 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
        <QuickStatsRow stats={store.stats} onUpdateStats={store.setStats} hasData={store.hasData} />
        <HealthStatusRow healthScore={store.healthScore} stats={store.stats} suggestions={store.suggestions} hasData={store.hasData} />
        <TimelineRow weeklyLogs={store.weeklyLogs} />
        <GraphsRow weeklyLogs={store.weeklyLogs} />
        <InsightsRow insights={store.insights} aiInsight={store.aiInsight} hasData={store.hasData} />
        <ActionRow actions={store.actions} hasData={store.hasData} />
        <CravingPanel />
        <RewardsSection streak={store.streak} tasks={store.tasks} hasData={store.hasData} />
      </main>
    </div>
  );
}
