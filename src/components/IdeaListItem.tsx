import { memo } from "react";
import type { Idea } from "../types";
import { formatDate } from "../lib/formatDate";

type IdeaListItemProps = {
  idea: Idea;
  ideas: Idea[];
  index: number;
};

function IdeaListItem({ idea, index, ideas }: IdeaListItemProps) {
  return (
    <div key={idea.id} className="flex gap-3">
      {/* timeline dot */}
      <div className="flex flex-col items-center">
        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
        {index !== ideas.length - 1 && (
          <div className="mt-1 h-full w-px grow bg-linear-to-b from-emerald-500/60 via-slate-700/60 to-slate-800/0" />
        )}
      </div>

      <div className="flex-1 rounded-xl border border-slate-800/90 bg-slate-900/80 px-3.5 py-2.5 text-sm shadow-sm transition hover:border-emerald-500/60 hover:bg-slate-900">
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-100">
          {idea.content}
        </p>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>{formatDate(idea.created_at)}</span>
          <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
            Idea #{idea.id}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(IdeaListItem);
