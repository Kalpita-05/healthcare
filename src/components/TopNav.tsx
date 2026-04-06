import { Bell, UserCircle, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { QuickStats } from "@/hooks/useHealthStore";
import type { HealthNotification } from "@/hooks/useHealthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  userName: string;
  userEmail: string;
  stats: QuickStats;
  notifications: HealthNotification[];
  onLogout: () => void;
}

export default function TopNav({ userName, userEmail, notifications, onLogout }: Props) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="font-heading font-semibold text-2xl tracking-wide text-gradient hidden sm:inline">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                <Bell size={20} />
                {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl">
              <DropdownMenuLabel>Smart Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <DropdownMenuItem className="text-muted-foreground">No reminders yet</DropdownMenuItem>
              ) : (
                notifications.map(item => (
                  <DropdownMenuItem key={item.id} className="whitespace-normal leading-relaxed items-start">
                    {item.message}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <UserCircle size={28} className="text-primary" />
                <span className="text-sm font-medium text-foreground hidden sm:inline">{userName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem className="flex-col items-start pointer-events-none opacity-100">
                <span className="font-medium text-foreground">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
