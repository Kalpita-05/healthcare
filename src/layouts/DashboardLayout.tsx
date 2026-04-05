import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ChatbotFloat from "@/components/ChatbotFloat";
import DashboardPage from "@/pages/DashboardPage";
import TasksPage from "@/pages/TasksPage";
import DietPage from "@/pages/DietPage";
import type { useHealthStore } from "@/hooks/useHealthStore";

interface Props {
  store: ReturnType<typeof useHealthStore>;
}

export default function DashboardLayout({ store }: Props) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage store={store} />} />
            <Route path="/tasks" element={<TasksPage tasks={store.tasks} toggleTask={store.toggleTask} addTask={store.addTask} healthScore={store.healthScore} />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
      <ChatbotFloat stats={store.stats} hasData={store.hasData} />
    </SidebarProvider>
  );
}
