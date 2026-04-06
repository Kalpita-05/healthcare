import { useMemo, useState } from "react";
import { AlertTriangle, ScanFace, Hand, Brain, Stethoscope } from "lucide-react";
import type { DayLog, QuickStats } from "@/hooks/useHealthStore";

interface Props {
  stats: QuickStats;
  latestLog: DayLog | null;
  weeklyLogs: DayLog[];
}

type SymptomCategory = "Face" | "Tongue" | "Hands & Nails" | "Joints" | "Muscular";

interface SymptomMarker {
  id: string;
  label: string;
  category: SymptomCategory;
  top: number;
  left: number;
  insight: string;
}

const markers: SymptomMarker[] = [
  { id: "face-cheeks", label: "Pimples (cheeks)", category: "Face", top: 22.8, left: 47.8, insight: "Pimples on cheeks may indicate dehydration or dust exposure." },
  { id: "face-nose", label: "Pimples (nose)", category: "Face", top: 22.8, left: 49.4, insight: "Recurring pimples on nose may indicate internal imbalance." },
  { id: "face-forehead", label: "Pimples (forehead)", category: "Face", top: 19.3, left: 49.3, insight: "Forehead breakouts can be related to stress or poor sleep quality." },
  { id: "face-chin", label: "Pimples (chin)", category: "Face", top: 24.8, left: 49.6, insight: "Chin breakouts can be linked to hormone and lifestyle fluctuations." },
  { id: "face-ear", label: "Pimples (ear)", category: "Face", top: 22.0, left: 51.8, insight: "Ear acne can be associated with friction, hygiene, or dietary triggers." },
  { id: "face-between-brows", label: "Pimples (between eyebrows)", category: "Face", top: 21.0, left: 49.5, insight: "This zone can react to stress and irregular eating patterns." },
  { id: "face-dark-circles", label: "Dark circles", category: "Face", top: 21.7, left: 50.2, insight: "Dark circles may indicate poor sleep or stress." },
  { id: "face-lips", label: "Lip dryness/discoloration", category: "Face", top: 23.9, left: 49.6, insight: "Dry or discolored lips may indicate dehydration or nutrient imbalance." },

  { id: "tongue-white", label: "White coating", category: "Tongue", top: 24.6, left: 48.9, insight: "White tongue coating can indicate dehydration or oral imbalance." },
  { id: "tongue-red", label: "Redness", category: "Tongue", top: 24.7, left: 49.8, insight: "Tongue redness may suggest inflammation or heat-related imbalance." },
  { id: "tongue-cracks", label: "Cracks", category: "Tongue", top: 24.9, left: 50.7, insight: "Tongue cracks can indicate dryness and hydration gaps." },

  { id: "hands-pale", label: "Pale nails", category: "Hands & Nails", top: 31.6, left: 7.8, insight: "Pale nails may suggest low iron or reduced circulation." },
  { id: "hands-white-spots", label: "White spots", category: "Hands & Nails", top: 31.7, left: 91.7, insight: "White spots can be linked to minor deficiency or nail trauma." },
  { id: "hands-yellow", label: "Yellow nails", category: "Hands & Nails", top: 32.7, left: 90.2, insight: "Yellow nails may indicate fungal or systemic nail changes." },

  { id: "joint-shoulder", label: "Shoulder pain", category: "Joints", top: 27.2, left: 41.0, insight: "Shoulder pain can signal posture strain or repetitive stress." },
  { id: "joint-elbow", label: "Elbow pain", category: "Joints", top: 30.4, left: 20.3, insight: "Elbow discomfort can arise from overuse and muscle imbalance." },
  { id: "joint-knee", label: "Knee pain", category: "Joints", top: 71.2, left: 48.0, insight: "Knee pain can be associated with low activity conditioning or joint strain." },

  { id: "muscle-soreness", label: "Muscle soreness", category: "Muscular", top: 39.5, left: 52.0, insight: "Muscle soreness can reflect recovery deficits, hydration, or overuse." },
  { id: "muscle-fatigue", label: "Fatigue", category: "Muscular", top: 48.8, left: 49.3, insight: "Fatigue may be linked to poor sleep, low activity rhythm, or stress load." },
];

function buildDynamicInsight(selected: SymptomMarker[], stats: QuickStats, latestLog: DayLog | null) {
  if (selected.length === 0) return null;

  const signals: string[] = [];
  if (stats.sleep < 6) signals.push("low sleep data");
  if (stats.steps < 4000) signals.push("low step count");
  if (stats.water < 2) signals.push("low hydration");
  if (latestLog && !latestLog.exercise) signals.push("limited recent activity");

  const symptomSnippet = selected.slice(0, 3).map(s => s.label.toLowerCase()).join(" + ");
  const signalSnippet = signals.length > 0 ? signals.join(" and ") : "your current tracked metrics";

  return `Based on your symptoms (${symptomSnippet}) and recent ${signalSnippet}, this may indicate lifestyle-related stress. Consider improving hydration, sleep consistency, and recovery habits.`;
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute z-20 -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-56 rounded-xl border border-border bg-card/95 p-2 text-xs text-foreground shadow-xl">
      {text}
    </div>
  );
}

