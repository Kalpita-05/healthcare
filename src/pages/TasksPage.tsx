import { useState } from "react";
import { Plus, ListChecks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { DailyTask } from "@/hooks/useHealthStore";

interface Props {
  tasks: DailyTask[];
  toggleTask: (id: string) => void;
  addTask: (label: string) => void;
  healthScore: number;
}

export default function TasksPage({ tasks, toggleTask, addTask, healthScore }: Props) {
  const [newTask, setNewTask] = useState("");
  const done = tasks.filter(t => t.done).length;

  return (
    <div className="flex-1 min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 h-14 flex items-center px-4 gap-2">
        <SidebarTrigger />
        <h2 className="font-heading font-semibold text-foreground">Daily Tasks</h2>
      </header>
      <main className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <div className="glass-card p-6 fade-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListChecks size={20} className="text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Today's Checklist</h3>
            </div>
            <span className="text-sm text-muted-foreground">{done}/{tasks.length} done</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-4">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(done / tasks.length) * 100}%` }} />
          </div>
          <ul className="space-y-3">
            {tasks.map(t => (
              <li key={t.id} className="flex items-center gap-3 group">
                <Checkbox checked={t.done} onCheckedChange={() => toggleTask(t.id)} />
                <span className={`text-sm transition-all ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.label}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-4">
            <Input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && newTask.trim()) { addTask(newTask.trim()); setNewTask(""); } }}
              placeholder="Add custom task…"
              className="rounded-xl text-sm"
            />
            <Button size="icon" onClick={() => { if (newTask.trim()) { addTask(newTask.trim()); setNewTask(""); } }} className="rounded-xl shrink-0">
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <div className="glass-card p-5 fade-up text-center">
          <p className="text-sm text-muted-foreground mb-1">Tasks contribute to your</p>
          <p className="text-3xl font-heading font-bold text-primary">{healthScore}</p>
          <p className="text-sm text-muted-foreground">Health Score</p>
        </div>
      </main>
    </div>
  );
}
