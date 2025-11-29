import type { Idea } from "../types";
import type { IdeaFilter } from "./IdeaToolbar";
import IdeaListItem from "./IdeaListItem";

type IdeaListProps = {
  ideas: Idea[];
  loading: boolean;
  activeFilter: IdeaFilter;
};

function IdeaList({ ideas, loading, activeFilter }: IdeaListProps) {
  return (
    <section className="flex min-h-[260px] flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-baseline gap-2">
          <p className="font-semibold uppercase tracking-[0.18em] text-slate-300">
            想法清單
          </p>
          {activeFilter !== "all" && (
            <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
              {activeFilter === "today" ? "僅顯示今天" : "僅顯示近 7 天"}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden pt-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-slate-950 to-transparent" />

        {loading ? (
          <div className="flex h-full flex-col justify-start space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-slate-700" />
                <div className="flex-1 space-y-2 rounded-xl bg-slate-900/80 p-3">
                  <div className="h-3 w-3/4 rounded bg-slate-700/80" />
                  <div className="h-3 w-1/2 rounded bg-slate-800/80" />
                </div>
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-400">
            <p>目前沒有符合條件的想法。</p>
            <p className="text-xs text-slate-500">
              可以調整篩選條件或清除搜尋關鍵字看看。
            </p>
          </div>
        ) : (
          <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1.5 pt-1">
            {ideas.map((idea, index) => (
              <IdeaListItem idea={idea} ideas={ideas} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default IdeaList
