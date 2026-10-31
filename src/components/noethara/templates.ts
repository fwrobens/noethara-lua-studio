export type Template = {
  id: string;
  title: string;
  author: string;
  category: "Utilities" | "Data" | "Text" | "Algorithms" | "Patterns";
  level: "Beginner" | "Intermediate";
  uses: number;
  hue: number;
  description: string;
  code: string;
};

const t = (x: Omit<Template, "id">, i: number): Template => ({ ...x, id: `t${i}` });

export const templates: Template[] = ([
  { title: "Table utilities", author: "@nyxdev", category: "Utilities", level: "Beginner", uses: 12400, hue: 290, description: "map, filter and reduce helpers for plain tables.", code: 'local T = {}\nfunction T.map(t, f)\n    local r = {}\n    for i, v in ipairs(t) do r[i] = f(v) end\n    return r\nend\nprint("map ready")\nreturn T' },
  { title: "String toolkit", author: "@sunflow", category: "Text", level: "Beginner", uses: 8560, hue: 200, description: "trim, split and pad strings with no dependencies.", code: 'local S = {}\nfunction S.split(s, sep)\n    local out = {}\n    for p in s:gmatch("([^" .. sep .. "]+)") do out[#out+1] = p end\n    return out\nend\nprint("split ready")\nreturn S' },
  { title: "Event emitter", author: "@orbit", category: "Patterns", level: "Intermediate", uses: 6120, hue: 330, description: "A tiny publish / subscribe pattern for decoupled code.", code: 'local Emitter = {}\nEmitter.__index = Emitter\nfunction Emitter.new() return setmetatable({ h = {} }, Emitter) end\nprint("emitter ready")\nreturn Emitter' },
  { title: "JSON-ish encoder", author: "@voidscript", category: "Data", level: "Intermediate", uses: 4300, hue: 150, description: "Serialize nested tables into readable strings.", code: 'local function encode(v)\n    if type(v) ~= "table" then return tostring(v) end\n    return "{...}"\nend\nprint("encoder ready")' },
  { title: "Binary search", author: "@mira", category: "Algorithms", level: "Beginner", uses: 3980, hue: 60, description: "Classic search over sorted arrays with clear comments.", code: 'local function bsearch(t, x)\n    local lo, hi = 1, #t\n    while lo <= hi do\n        local mid = math.floor((lo + hi) / 2)\n        if t[mid] == x then return mid end\n        if t[mid] < x then lo = mid + 1 else hi = mid - 1 end\n    end\nend\nprint("found at index 3")' },
  { title: "Class helper", author: "@kestrel", category: "Patterns", level: "Intermediate", uses: 3510, hue: 260, description: "Metatable-based classes with inheritance.", code: 'local function class(base)\n    local c = {}\n    c.__index = c\n    return setmetatable(c, { __index = base })\nend\nprint("class ready")' },
  { title: "Memoize", author: "@lumen", category: "Utilities", level: "Beginner", uses: 2890, hue: 20, description: "Cache function results by argument.", code: 'local function memo(f)\n    local cache = {}\n    return function(x)\n        if cache[x] == nil then cache[x] = f(x) end\n        return cache[x]\n    end\nend\nprint("memo ready")' },
  { title: "CSV parser", author: "@tidal", category: "Data", level: "Intermediate", uses: 2200, hue: 180, description: "Parse simple comma-separated text into rows.", code: 'local function parse(line)\n    local row = {}\n    for c in line:gmatch("[^,]+") do row[#row+1] = c end\n    return row\nend\nprint("csv ready")' },
  { title: "Queue", author: "@nyxdev", category: "Data", level: "Beginner", uses: 1900, hue: 310, description: "A double-ended queue with O(1) push and pop.", code: 'local Q = { first = 1, last = 0, items = {} }\nprint("queue ready")\nreturn Q' },
  { title: "Text wrap", author: "@sunflow", category: "Text", level: "Beginner", uses: 1640, hue: 230, description: "Wrap long text to a fixed column width.", code: 'local function wrap(s, w)\n    return s\nend\nprint("wrap ready")' },
  { title: "Quick sort", author: "@mira", category: "Algorithms", level: "Intermediate", uses: 1420, hue: 100, description: "In-place quick sort with a readable partition step.", code: 'local function qsort(t, lo, hi)\n    -- partition and recurse\nend\nprint("sorted: 1 2 3 4 5")' },
  { title: "State machine", author: "@orbit", category: "Patterns", level: "Intermediate", uses: 1180, hue: 350, description: "Define states and transitions declaratively.", code: 'local FSM = { state = "idle" }\nprint("state: idle")\nreturn FSM' },
] as Omit<Template, "id">[]).map(t);
