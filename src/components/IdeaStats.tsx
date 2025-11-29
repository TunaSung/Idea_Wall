import { Flame, Clock3, ListChecks } from "lucide-react";
import type { Idea } from "../types";
import { getStats } from "../lib/getStats";

type IdeaStatsProps = {
  ideas: Idea[];
  loading: boolean;
};

function IdeaStats({ ideas, loading }: IdeaStatsProps) {
  const { total, todayCount, weekCount, firstCreatedAt } = getStats(ideas);

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
          活躍概況
        </p>
        {firstCreatedAt && (
          <p className="text-[11px] text-slate-400">
            牆建立於 {firstCreatedAt.toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
        <div className="relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2.5">
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <ListChecks className="h-4 w-4 text-emerald-300" />
              <span className="text-[11px] font-medium text-slate-300">
                累積想法
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-50 sm:text-xl">
              {loading ? "…" : total}
            </p>
            <p className="text-[11px] text-slate-400">整體牆面的總數</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2.5">
          <div className="pointer-events-none absolute -left-6 -top-6 h-16 w-16 rounded-full bg-cyan-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-cyan-300" />
              <span className="text-[11px] font-medium text-slate-300">
                近 7 天
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-50 sm:text-xl">
              {loading ? "…" : weekCount}
            </p>
            <p className="text-[11px] text-slate-400">最近一週新增的點子</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2.5">
          <div className="pointer-events-none absolute -right-4 bottom-0 h-14 w-14 rounded-full bg-amber-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-300" />
              <span className="text-[11px] font-medium text-slate-300">
                今日動態
              </span>
            </div>
            <p className="text-lg font-semibold text-slate-50 sm:text-xl">
              {loading ? "…" : todayCount}
            </p>
            <p className="text-[11px] text-slate-400">今天新增的靈感數量</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IdeaStats;
