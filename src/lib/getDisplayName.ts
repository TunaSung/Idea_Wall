import { useAuth } from "../contexts/AuthContext";

export function getDisplayName(user: ReturnType<typeof useAuth>["user"]) {
  if (!user) return "";
  const meta = user.user_metadata as { display_name?: string } | undefined;
  return meta?.display_name || user.email || "未命名使用者";
}