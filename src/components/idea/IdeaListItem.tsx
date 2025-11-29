import { memo } from "react";
import type { Idea } from "../../types";
import { formatDate } from "../../lib/formatDate";

type IdeaListItemProps = {
  idea: Idea;
};

function IdeaListItem({ idea }: IdeaListItemProps) {
  return (
    <div className="flex-1 rounded-xl border border-slate-800/90 bg-slate-900/80 px-3.5 py-2.5 text-sm shadow-sm transition hover:border-emerald-500/60 hover:bg-slate-900">
      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-100">
        {idea.content}
      </p>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex flex-col">
          <span>{formatDate(idea.created_at)}</span>
          <span className="mt-0.5 text-[10px] text-slate-500">
            by {idea.author_name || "匿名使用者"}
          </span>
        </div>
        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
          Idea #{idea.id}
        </span>
      </div>
    </div>
  );
}

export default memo(IdeaListItem);
