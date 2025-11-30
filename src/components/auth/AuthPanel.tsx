import { useState } from "react";
import { LogIn, LogOut, UserPlus, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getDisplayName } from "../../lib/getDisplayName";

function AuthPanel() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
      setEmail("");
      setPassword("");
      // displayName 保留就好，之後註冊其他帳號可以重用
    } catch (err: any) {
      setError(err.message ?? "操作失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 shadow-sm">
        載入使用者狀態中⋯
      </div>
    );
  }

  if (user) {
    const name = getDisplayName(user);
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-100 shadow-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-emerald-300" />
          <div className="flex flex-col leading-snug">
            <span className="font-medium text-emerald-100">
              歡迎，{name}
            </span>
            <span className="text-[11px] text-emerald-200/80">
              開始留下您的想法吧！
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-100 hover:bg-emerald-500/20"
        >
          <LogOut className="h-3 w-3" />
          登出
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-xs text-slate-200 shadow-lg">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {mode === "signin" ? (
            <LogIn className="h-4 w-4 text-emerald-300" />
          ) : (
            <UserPlus className="h-4 w-4 text-emerald-300" />
          )}
          <span className="font-semibold">
            {mode === "signin" ? "登入留下您的想法!" : "建立帳號後開始想法發散吧!"}
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            setMode((m) => (m === "signin" ? "signup" : "signin"))
          }
          className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-700"
        >
          {mode === "signin" ? "我要註冊" : "已有帳號？登入"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <label className="block text-[11px] text-slate-300">
              顯示名稱
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="你的名稱"
              required
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-[11px] text-slate-300">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] text-slate-300">
            密碼
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-50 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少 6 碼"
            required
          />
        </div>

        {error && <p className="text-[11px] text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-slate-900 shadow-md shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border border-slate-900/30 border-t-slate-900" />
              處理中…
            </>
          ) : mode === "signin" ? (
            <>
              <LogIn className="h-3 w-3" />
              登入
            </>
          ) : (
            <>
              <UserPlus className="h-3 w-3" />
              註冊
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AuthPanel;
