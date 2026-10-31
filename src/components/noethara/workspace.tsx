import { createContext, useContext, useState, type ReactNode } from "react";

export type Node = { id: string; name: string; type: "file" | "folder"; parentId: string | null; content?: string | undefined };
export type LogLine = { id: number; time: string; text: string; kind: "out" | "info" | "error" };

const welcome = `-- Noethara workspace configuration
local workspace = {
    name = "Noethara",
    version = "1.0.0",
    author = "you",
    startedAt = os.time()
}

-- Greeting function
local function greet(name)
    local message = string.format("Welcome, %s. Enjoy your session!", name)
    return message
end

-- Format elapsed time
local function formatElapsed(startTime)
    local elapsed = os.time() - startTime
    local minutes = math.floor(elapsed / 60)
    local seconds = elapsed % 60
    return string.format("%02d:%02d", minutes, seconds)
end

print(greet(workspace.name))
print("Workspace ready. Elapsed: " .. formatElapsed(workspace.startedAt))`;

const initial: Node[] = [
  { id: "f1", name: "welcome.lua", type: "file", parentId: null, content: welcome },
  { id: "f2", name: "main.lua", type: "file", parentId: null, content: 'local utils = require("lib.utils")\n\nprint("Hello from main.lua")\nprint(utils.sum({1, 2, 3}))' },
  { id: "d1", name: "lib", type: "folder", parentId: null },
  { id: "f3", name: "utils.lua", type: "file", parentId: "d1", content: "local M = {}\n\nfunction M.sum(t)\n    local s = 0\n    for _, v in ipairs(t) do s = s + v end\n    return s\nend\n\nreturn M" },
  { id: "f4", name: "strings.lua", type: "file", parentId: "d1", content: 'local M = {}\n\nfunction M.trim(s)\n    return (s:gsub("^%s*(.-)%s*$", "%1"))\nend\n\nreturn M' },
];

let seq = 100;
const now = () => new Date().toTimeString().slice(0, 8);

function useWorkspaceState() {
  const [nodes, setNodes] = useState<Node[]>(initial);
  const [openTabs, setOpenTabs] = useState<string[]>(["f1", "f2"]);
  const [activeId, setActiveId] = useState<string | null>("f1");
  const [logs, setLogs] = useState<LogLine[]>([]);

  const open = (id: string) => {
    setOpenTabs((t) => (t.includes(id) ? t : [...t, id]));
    setActiveId(id);
  };
  const closeTab = (id: string) => {
    setOpenTabs((t) => {
      const next = t.filter((x) => x !== id);
      if (activeId === id) setActiveId(next[next.length - 1] ?? null);
      return next;
    });
  };
  const create = (type: Node["type"], parentId: string | null, name: string, content = "") => {
    const id = `n${seq++}`;
    setNodes((n) => [...n, { id, name, type, parentId, content: type === "file" ? content : undefined }]);
    if (type === "file") open(id);
    return id;
  };
  const rename = (id: string, name: string) => setNodes((n) => n.map((x) => (x.id === id ? { ...x, name } : x)));
  const remove = (id: string) => {
    const doomed = new Set([id]);
    let grew = true;
    while (grew) {
      grew = false;
      for (const n of nodes) if (n.parentId && doomed.has(n.parentId) && !doomed.has(n.id)) (doomed.add(n.id), (grew = true));
    }
    setNodes((n) => n.filter((x) => !doomed.has(x.id)));
    setOpenTabs((t) => {
      const next = t.filter((x) => !doomed.has(x));
      if (activeId && doomed.has(activeId)) setActiveId(next[next.length - 1] ?? null);
      return next;
    });
  };
  const update = (id: string, content: string) => setNodes((n) => n.map((x) => (x.id === id ? { ...x, content } : x)));
  const log = (text: string, kind: LogLine["kind"] = "out") => setLogs((l) => [...l, { id: seq++, time: now(), text, kind }]);
  const clearLogs = () => setLogs([]);

  return { nodes, openTabs, activeId, setActiveId, open, closeTab, create, rename, remove, update, logs, log, clearLogs };
}

type WS = ReturnType<typeof useWorkspaceState>;
const Ctx = createContext<WS | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useWorkspaceState()}>{children}</Ctx.Provider>;
}
export function useWorkspace() {
  const c = useContext(Ctx);
  if (!c) throw new Error("WorkspaceProvider missing");
  return c;
}

/** Mock runner: extracts string literals from print() calls. Never executes code. */
export function mockRun(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/print\(([^\n]*)\)/g)) {
    const strs = [...(m[1] ?? "").matchAll(/"([^"]*)"/g)].map((s) => (s[1] ?? "").replace(/%s/g, "Noethara"));
    out.push(strs.length ? strs.join("") : `<${(m[1] ?? "").trim()}>`);
  }
  return out.length ? out : ["(no output)"];
}
