import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Minus, Square, X } from "lucide-react";
import { DepthTab } from "./DepthTabs";
import { DiscoverIcon, LibraryIcon, LogoMark, StudioIcon } from "./icons";

const tabs = [
  { to: "/", label: "Studio", Icon: StudioIcon },
  { to: "/discover", label: "Discover", Icon: DiscoverIcon },
  { to: "/library", label: "Library", Icon: LibraryIcon },
] as const;

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
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
        <div className="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          R
        </div>
        <div className="h-6 w-px bg-border" />
        <Minus className="h-4 w-4" />
        <Square className="h-3.5 w-3.5" />
        <X className="h-4 w-4" />
      </div>
    </header>
  );
}
