import { Droplets, Footprints, Moon, Heart, Apple, Sun } from "lucide-react";

const icons = [
  { Icon: Droplets, x: "10%", y: "20%", delay: "0s", size: 28 },
  { Icon: Footprints, x: "80%", y: "15%", delay: "1s", size: 24 },
  { Icon: Moon, x: "25%", y: "70%", delay: "2s", size: 22 },
  { Icon: Heart, x: "70%", y: "60%", delay: "0.5s", size: 26 },
  { Icon: Apple, x: "50%", y: "35%", delay: "1.5s", size: 20 },
  { Icon: Sun, x: "85%", y: "80%", delay: "3s", size: 30 },
];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, x, y, delay, size }, i) => (
        <div
          key={i}
          className="absolute floating-element opacity-20 text-primary"
          style={{ left: x, top: y, animationDelay: delay }}
        >
          <Icon size={size} />
        </div>
      ))}
    </div>
  );
}
