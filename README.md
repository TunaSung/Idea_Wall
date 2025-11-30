# 創意想法牆 (Idea Wall)

一個使用 **React (Vite)**、**Supabase** 與 **Tailwind CSS** 建置的單頁應用程式。  
讓團隊成員可以隨時提交技術創新、流程優化或產品構想的「金點子」，並即時出現在「想法牆」上。

此專案刻意以 **AI 輔助程式設計工具 (ChatGPT 等)** 作為開發流程的一部分，  
在下方也整理了實際使用的關鍵提示詞與思路。

---

## 功能介紹 (Features)

- 🔐 **使用者登入 / 註冊**
  - 使用 Supabase Auth 的 **Email + Password** 登入機制。
  - 註冊時可以設定「顯示名稱 (`display_name`)」，會存在 `user_metadata`。
  - 登入狀態由前端 `AuthContext` 管理，頁面右上會顯示「已登入：XXX」。

- 📝 **提交新想法（綁定使用者）**
  - 只有登入後才能提交想法。
  - 每則想法會寫入：
    - `user_id`（對應 `auth.users.id`）
    - `author_name`（顯示名稱 / email）
  - 送出成功後，新的想法會 **立即插入清單最上方**，不需重整。

- 🔄 **創意想法牆**
  - 由 Supabase 讀取 `ideas` 資料表內容，依建立時間新到舊排序。
  - 以時間軸 (timeline) + 卡片 (card) 呈現每則想法。
  - 卡片會顯示：
    - 想法內容
    - 建立時間
    - 作者名稱：`by {author_name}`

- 🎛 **篩選與搜尋**
  - 篩選條件：
    - 全部 (`all`)
    - 今日 (`today`)
    - 近 7 天 (`week`)
  - 搜尋框支援依內容關鍵字篩選想法。

- 📊 **統計概況卡片**
  - 累積想法總數。
  - 近 7 天新增想法數。
  - 今日新增想法數。
  - 想法牆建立日期。

- 🎨 **Plus 版 UI**
  - 深色玻璃風 (glassmorphism) 背景。
  - 具層次感的卡片、柔和光暈與漸層。
  - 使用 `lucide-react` icon 提升視覺質感。
  - 元件化布局，方便之後擴充欄位（作者、標籤、Like 數等）。

---

## 技術棧 (Tech Stack)

- **Framework**：React 19 + Vite
- **Language**：TypeScript
- **Styling**：Tailwind CSS
- **Backend / DB**：Supabase
  - `auth.users`（內建使用者表）
  - `public.ideas`（本專案自建）
- **Auth**：Supabase Auth（Email + Password）
- **Icons / UI**：`lucide-react`
- **State Management**：React Context (`AuthContext`) + local state
- **Package Manager**：npm / pnpm (擇一)

---

## 專案結構 (Project Structure)

> 僅列出與本作業相關的主要檔案與資料夾。

```txt
.
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  ├─ types.ts                 # Idea 型別定義
│  ├─ lib/
│  │  └─ supabaseClient.ts     # 建立 Supabase client
│  ├─ contexts/
│  │  └─ AuthContext.tsx       # 管理登入狀態與 Auth 操作
│  ├─ components/
│  │  ├─ auth/
│  │  │  └─ AuthPanel.tsx      # 登入 / 註冊 / 登出 UI
│  │  └─ idea/
│  │     ├─ IdeaHeader.tsx     # 頁面上方標題 & 歡迎詞（含使用者名稱）
│  │     ├─ IdeaStats.tsx      # 左側統計卡片
│  │     ├─ IdeaForm.tsx       # 新增想法表單（未登入時鎖住）
│  │     ├─ IdeaToolbar.tsx    # 篩選、搜尋工具列
│  │     └─ IdeaList.tsx       # 右側時間軸清單 UI（顯示作者名稱）
├─ .env                        # Supabase 相關環境變數 (不應提交到 git)
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md
```

---

## Supabase 設定

### 1. 建立專案 & 啟用 Email 登入

