import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const spring = { type: "spring", stiffness: 420, damping: 32, mass: 0.8 } as const;

/** A tab button with depth: lifts on hover, sinks on press, shares a sliding indicator. */
export function DepthTab({
  active,
  layoutId,
  onClick,
  label,
  children,
  className,
  trailing,
}: {
  active: boolean;
  layoutId: string;
  onClick?: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  trailing?: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      role="tab"
      aria-selected={active}
      aria-label={label}
      title={label}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      whileHover={reduce ? {} : { y: -2 }}
      whileTap={reduce ? {} : { y: 1, scale: 0.96 }}
      transition={spring}
      className={cn(
        "group relative flex cursor-pointer select-none items-center gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={reduce ? { duration: 0 } : spring}
          className="absolute inset-0 -z-0 rounded-xl"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow), var(--shadow-lift)" }}
        />
      )}
      {!active && (
        <span
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-active:opacity-100"
          style={{ boxShadow: "var(--shadow-lift)", background: "color-mix(in oklab, var(--foreground) 4%, transparent)" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {trailing && <span className="relative z-10">{trailing}</span>}
    </motion.div>
  );
}
