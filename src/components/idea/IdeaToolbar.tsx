import { Search, Filter } from "lucide-react";

export type IdeaFilter = "all" | "today" | "week";

type IdeaToolbarProps = {
  filter: IdeaFilter;
  onFilterChange: (filter: IdeaFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  visibleCount: number;
};

const filters: { key: IdeaFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "today", label: "今天" },
  { key: "week", label: "近 7 天" },
];

export function IdeaToolbar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  totalCount,
  visibleCount,
}: IdeaToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <Filter className="h-4 w-4 text-emerald-300" />
        <span className="font-medium">想法總覽</span>
        <span className="hidden text-[11px] text-slate-400 sm:inline">
          {visibleCount === totalCount
            ? `共 ${totalCount} 則想法`
            : `顯示 ${visibleCount} / ${totalCount} 則`}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        {/* Filter pills */}
        <div className="inline-flex rounded-full border border-slate-700/80 bg-slate-950/70 p-0.5 text-[11px] text-slate-300">
          {filters.map((item) => {
            const active = item.key === filter;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onFilterChange(item.key)}
                className={[
                  "rounded-full px-2.5 py-1 transition",
                  active
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            className="w-full rounded-full border border-slate-700/80 bg-slate-950/80 pl-8 pr-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/80 focus:ring-2 focus:ring-emerald-500/40"
            placeholder="搜尋想法內容關鍵字⋯"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default IdeaToolbar;
