import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { spring } from "@/components/noethara/DepthTabs";
import { useSaved } from "@/components/noethara/saved";
import { TemplateCard } from "@/components/noethara/TemplateCard";
import { templates, type Template } from "@/components/noethara/templates";
import { useWorkspace } from "@/components/noethara/workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Lua templates — Noethara" },
      { name: "description", content: "Browse a library of reusable Lua templates: utilities, data structures, text tools and algorithms." },
      { property: "og:title", content: "Discover Lua templates — Noethara" },
      { property: "og:description", content: "Browse a library of reusable Lua templates and open them in your workspace." },
    ],
  }),
  component: Discover,
});

const cats = ["All", "Utilities", "Data", "Text", "Algorithms", "Patterns"] as const;
const PER = 4;

function Discover() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [beginner, setBeginner] = useState(false);
  const [sort, setSort] = useState<"Popular" | "A–Z">("Popular");
  const [page, setPage] = useState(0);
  const { saved, toggle } = useSaved();
  const ws = useWorkspace();
  const navigate = useNavigate();

  const list = useMemo(() => {
    let l = templates.filter((t) => (cat === "All" || t.category === cat) && (!beginner || t.level === "Beginner") && (t.title + t.description).toLowerCase().includes(q.toLowerCase()));
    l = [...l].sort((a, b) => (sort === "Popular" ? b.uses - a.uses : a.title.localeCompare(b.title)));
    return l;
  }, [q, cat, beginner, sort]);
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const p = Math.min(page, pages - 1);

  const use = (t: Template) => {
    ws.create("file", null, `${t.title.toLowerCase().replace(/[^a-z]+/g, "-")}.lua`, t.code);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Discover</h1>
        <span className="h-0.5 w-10 rounded bg-primary" />
        <span className="text-sm text-muted-foreground">Template library</span>
        <label className="ml-auto flex h-10 w-72 items-center gap-2 rounded-xl border border-border bg-panel-deep px-3 text-sm focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => (setQ(e.target.value), setPage(0))} placeholder="Search templates" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
        </label>
        <Chip active={beginner} onClick={() => (setBeginner((b) => !b), setPage(0))}>Beginner friendly</Chip>
        <Chip active={false} onClick={() => setSort((s) => (s === "Popular" ? "A–Z" : "Popular"))}>
          <TrendingUp className="h-4 w-4" /> {sort}
        </Chip>
      </div>
      <div className="mt-4 flex gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => (setCat(c), setPage(0))} className={cn("relative rounded-lg px-3 py-1.5 text-sm transition-colors", cat === c ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {cat === c && <motion.span layoutId="cat-active" transition={spring} className="absolute inset-0 rounded-lg bg-accent" style={{ boxShadow: "inset 0 -2px 0 var(--primary)" }} />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid flex-1 auto-rows-[200px] grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.slice(p * PER, p * PER + PER).map((t, i) => (
            <TemplateCard key={t.id} t={t} index={i} saved={saved.has(t.id)} onSave={() => toggle(t.id)} onUse={() => use(t)} />
          ))}
        </AnimatePresence>
        {list.length === 0 && <p className="col-span-full text-center text-muted-foreground">No templates match your filters.</p>}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <PagerBtn label="Previous page" disabled={p === 0} onClick={() => setPage(p - 1)}><ChevronLeft className="h-4 w-4" /></PagerBtn>
        <span className="font-mono text-sm tabular-nums">{String(p + 1).padStart(2, "0")} / {String(pages).padStart(2, "0")}</span>
        <PagerBtn label="Next page" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}><ChevronRight className="h-4 w-4" /></PagerBtn>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ y: 1, scale: 0.96 }} transition={spring} onClick={onClick}
      className={cn("flex h-10 items-center gap-2 rounded-xl border px-4 text-sm", active ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-secondary")}
      style={{ boxShadow: "var(--shadow-lift)" }}>
      {children}
    </motion.button>
  );
}

function PagerBtn({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button aria-label={label} disabled={disabled} onClick={onClick} whileHover={disabled ? {} : { y: -2 }} whileTap={disabled ? {} : { y: 1 }} transition={spring}
      className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-secondary disabled:opacity-40" style={{ boxShadow: "var(--shadow-lift)" }}>
      {children}
    </motion.button>
  );
}
