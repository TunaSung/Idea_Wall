import { memo } from "react";
import { Lightbulb } from "lucide-react";

function IdeaHeader() {

  return (
    <header className="space-y-4">
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
      </div>
    </header>
  );
}

export default memo(IdeaHeader)
