import { useRef, type ReactNode } from "react";

const KW = new Set("local function end return if then else elseif for in do while repeat until and or not nil true false break require".split(" "));
const BUILTIN = /^(print|string|math|os|table|ipairs|pairs|tostring|tonumber|type)$/;

function highlight(line: string, key: number): ReactNode {
  const out: ReactNode[] = [];
  const re = /(--.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const [t] = m;
    const cls = m[1] ? "text-syn-cm italic" : m[2] ? "text-syn-str" : m[3] ? "text-syn-num" : m[4] ? (KW.has(t) ? "text-syn-kw" : "text-syn-fn") : KW.has(t) ? "text-syn-kw" : BUILTIN.test(t) ? "text-syn-num" : "";
    out.push(cls ? <span key={`${key}-${i++}`} className={cls}>{t}</span> : t);
    last = m.index + t.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function Editor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const pre = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const lines = value.split("\n");
  const cls = "m-0 whitespace-pre p-4 font-mono text-[13.5px] leading-6";
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <div ref={gutter} className="w-14 shrink-0 select-none overflow-hidden border-r border-border py-4 pr-3 text-right font-mono text-[12.5px] leading-6 text-muted-foreground/60">
        {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <div className="relative min-w-0 flex-1">
        <pre ref={pre} aria-hidden className={`${cls} pointer-events-none absolute inset-0 overflow-hidden text-foreground`}>
          {lines.map((l, i) => <div key={i}>{highlight(l, i)}{"\n"}</div>)}
        </pre>
        <textarea
          aria-label="Code editor"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            const t = e.currentTarget;
            if (pre.current) (pre.current.scrollTop = t.scrollTop), (pre.current.scrollLeft = t.scrollLeft);
            if (gutter.current) gutter.current.scrollTop = t.scrollTop;
          }}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const t = e.currentTarget;
              const s = t.selectionStart;
              onChange(value.slice(0, s) + "    " + value.slice(t.selectionEnd));
              requestAnimationFrame(() => (t.selectionStart = t.selectionEnd = s + 4));
            }
          }}
          className={`${cls} absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent text-transparent caret-primary outline-none selection:bg-primary/30`}
        />
      </div>
    </div>
  );
}
