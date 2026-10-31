import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Bookmark, Eye, GraduationCap, Sparkles } from "lucide-react";
import { spring } from "./DepthTabs";
import type { Template } from "./templates";

export function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);
}

export function TemplateCard({ t, saved, onSave, onUse, index }: { t: Template; saved: boolean; onSave: () => void; onUse: () => void; index: number }) {
  const reduce = useReducedMotion();
  const art = `radial-gradient(circle at 70% 30%, oklch(0.75 0.16 ${t.hue} / 0.9), transparent 45%), radial-gradient(circle at 20% 80%, oklch(0.55 0.18 ${t.hue + 40} / 0.8), transparent 50%), linear-gradient(135deg, oklch(0.25 0.06 ${t.hue}), oklch(0.15 0.03 ${t.hue + 60}))`;
  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? {} : { opacity: 0, scale: 0.96 }}
      transition={{ ...spring, delay: reduce ? 0 : index * 0.05 }}
      whileHover={reduce ? {} : { y: -4 }}
      className="group flex overflow-hidden rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-lift)" }}
    >
      <div className="relative w-[46%] shrink-0 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: art }} />
        <pre className="absolute inset-0 overflow-hidden p-4 font-mono text-[10px] leading-4 text-foreground/40">{t.code}</pre>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.author}</p>
          </div>
          <motion.button whileTap={{ scale: 0.85 }} aria-label={saved ? "Remove from library" : "Save to library"} onClick={onSave} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent">
            <Bookmark className={saved ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground"} />
          </motion.button>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
        <div className="mt-3 flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {t.category}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs">
            <GraduationCap className="h-3.5 w-3.5 text-syn-num" /> {t.level}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-4">
          <span className="flex items-center gap-2 text-sm text-muted-foreground"><Eye className="h-4 w-4" /> {compact(t.uses)}</span>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 1, scale: 0.94 }}
            transition={spring}
            onClick={onUse}
            aria-label={`Use ${t.title} template`}
            className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-secondary hover:text-primary"
            style={{ boxShadow: "var(--shadow-lift)" }}
          >
            <ArrowUpRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
