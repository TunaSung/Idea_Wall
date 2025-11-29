import { type FormEvent } from "react";
import { Sparkles } from "lucide-react";

type IdeaFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
};

function IdeaForm({
  value,
  onChange,
  onSubmit,
  submitting,
  error,
}: IdeaFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const disabled = submitting || !value.trim();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              新增想法
            </h2>
          </div>
          <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-300">
            Ctrl + Enter 送出
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="min-h-[120px] w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-50 shadow-inner outline-none transition focus:border-emerald-400/80 focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="寫下你的技術實驗、流程優化或產品構想⋯⋯"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={submitting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between gap-3">
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex flex-1 items-center justify-end gap-2">
              <span className="hidden text-[11px] text-slate-400 sm:inline">
                送出後會即時出現在右側清單最上方
              </span>
              <button
                type="submit"
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-900 shadow-md shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border border-slate-900/40 border-t-slate-900" />
                    送出中…
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>送出想法</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-1 text-[11px] text-slate-400">
          可以簡單寫，也可以先列出幾個 bulletpoint，
          之後再挑出值得做成專案的主題。
        </div>
      </div>
    </section>
  );
}

export default IdeaForm;
