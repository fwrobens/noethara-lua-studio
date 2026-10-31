import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useSaved } from "@/components/noethara/saved";
import { TemplateCard } from "@/components/noethara/TemplateCard";
import { templates } from "@/components/noethara/templates";
import { useWorkspace } from "@/components/noethara/workspace";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Noethara" },
      { name: "description", content: "Your saved Lua templates, ready to open in the Noethara studio." },
      { property: "og:title", content: "Library — Noethara" },
      { property: "og:description", content: "Your saved Lua templates, ready to open in the Noethara studio." },
    ],
  }),
  component: Library,
});

function Library() {
  const { saved, toggle } = useSaved();
  const ws = useWorkspace();
  const navigate = useNavigate();
  const list = templates.filter((t) => saved.has(t.id));
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Library</h1>
        <span className="h-0.5 w-10 rounded bg-primary" />
        <span className="text-sm text-muted-foreground">{list.length} saved</span>
      </div>
      <div className="mt-5 grid auto-rows-[200px] grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((t, i) => (
            <TemplateCard key={t.id} t={t} index={i} saved onSave={() => toggle(t.id)} onUse={() => (ws.create("file", null, `${t.title.toLowerCase().replace(/[^a-z]+/g, "-")}.lua`, t.code), navigate({ to: "/" }))} />
          ))}
        </AnimatePresence>
      </div>
      {list.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">
          Nothing saved yet. Bookmark templates on <Link to="/discover" className="text-primary underline">Discover</Link>.
        </p>
      )}
    </div>
  );
}
