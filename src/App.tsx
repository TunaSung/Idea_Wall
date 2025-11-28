import "./App.css"
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import type { Idea } from "./types";
import { AppShell } from "./components/layout/AppShell";
import { IdeaHeader } from "./components/idea/IdeaHeader";
import { IdeaStats } from "./components/idea/IdeaStats";
import { IdeaForm } from "./components/idea/IdeaForm";
import { IdeaToolbar, type IdeaFilter } from "./components/idea/IdeaToolbar";
import { IdeaList } from "./components/idea/IdeaList";

function App() {
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

  // 送出新想法
  const handleSubmitIdea = async () => {
    const trimmed = newIdea.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    const { data, error } = await supabase
      .from("ideas")
      .insert({ content: trimmed })
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
    <AppShell>
      <IdeaHeader />

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
    </AppShell>
  );
}

export default App;
