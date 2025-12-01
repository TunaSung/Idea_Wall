import { memo } from "react";
import { Flame, Clock3, ListChecks } from "lucide-react";
import type { Idea } from "../../types";
import { getStats } from "../../lib/getStats";

type IdeaStatsProps = {
  ideas: Idea[];
  loading: boolean;
};


function IdeaStats({ ideas, loading }: IdeaStatsProps) {
  const { total, todayCount, weekCount } = getStats(ideas);

  const STATS = [
    { icon: <ListChecks className="h-4 w-4 text-emerald-300" />, title: "累積想法", total: loading ? "…" : total, subtitle: "整體牆面的總數" },
    { icon: <Clock3 className="h-4 w-4 text-cyan-300" />, title: "近 7 天", total: loading ? "…" : weekCount, subtitle: "最近一週的點子" },
    { icon: <Flame className="h-4 w-4 text-amber-300" />, title: "今日動態", total: loading ? "…" : todayCount, subtitle: "今天新增的靈感數量" },
  ]

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
          活躍概況
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
        {STATS.map(stat => (
          <div className="relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2.5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="relative flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                {stat.icon}
                <span className="text-[11px] font-medium text-slate-300">
                  {stat.title}
                </span>
              </div>
              <p className="text-lg font-semibold text-slate-50 sm:text-xl">
                {stat.total}
              </p>
              <p className="text-[11px] text-slate-400">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(IdeaStats);
