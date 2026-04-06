import {
  LayoutDashboard, CalendarDays, Lightbulb, ListChecks, Utensils, 
  FlaskConical, MessageCircle, UserCircle, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Daily Log", url: "/daily-log", icon: CalendarDays },
  { title: "Insights", url: "/dashboard#insights", icon: Lightbulb },
  { title: "Daily Tasks", url: "/tasks", icon: ListChecks },
  { title: "Diet Planner", url: "/diet", icon: Utensils },
  { title: "Simulation", url: "/simulation", icon: FlaskConical },
  { title: "Chatbot", url: "/dashboard#chatbot", icon: MessageCircle },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

interface Props {
  onLogout: () => void;
}

export default function AppSidebar({ onLogout }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
          <h1 className={`font-heading font-bold text-primary transition-all ${collapsed ? "text-lg text-center" : "text-xl"}`}>
            {collapsed ? "🌿" : "🌿 HealthFlow"}
          </h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-3">
          <Button
            type="button"
            onClick={onLogout}
            variant="outline"
            className="w-full rounded-xl justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
