import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Minus, Square, X } from "lucide-react";
import { useState } from "react";
import { DepthTab } from "./DepthTabs";
import { themes, useTheme } from "./theme";
import { DiscoverIcon, LibraryIcon, LogoMark, StudioIcon } from "./icons";

const tabs = [
  { to: "/", label: "Studio", Icon: StudioIcon },
  { to: "/discover", label: "Discover", Icon: DiscoverIcon },
  { to: "/library", label: "Library", Icon: LibraryIcon },
] as const;

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className="relative flex h-16 items-center px-5">
      <Link to="/" className="flex items-center gap-3 text-foreground">
        <LogoMark size={34} className="text-primary" />
        <span className="text-xl font-light tracking-[0.2em]">noethara</span>
      </Link>
      <nav
        role="tablist"
        aria-label="Main"
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1 rounded-2xl border border-border bg-panel-deep/80 p-1.5 backdrop-blur"
        style={{ boxShadow: "var(--shadow-lift)" }}
      >
        {tabs.map(({ to, label, Icon }) => {
          const active = path === to;
          return (
            <DepthTab key={to} layoutId="nav-active" active={active} label={label} onClick={() => navigate({ to })} className="h-10 w-14 justify-center">
              <Icon active={active} />
            </DepthTab>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-4 text-muted-foreground">
        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} aria-label="Settings" title="Settings" className="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            R
          </button>
          {open && (
            <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-border bg-popover p-2 text-popover-foreground" style={{ boxShadow: "var(--shadow-lift)" }}>
              <div className="px-2 pb-1 pt-1 text-[11px] font-medium tracking-[0.2em] text-muted-foreground">SETTINGS · THEME</div>
              {themes.map((t) => (
                <button key={t.id} onClick={() => setTheme(t.id)} className={"flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-accent " + (theme === t.id ? "text-primary" : "")}>
                  {t.label}{theme === t.id && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="h-6 w-px bg-border" />
        <Minus className="h-4 w-4" />
        <Square className="h-3.5 w-3.5" />
        <X className="h-4 w-4" />
      </div>
    </header>
  );
}
