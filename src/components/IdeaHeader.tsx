import { Lightbulb, Sparkles } from "lucide-react";
import { memo } from "react";

function IdeaHeader() {
  return (
    <header className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
        INTERNAL · IDEA WALL
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-amber-300" />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              創意想法牆
            </h1>
          </div>
          <p className="max-w-xl text-sm text-slate-300">
            把靈感、技術實驗與流程優化的念頭集中在同一個地方，
            <br className="hidden sm:block" />
            讓好點子不再淹沒在 chat 訊息裡。
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 shadow-sm">
          <Sparkles className="h-4 w-4 text-emerald-300" />
          <div className="flex flex-col leading-snug">
            <span className="font-medium text-slate-100">
              AI-assisted coding ready
            </span>
            <span className="text-[11px] text-slate-400">
              React · Supabase · Tailwind · GitHub
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(IdeaHeader);