1. 前往 [Supabase](https://supabase.com/) 建立免費帳號與專案。
2. 在左側選單進入 **Authentication → Providers → Email**：
   - 啟用 Email / Password 登入。
   - 需要的話可自行設定密碼規則與「Leaked password protection」。

### 2. 取得 API Key

在 **Project Settings → API** 取得：

- `Project URL` → 之後會用在 `VITE_SUPABASE_URL`
- `anon public` key → 之後會用在 `VITE_SUPABASE_ANON_KEY`

### 3. 建立 `ideas` 資料表

在 Supabase SQL Editor 執行：

```sql
create table public.ideas (
  id           bigserial primary key,
  content      text        not null,
  created_at   timestamptz not null default now(),
  user_id      uuid references auth.users(id),  -- 綁定登入使用者
  author_name  text                            -- 前端決定要顯示的名稱
);
```

### 4. 啟用 RLS 並設定 Policy

在 `ideas` 資料表：

1. 啟用 Row Level Security (RLS)。
2. 新增 / 更新兩個 policy，例如：

```sql
-- 讀取：所有人都可以看到牆上的想法（包含未登入）
create policy "Allow public read ideas"
on public.ideas
for select
using (true);

-- 寫入：必須是登入的使用者，且 user_id 必須是自己的 uid
create policy "Allow logged-in insert ideas"
on public.ideas
for insert
to authenticated
with check (auth.uid() = user_id);
```

> GUI 上可以選 `INSERT` + `authenticated`，再把 `with check (true)` 改成  
> `with check (auth.uid() = user_id)`。

---

## 使用者資料與 `auth.users`

Supabase 內建一套 Auth 系統，使用者會被存在：

- **Schema**：`auth`
- **Table**：`users`

本專案在 `ideas.user_id` 上使用：

```sql
user_id uuid references auth.users(id)
```

代表每則想法都可以對應到一個 `auth.users` 行。  
註冊時，我會把顯示名稱寫入 `user_metadata.display_name`，  
並在前端將其同步到 `ideas.author_name`，避免之後修改暱稱時影響歷史紀錄。

查看現有使用者可以在 SQL Editor 下：

```sql
select id, email, raw_user_meta_data
from auth.users
limit 10;
```

如需額外的 Profile，可以再額外建立 `public.profiles` 表，用 `id uuid primary key references auth.users(id)` 關聯。

---

## 環境變數設定

在專案根目錄建立 **`.env.local`**（請勿提交到 GitHub）：

```bash
VITE_SUPABASE_URL=你的_supabase_project_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_public_key
```

Vite 會透過 `import.meta.env.VITE_*` 方式讀取這些變數。

---

## 本地開發與啟動

### 1. 安裝相依套件

```bash
# 安裝專案依賴
npm install

# 安裝 icon 套件
npm install lucide-react

# （可選）使用 pnpm
# pnpm install
# pnpm add lucide-react
```

### 2. 啟動開發伺服器

```bash
npm run dev
# 或 pnpm dev
```

預設會在 `http://localhost:5173`（依 Vite 設定而定）啟動。

### 3. 建置 Production 版本

```bash
npm run build
npm run preview  # 可在本地預覽 build 後結果
```

---

## 主要程式設計重點

### 1. `supabaseClient.ts`

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. 型別定義 `types.ts`

```ts
export type Idea = {
  id: number;
  content: string;
  created_at: string;
  user_id: string | null;
  author_name: string | null;
};
```

### 3. AuthContext：管理登入狀態

`AuthContext` 負責：

- 在 app 啟動時取得目前 session。
- 提供 `signIn / signUp / signOut` 方法。
- 把 `user` 與 `loading` 狀態傳給整個 App。

`App`、`IdeaForm`、`AuthPanel` 等元件都透過 `useAuth()` 取得目前 user。

### 4. 寫入想法時綁定使用者

在 `App.tsx` 中，送出新想法的流程大致如下：

```ts
const { user } = useAuth();

const handleSubmitIdea = async () => {
  if (!user) {
    setError("請先登入再送出想法。");
    return;
  }

  const trimmed = newIdea.trim();
  if (!trimmed) return;

  const displayName = getDisplayNameFromUser(user); // 從 user_metadata 取 display_name

  const { data, error } = await supabase
    .from("ideas")
    .insert({
      content: trimmed,
      user_id: user.id,
      author_name: displayName,
    })
    .select()
    .single();

  if (!error && data) {
    setIdeas((prev) => [data as Idea, ...prev]);
    setNewIdea("");
  }
};
```

---

## 系統設計與資料流簡述

1. **使用者登入 / 註冊**
   - 使用者透過 `AuthPanel` 輸入 Email + Password（註冊時還有 Display Name）。
   - `AuthContext` 呼叫 `supabase.auth.signInWithPassword` 或 `signUp`。
   - 登入成功後，`user` 狀態更新，頁面顯示使用者名稱。

2. **讀取想法清單**
   - `App` 掛載時呼叫：
     ```ts
     supabase.from("ideas").select("*").order("created_at", { ascending: false });
     ```
   - 將結果存入 `ideas` state，並傳給 `IdeaStats` / `IdeaList` 等元件使用。

3. **送出新想法**
   - 僅在 `user` 存在時允許送出（`IdeaForm` 的按鈕會鎖住未登入狀態）。
   - 寫入 `content`、`user_id`、`author_name`。
   - 成功後使用 `setIdeas(prev => [data, ...prev])` 將新紀錄插入清單最上方。

4. **篩選 / 搜尋**
   - 在 `App` 中依照 `filter` 與 `search` 的 state 對 `ideas` 作前端篩選。
   - 將結果傳入 `IdeaList` 顯示。

5. **UI 分層**
   - `AuthPanel`：登入 / 註冊 / 顯示當前使用者。
   - `IdeaHeader`：標題。
   - `IdeaForm`：新增想法表單（未登入時顯示「請先登入」）。
   - `IdeaStats`：整體 / 近七天 / 今日統計。
   - `IdeaToolbar`：篩選與搜尋。
   - `IdeaList`：時間軸樣式的想法卡片，顯示作者名稱。

---

## AI 輔助日誌 (AI-Assisted Coding Log)

本專案特別將 AI 工具視為「pair programmer」，而非「自動幫我寫完作業的黑盒子」。  
以下是開發過程中最關鍵、最有幫助的幾個提示詞 (Prompts) 範例：

### Prompt 1：系統與 UI 架構規劃

> 「我想用 React + Vite + Supabase + Tailwind 做一個『創意想法牆』的 MVP。  
> 功能：顯示想法清單、送出新想法、成功後即時插入清單最上方。  
> 幫我規劃元件切分。」

### Prompt 2：與 Supabase 整合的正確寫法

> 「給我一個在 React 中使用 `@supabase/supabase-js` 讀取 `ideas` 資料表的範例，  
> 要求：依 `created_at` 由新到舊排序，並處理 loading / error 狀態。  
> 同時提醒我環境變數在 Vite 專案中要如何命名與使用。」

### Prompt 3：UI + 元件化設計

> 「深色玻璃風 UI、左右兩欄 layout、上方統計卡片、右側時間軸列表，  
> 可以使用外部的 UI 套件。  
> 幫我拆成多個元件（IdeaHeader / IdeaStats / IdeaForm / IdeaToolbar / IdeaList）。」

### Prompt 4：整合 Supabase Auth 並在 UI 顯示作者名稱

> 「在現有的 Idea Wall 中加入 Supabase Auth（Email + Password），  
> 要求：  
> 1. 未登入時不能送出想法，表單要顯示提示。  
> 2. 註冊時可以設定 display_name，存在 `user_metadata`。  
> 3. 寫入想法時，把 `user_id` 和 `author_name` 一起寫進 `ideas` 表，  
> 4. 在清單卡片上顯示 `by {author_name}`。  
> 同時提供 RLS policy 設定與 React 程式碼範例。」

---

## 我如何使用 AI 協助開發

在本作業中，我刻意將 AI 當成「協作夥伴」而不是「一鍵完成工具」，實際做法包括：

1. **由我先決定需求與架構，再請 AI 補完細節**
   - 例如：先決定資料表結構 `ideas(id, content, created_at, user_id, author_name)`，  
     UI 採用左右兩欄（左：表單＋統計，右：清單），  
     再請 AI 針對「已定義好的架構」提供具體實作。

2. **對 AI 產出的程式碼做主動審查**
   - 檢查是否：
     - 符合 Vite + React 的最佳實踐（環境變數命名、StrictMode 等）。
     - 沒有直接 mutate state（使用 immutable 寫法更新陣列）。
     - 在 Supabase 回傳 error 時提供適當的錯誤訊息與 UI 提示。
     - RLS policy 是否真的把 `user_id` 綁到 `auth.uid()`。

3. **把重複性高、查文件耗時的部分交給 AI**
   - 例如：Tailwind className 組合、`lucide-react` icon 選擇、  
     layout 細節、AuthContext boilerplate 等。

4. **將 AI 輔助過程整理成 README 的一部分**
   - 將關鍵 Prompts 與思路記錄下來，  
     未來團隊內部如果想用 AI 做類似的內部工具，可以直接參考這套流程。

透過這樣的方式，我可以在 **維持程式品質與可維護性** 的前提下，  
利用 AI 來 **加速查資料、產出樣板、微調 UI**，而不失去對專案的主導權。

---

## 可能的延伸方向 (Future Work)

- ✅ 新增 `profiles` 表，管理更完整的使用者資訊（職稱、部門、頭像等）。
- ✅ 新增「標籤 / 分類」欄位，支援依類別快速篩選。
- ✅ 支援「Like / Upvote」讓團隊成員為好點子投票。
- ✅ 統計面板增加「最受歡迎的 3 個點子」等資訊。
- ✅ 將此想法牆嵌入公司內部 portal 或與 Slack Bot / ChatBot 整合。

---

## Git 與隱私注意事項

- 請確認 `.gitignore` 中已忽略：
  - `node_modules`
  - `dist`
  - `.env`
  - `.env.local`
  - `.env.*`
- **不要** 將 Supabase 的 `anon` key 或其他敏感資訊推上公開 GitHub。

---

## License

本專案可依實際需求選擇 License（如 MIT）。  
若僅作為面試或團隊內部練習，也可以暫不標註正式 License。