function SymptomDots({
  markers,
  selectedIds,
  onToggle,
}: {
  markers: SymptomMarker[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {markers.map(marker => {
        const selected = selectedIds.has(marker.id);
        return (
          <button
            key={marker.id}
            type="button"
            onMouseEnter={() => setHovered(marker.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(marker.id)}
            onBlur={() => setHovered(null)}
            onClick={() => onToggle(marker.id)}
            className={`absolute w-3 h-3 rounded-full transition-all duration-300 z-10 ${selected ? "scale-110" : ""}`}
            style={{ top: `${marker.top}%`, left: `${marker.left}%`, transform: "translate(-50%, -50%)" }}
            aria-label={marker.label}
          >
            <span className={`absolute left-1/2 top-1/2 rounded-full ${selected ? "bg-primary" : "bg-primary/90"}`} style={{ width: "2px", height: "2px", transform: "translate(-50%, -50%)" }} />
            {hovered === marker.id ? <Tooltip text={marker.insight} /> : null}
          </button>
        );
      })}
    </>
  );
}

function BodyModel({ selectedIds, onToggle }: { selectedIds: Set<string>; onToggle: (id: string) => void }) {
  const sources = ["/human-body.png", "/human123.png", "/123.jpeg", "/placeholder.svg"];
  const [sourceIdx, setSourceIdx] = useState(0);
  const src = sources[sourceIdx];

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl overflow-hidden border border-border bg-card/60">
        <img
          src={src}
          alt="Human body symptom model"
          className="block w-full h-auto mx-auto select-none"
          onError={() => setSourceIdx(prev => Math.min(prev + 1, sources.length - 1))}
        />
        <SymptomDots markers={markers} selectedIds={selectedIds} onToggle={onToggle} />
      </div>
    </div>
  );
}

function SymptomCheckboxSection({
  title,
  items,
  selectedIds,
  onToggle,
}: {
  title: SymptomCategory;
  items: SymptomMarker[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
      <h5 className="font-heading font-semibold text-foreground mb-3">{title}</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map(item => (
          <label key={item.id} className="flex items-start gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
              checked={selectedIds.has(item.id)}
              onChange={() => onToggle(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function InsightGenerator({
  selected,
  stats,
  latestLog,
  weeklyLogs,
}: {
  selected: SymptomMarker[];
  stats: QuickStats;
  latestLog: DayLog | null;
  weeklyLogs: DayLog[];
}) {
  const message = useMemo(() => buildDynamicInsight(selected, stats, latestLog), [selected, stats, latestLog]);

  if (!message) return null;

  return (
    <div className="glow-card p-5">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={18} className="text-primary" />
        <h5 className="font-heading font-semibold text-foreground">Early Warning System</h5>
      </div>
      <p className="text-sm text-foreground">{message}</p>
      <p className="text-xs text-muted-foreground mt-2">Signal context: sleep {stats.sleep}h, steps {stats.steps.toLocaleString()}, water {stats.water}L, recent logs {weeklyLogs.length}.</p>
      <p className="text-xs text-muted-foreground mt-3 italic">This is a suggestion, not a medical diagnosis.</p>
    </div>
  );
}

export default function SmartBodyWarningSection({ stats, latestLog, weeklyLogs }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const categorized = useMemo(() => {
    const categories: SymptomCategory[] = ["Face", "Tongue", "Hands & Nails", "Joints", "Muscular"];
    return categories.map(category => ({ category, items: markers.filter(m => m.category === category) }));
  }, []);

  const selectedMarkers = useMemo(() => markers.filter(marker => selectedIds.has(marker.id)), [selectedIds]);

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="glass-card p-6 md:p-7 fade-up hover-card">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h4 className="font-heading text-xl font-semibold text-foreground">Smart Symptom Body Map</h4>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1"><ScanFace size={12} /> Face Mapping</span>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1"><Hand size={12} /> Hand & Nail Scanner</span>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1"><Stethoscope size={12} /> Tongue Analysis</span>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1"><Brain size={12} /> Symptom Timeline Intelligence</span>
      </div>

      <BodyModel selectedIds={selectedIds} onToggle={toggle} />

      <div className="mt-6">
        <p className="text-sm font-medium text-foreground mb-3">Select the symptoms you are experiencing</p>
        <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
          {categorized.map(section => (
            <SymptomCheckboxSection
              key={section.category}
              title={section.category}
              items={section.items}
              selectedIds={selectedIds}
              onToggle={toggle}
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <InsightGenerator selected={selectedMarkers} stats={stats} latestLog={latestLog} weeklyLogs={weeklyLogs} />
      </div>
    </section>
  );
}
