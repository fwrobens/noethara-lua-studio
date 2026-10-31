import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronUp, FolderOpen, Plus, Save, Trash2, TerminalSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DepthTab, spring } from "@/components/noethara/DepthTabs";
import { Editor } from "@/components/noethara/Editor";
import { FileTree } from "@/components/noethara/FileTree";
import { FileIcon, PlayIcon } from "@/components/noethara/icons";
import { mockRun, useWorkspace } from "@/components/noethara/workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio — Noethara Lua Workspace" },
      { name: "description", content: "Write, organize and preview Lua scripts in a calm, premium desktop-style workspace." },
      { property: "og:title", content: "Studio — Noethara Lua Workspace" },
      { property: "og:description", content: "Write, organize and preview Lua scripts in a calm, premium desktop-style workspace." },
    ],
  }),
  component: Studio,
});

function Studio() {
  const ws = useWorkspace();
  const reduce = useReducedMotion();
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"Preview" | "Sandbox">("Preview");
  const logEnd = useRef<HTMLDivElement>(null);
  const active = ws.nodes.find((n) => n.id === ws.activeId);

  const run = () => {
    if (!active || running) return;
    setRunning(true);
    setConsoleOpen(true);
    ws.log(`▶ ${active.name} (mock ${mode.toLowerCase()} run)`, "info");
    mockRun(active.content ?? "").forEach((l, i) => setTimeout(() => ws.log(l), 180 * (i + 1)));
    setTimeout(() => setRunning(false), 600);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && run();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });
  useEffect(() => logEnd.current?.scrollIntoView({ block: "end", behavior: reduce ? "auto" : "smooth" }), [ws.logs.length, reduce]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 pt-1">
      <div className="flex min-h-0 flex-1 gap-3">
        <div className="float-card w-60 shrink-0"><div className="cut-br h-full"><FileTree /></div></div>
        <div className="float-card flex min-w-0 flex-1">
        <section className="cut-bl flex min-w-0 flex-1 flex-col bg-panel-deep p-2">
          <div role="tablist" aria-label="Open files" className="flex items-center gap-1 rounded-xl border border-border bg-panel px-2 py-1.5" style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 9%)" }}>
            <AnimatePresence initial={false}>
              {ws.openTabs.map((id) => {
                const n = ws.nodes.find((x) => x.id === id);
                if (!n) return null;
                const isActive = id === ws.activeId;
                return (
                  <motion.div key={id} layout={!reduce} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={spring}>
                    <DepthTab
                      layoutId="file-tab-active"
                      active={isActive}
                      label={n.name}
                      onClick={() => ws.setActiveId(id)}
                      className="cut-tab h-9 rounded-none pl-4 pr-3 text-sm"
                      trailing={
                        <button
                          aria-label={`Close ${n.name}`}
                          onClick={(e) => (e.stopPropagation(), ws.closeTab(id))}
                          className="grid h-5 w-5 place-items-center rounded opacity-60 hover:bg-background/20 hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      }
                    >
                      <FileIcon size={16} active={isActive} />
                      <span>{n.name}</span>
                    </DepthTab>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <motion.button
              aria-label="New file"
              whileHover={{ y: -2 }}
              whileTap={{ y: 1, scale: 0.92 }}
              transition={spring}
              onClick={() => ws.create("file", null, `script${ws.nodes.length + 1}.lua`, "-- new script\nprint(\"Hello\")")}
              className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div key={active.id} className="flex min-h-0 flex-1" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? {} : { opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                <Editor value={active.content ?? ""} onChange={(v) => ws.update(active.id, v)} />
              </motion.div>
            ) : (
              <div className="grid flex-1 place-items-center text-sm text-muted-foreground">Open a file from the workspace to start editing.</div>
            )}
          </AnimatePresence>
        </section>
        </div>
      </div>

      {/* Console + run bar */}
      <div className="flex gap-3">
        <div className="float-card min-w-0 flex-1"><div className="cut-tr h-full bg-panel px-5 py-3">
          <button onClick={() => setConsoleOpen((o) => !o)} className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-muted-foreground hover:text-foreground">
            <TerminalSquare className="h-3.5 w-3.5" /> CONSOLE
            <motion.span animate={{ rotate: consoleOpen ? 0 : 180 }} transition={spring}><ChevronUp className="h-3.5 w-3.5" /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {consoleOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 112, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring} className="overflow-y-auto font-mono text-[12.5px] leading-5">
                <div className="pt-2">
                  {ws.logs.length === 0 && <p className="text-muted-foreground/60">Press Run to see mock output here.</p>}
                  <AnimatePresence initial={false}>
                    {ws.logs.map((l) => (
                      <motion.div key={l.id} initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                        <span className="text-muted-foreground/60">[{l.time}]</span>
                        <span className={cn(l.kind === "info" ? "text-primary" : l.kind === "error" ? "text-destructive" : "text-foreground")}>{l.text}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={logEnd} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div></div>
        <div className="float-card"><div className="cut-tl-br flex h-full items-center bg-panel pl-3">
        <div className="flex items-center gap-3 px-5">
          <BarBtn label="Save" onClick={() => ws.log(`Saved ${active?.name ?? "nothing"} (mock)`, "info")}><Save className="h-4 w-4" /></BarBtn>
          <BarBtn label="Open folder" onClick={() => ws.log("Open folder is a mock action", "info")}><FolderOpen className="h-4 w-4" /></BarBtn>
          <BarBtn label="Clear console" onClick={ws.clearLogs}><Trash2 className="h-4 w-4" /></BarBtn>
        </div>
        <div className="flex items-center gap-5 border-l border-border px-5">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 1, scale: 0.96 }}
            transition={spring}
            onClick={() => setMode((m) => (m === "Preview" ? "Sandbox" : "Preview"))}
            className="flex h-11 items-center gap-2 rounded-xl border border-border bg-secondary px-4 text-sm"
            style={{ boxShadow: "var(--shadow-lift)" }}
          >
            Mode: <span className="text-primary">{mode}</span>
          </motion.button>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success" /> Local session
          </span>
          <motion.button
            onClick={run}
            disabled={!active}
            whileHover={reduce ? {} : { scale: 1.06, y: -2 }}
            whileTap={reduce ? {} : { scale: 0.94, y: 1 }}
            transition={spring}
            aria-label="Run"
            className="my-3 grid h-16 w-16 place-items-center rounded-full text-primary-foreground disabled:opacity-50"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow), var(--shadow-lift)" }}
          >
            <motion.span animate={running && !reduce ? { scale: [1, 0.85, 1] } : { scale: 1 }} transition={{ duration: 0.5 }}>
              <PlayIcon size={26} />
            </motion.span>
          </motion.button>
          <div className="pr-1">
            <div className="text-lg font-semibold">Run</div>
            <div className="text-xs text-muted-foreground">Ctrl ↵</div>
          </div>
        </div>
        </div></div>
      </div>
    </div>
  );
}

function BarBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      aria-label={label}
      title={label}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ y: 1, scale: 0.94 }}
      transition={spring}
      className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground"
      style={{ boxShadow: "var(--shadow-lift)" }}
    >
      {children}
    </motion.button>
  );
}
