import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ChatbotFloat from "@/components/ChatbotFloat";
import DashboardPage from "@/pages/DashboardPage";
import TasksPage from "@/pages/TasksPage";
import DietPage from "@/pages/DietPage";
import DailyLogPage from "@/pages/DailyLogPage";
import SimulationPage from "@/pages/SimulationPage";
import UserProfilePage from "@/pages/UserProfilePage";
import type { useHealthStore } from "@/hooks/useHealthStore";

interface Props {
  store: ReturnType<typeof useHealthStore>;
  onLogout: () => void;
}

export default function DashboardLayout({ store, onLogout }: Props) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onLogout={onLogout} />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage store={store} onLogout={onLogout} />} />
            <Route path="/daily-log" element={<DailyLogPage store={store} />} />
            <Route path="/tasks" element={<TasksPage tasks={store.tasks} toggleTask={store.toggleTask} addTask={store.addTask} healthScore={store.healthScore} />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/simulation" element={<SimulationPage store={store} />} />
            <Route path="/profile" element={<UserProfilePage store={store} />} />
            <Route path="/insights" element={<Navigate to="/dashboard#insights" replace />} />
            <Route path="/chatbot" element={<Navigate to="/dashboard#chatbot" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
      <ChatbotFloat stats={store.stats} hasData={store.hasData} />
    </SidebarProvider>
  );
}
