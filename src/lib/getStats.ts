import type { Idea } from "../types";

export function getStats(ideas: Idea[]) {
  const total = ideas.length;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(startOfToday.getDate() - 6);

  let todayCount = 0;
  let weekCount = 0;
  let firstCreatedAt: Date | null = null;

  for (const idea of ideas) {
    const created = new Date(idea.created_at);
    if (created >= startOfToday) todayCount++;
    if (created >= sevenDaysAgo) weekCount++;

    if (!firstCreatedAt || created < firstCreatedAt) {
      firstCreatedAt = created;
    }
  }

  return {
    total,
    todayCount,
    weekCount,
    firstCreatedAt,
  };
}