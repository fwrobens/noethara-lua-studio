import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight, FilePlus, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { spring } from "./DepthTabs";
import { FileIcon, FolderIcon } from "./icons";
import { useWorkspace, type Node } from "./workspace";

type Draft = { parentId: string | null; type: Node["type"] } | null;

function NameInput({ initial, onDone }: { initial: string; onDone: (v: string | null) => void }) {
  const [v, setV] = useState(initial);
  return (
    <input
      autoFocus
      value={v}
      onFocus={(e) => e.target.select()}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => onDone(v.trim() || null)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onDone(v.trim() || null);
        if (e.key === "Escape") onDone(null);
      }}
      className="w-full min-w-0 rounded-md border border-ring/60 bg-panel-deep px-1.5 py-0.5 text-sm text-foreground outline-none"
    />
  );
}

export function FileTree() {
  const ws = useWorkspace();
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["d1"]));
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(null);

  const toggle = (id: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const children = (pid: string | null) =>
    ws.nodes
      .filter((n) => n.parentId === pid)
      .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1));

  const startDraft = (parentId: string | null, type: Node["type"]) => {
    if (parentId) setExpanded((s) => new Set(s).add(parentId));
    setDraft({ parentId, type });
  };

  const rowAnim = reduce
    ? {}
    : { initial: { opacity: 0, x: -8, height: 0 }, animate: { opacity: 1, x: 0, height: "auto" }, exit: { opacity: 0, x: -8, height: 0 }, transition: spring };

  const renderLevel = (pid: string | null, depth: number) => (
    <AnimatePresence initial={false}>
      {draft && draft.parentId === pid && (
        <motion.div key="draft" {...rowAnim} className="overflow-hidden">
          <div className="flex items-center gap-2 py-1.5 pr-2" style={{ paddingLeft: 12 + depth * 14 }}>
            {draft.type === "folder" ? <FolderIcon size={17} /> : <FileIcon size={17} />}
            <NameInput
              initial={draft.type === "folder" ? "new-folder" : "untitled.lua"}
              onDone={(v) => {
                if (v) ws.create(draft.type, draft.parentId, v);
                setDraft(null);
              }}
            />
          </div>
        </motion.div>
      )}
      {children(pid).map((n) => {
        const isOpen = expanded.has(n.id);
        const active = ws.activeId === n.id;
        return (
          <motion.div key={n.id} layout={!reduce} {...rowAnim} className="overflow-hidden">
            <div
              onClick={() => (n.type === "folder" ? toggle(n.id) : ws.open(n.id))}
              onDoubleClick={() => setEditing(n.id)}
              className={cn(
                "group relative mx-2 flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-1 text-sm transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
              style={{ paddingLeft: 10 + depth * 14 }}
            >
              {active && (
                <motion.span
                  layoutId="tree-active"
                  transition={spring}
                  className="absolute inset-0 rounded-lg bg-accent"
                  style={{ boxShadow: "inset 3px 0 0 var(--primary)" }}
                />
              )}
              <span className="relative flex w-3 justify-center">
                {n.type === "folder" && (
                  <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={spring}>
                    <ChevronRight className="h-3 w-3" />
                  </motion.span>
                )}
              </span>
              <span className={cn("relative", active && "text-primary")}>
                {n.type === "folder" ? <FolderIcon size={17} open={isOpen} active={isOpen} /> : <FileIcon size={17} active={active} />}
              </span>
              <span className="relative min-w-0 flex-1 truncate">
                {editing === n.id ? (
                  <NameInput
                    initial={n.name}
                    onDone={(v) => {
                      if (v) ws.rename(n.id, v);
                      setEditing(null);
                    }}
                  />
                ) : (
                  n.name
                )}
              </span>
              <span className="relative flex opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                {n.type === "folder" && (
                  <>
                    <IconBtn label="New file" onClick={() => startDraft(n.id, "file")}><FilePlus className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn label="New folder" onClick={() => startDraft(n.id, "folder")}><FolderPlus className="h-3.5 w-3.5" /></IconBtn>
                  </>
                )}
                <IconBtn label="Rename" onClick={() => setEditing(n.id)}><Pencil className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn label="Delete" danger onClick={() => ws.remove(n.id)}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
              </span>
            </div>
            {n.type === "folder" && (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="kids"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? {} : { height: 0, opacity: 0 }}
                    transition={spring}
                    className="overflow-hidden"
                  >
                    {renderLevel(n.id, depth + 1)}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-panel">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground">WORKSPACE</span>
        <div className="flex gap-1">
          <IconBtn label="New file" onClick={() => startDraft(null, "file")}><FilePlus className="h-4 w-4" /></IconBtn>
          <IconBtn label="New folder" onClick={() => startDraft(null, "folder")}><FolderPlus className="h-4 w-4" /></IconBtn>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-4">{renderLevel(null, 0)}</div>
      <p className="px-5 pb-4 text-[11px] text-muted-foreground/70">Double-click to rename</p>
    </aside>
  );
}

export function IconBtn({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ y: 1, scale: 0.92 }}
      transition={spring}
      className={cn(
        "grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        danger && "hover:text-destructive",
      )}
    >
      {children}
    </motion.button>
  );
}
