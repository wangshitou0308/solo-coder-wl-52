import { ReactNode } from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  accent?: "ink" | "stamp" | "envelope" | "parchment";
  onClick?: () => void;
}

const accentStyles = {
  ink: {
    iconBg: "from-ink-500 to-ink-700",
    iconShadow: "shadow-ink-200",
    badge: "text-ink-600 bg-ink-50",
    ring: "ring-ink-200/60",
  },
  stamp: {
    iconBg: "from-stamp-400 to-stamp-600",
    iconShadow: "shadow-stamp-200",
    badge: "text-stamp-700 bg-stamp-50",
    ring: "ring-stamp-200/60",
  },
  envelope: {
    iconBg: "from-envelope-400 to-envelope-600",
    iconShadow: "shadow-envelope-200",
    badge: "text-envelope-600 bg-envelope-50",
    ring: "ring-envelope-200/60",
  },
  parchment: {
    iconBg: "from-parchment-500 to-parchment-700",
    iconShadow: "shadow-parchment-300",
    badge: "text-parchment-700 bg-parchment-100",
    ring: "ring-parchment-300/60",
  },
};

export default function StatCard({
  title,
  value,
  icon,
  description,
  accent = "ink",
  onClick,
}: Props) {
  const s = accentStyles[accent];

  return (
    <div
      onClick={onClick}
      className={cn(
        "card-parchment p-5 lg:p-6 relative overflow-hidden",
        onClick && "cursor-pointer hover:-translate-y-1 transition-transform duration-300"
      )}
    >
      {/* 装饰背景 */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.07] bg-gradient-to-br blur-2xl pointer-events-none"
        style={{
          background:
            accent === "ink"
              ? "#2C3E50"
              : accent === "stamp"
              ? "#D4A017"
              : accent === "envelope"
              ? "#C0392B"
              : "#A6874E",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                s.badge
              )}
            >
              {title}
            </span>
          </div>
          <div className="font-display text-3xl lg:text-4xl font-bold text-ink-800 mb-2 tabular-nums tracking-tight">
            {value}
          </div>
          {description && (
            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{description}</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br text-white shadow-lg",
            s.iconBg,
            s.iconShadow,
            "ring-4",
            s.ring,
            "flex-shrink-0"
          )}
        >
          <div className="w-6 h-6 lg:w-7 lg:h-7">{icon}</div>
        </div>
      </div>

      {onClick && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4 text-ink-300" />
        </div>
      )}
    </div>
  );
}
