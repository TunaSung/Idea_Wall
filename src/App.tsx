import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import type { Idea } from "./types";
import IdeaHeader from "./components/idea/IdeaHeader";
import IdeaStats from "./components/idea/IdeaStats";
import IdeaForm from "./components/idea/IdeaForm";
import IdeaToolbar, { type IdeaFilter } from "./components/idea/IdeaToolbar";
import IdeaList from "./components/idea/IdeaList";
import AuthPanel from "./components/auth/AuthPanel";
import { useAuth } from "./contexts/AuthContext";
import { getDisplayName } from "./lib/getDisplayName";

function App() {
  const { user } = useAuth();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newIdea, setNewIdea] = useState("");
  const [filter, setFilter] = useState<IdeaFilter>("all");
  const [search, setSearch] = useState("");

  // 讀取想法清單
  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("載入想法失敗，請稍後再試");
      } else {
        setIdeas(data ?? []);
      }

      setLoading(false);
    };

    fetchIdeas();
  }, []);

  // 讓所有人可以同時看到
  useEffect(() => {
    const channel = supabase
      .channel("ideas-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ideas",
        },
        (payload) => {
          const newIdea = payload.new as Idea;
          setIdeas((prev) => {
            // 避免重複插入：如果已經存在就略過
            if (prev.some((i) => i.id === newIdea.id)) return prev;
            return [newIdea, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 送出新想法
  const handleSubmitIdea = async () => {
    const trimmed = newIdea.trim();
    if (!trimmed) return;

    if (!user) {
      setError("請先登入再送出想法。");
      return;
    }

    const displayName = getDisplayName(user);

    setSubmitting(true);
    setError(null);

    const { data, error } = await supabase
      .from("ideas")
      .insert({
        content: trimmed,
        user_id: user.id,
        author_name: displayName,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      setError("送出失敗，請稍後再試");
    } else if (data) {
      setIdeas((prev) => [data as Idea, ...prev]);
      setNewIdea("");
    }

    setSubmitting(false);
  };

  // 篩選 + 搜尋
  const filteredIdeas = ideas.filter((idea) => {
    const created = new Date(idea.created_at);
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 6);

    let ok = true;

    if (filter === "today") {
      ok = created >= startOfToday;
    } else if (filter === "week") {
      ok = created >= sevenDaysAgo;
    }

    if (!ok) return false;

    if (search.trim()) {
      const keyword = search.toLowerCase();
      if (!idea.content.toLowerCase().includes(keyword)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 lg:py-10">
        <IdeaHeader />

        {/* 登入/註冊區 */}
        <div className="mt-4">
          <AuthPanel />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.95fr)]">
          {/* 左側：統計 + 表單 */}
          <div className="space-y-6">
            <IdeaStats ideas={ideas} loading={loading} />
            <IdeaForm
              value={newIdea}
              onChange={setNewIdea}
              onSubmit={handleSubmitIdea}
              submitting={submitting}
              error={error}
              canSubmit={!!user}
            />
          </div>

          {/* 右側：工具列 + 清單 */}
          <div className="space-y-4">
            <IdeaToolbar
              filter={filter}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
              totalCount={ideas.length}
              visibleCount={filteredIdeas.length}
            />
            <IdeaList
              ideas={filteredIdeas}
              loading={loading}
              activeFilter={filter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
