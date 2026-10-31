import { createContext, useContext, useState, type ReactNode } from "react";

const Ctx = createContext<{ saved: Set<string>; toggle: (id: string) => void } | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Set<string>>(new Set(["t0", "t2"]));
  const toggle = (id: string) =>
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  return <Ctx.Provider value={{ saved, toggle }}>{children}</Ctx.Provider>;
}
export function useSaved() {
  const c = useContext(Ctx);
  if (!c) throw new Error("SavedProvider missing");
  return c;
}
