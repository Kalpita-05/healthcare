import { Bell, UserCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { QuickStats } from "@/hooks/useHealthStore";

interface Props {
  userName: string;
  stats: QuickStats;
}

export default function TopNav({ userName }: Props) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="font-heading font-semibold text-foreground hidden sm:inline">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <UserCircle size={28} className="text-primary" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
