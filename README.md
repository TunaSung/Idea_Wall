# 創意想法牆 (Idea Wall)

一個使用 **React (Vite)**、**Supabase** 與 **Tailwind CSS** 建置的單頁應用程式。  
讓團隊成員可以隨時提交技術創新、流程優化或產品構想的「金點子」，並即時出現在「想法牆」上。

此專案亦刻意以 **AI 輔助程式設計工具 (ChatGPT 等)** 為開發流程的一部分，並在下方紀錄實際使用的關鍵提示詞與思路。

---

## 功能介紹 (Features)

- 🔄 **創意想法牆**
  - 由 Supabase 讀取 `ideas` 資料表內容，依建立時間新到舊排序。
  - 以時間軸 (timeline) + 卡片 (card) 的方式呈現每則想法。

- 📝 **提交新想法**
  - 左側表單輸入想法內容後送出，會：
    - 將資料寫入 Supabase `ideas` 資料表。
    - 成功後 **立即插入清單最上方**，無須重新整理或重新抓取全部資料。
  - 支援 `Ctrl / ⌘ + Enter` 快捷鍵送出。

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

- **Framework**：React 18 + Vite
- **Language**：TypeScript
- **Styling**：Tailwind CSS
- **Backend / DB**：Supabase (PostgreSQL + `@supabase/supabase-js`)
- **Icons / UI 補充**：`lucide-react`
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
│  ├─ types.ts              # Idea 型別定義
│  ├─ lib/
│  │  └─ supabaseClient.ts  # 建立 Supabase client
│  └─ components/
│     ├─ layout/
│     │  └─ AppShell.tsx    # 頁面外框 / 佈局容器
│     └─ idea/
│        ├─ IdeaHeader.tsx  # 頁面上方標題 & 說明區
│        ├─ IdeaStats.tsx   # 左側統計卡片
│        ├─ IdeaForm.tsx    # 新增想法表單
│        ├─ IdeaToolbar.tsx # 篩選、搜尋工具列
│        └─ IdeaList.tsx    # 右側時間軸清單 UI
├─ .env.local               # Supabase 相關環境變數 (不應提交到 git)
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md
```

---

## Supabase 設定

### 1. 建立專案 & 取得 API Key

1. 前往 [Supabase](https://supabase.com/) 建立免費帳號與專案。
2. 進入該專案後，於 **Project Settings → API** 取得：
   - `Project URL` → 之後會用在 `VITE_SUPABASE_URL`
   - `anon public` key → 之後會用在 `VITE_SUPABASE_ANON_KEY`

### 2. 建立 `ideas` 資料表

在 Supabase SQL Editor 執行：

```sql
create table public.ideas (
  id          bigserial primary key,
  content     text not null,
  created_at  timestamptz not null default now()
);
```

### 3. 啟用 RLS 並設定 Policy（Demo 用）

> 為了 Demo 方便，先開放匿名讀寫。實際內部工具可再改為需登入等較嚴謹設定。

在 `ideas` 資料表：

1. 啟用 Row Level Security (RLS)。
2. 新增兩個 policy，例如：

```sql
create policy "Allow anon select"
on public.ideas
for select
using (true);

create policy "Allow anon insert"
on public.ideas
for insert
with check (true);
```

---

## 環境變數設定

在專案根目錄建立 **`.env.local`**（請勿提交到 GitHub）：

```bash
VITE_SUPABASE_URL=你的_supabase_project_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_public_key
```

Vite 會透過 `import.meta.env.VITE_*` 方式讀取。

---

## 本地開發與啟動

### 1. 安裝相依套件

```bash
# 安裝專案依賴
npm install

# 也可以用 pnpm
# pnpm install
```

另外，本專案使用了 `lucide-react` 來提供 UI icon：

```bash
npm install lucide-react
# 或
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

## 主要檔案說明

### `src/lib/supabaseClient.ts`

使用環境變數建立 Supabase client：

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### `src/types.ts`

```ts
export type Idea = {
  id: number;
  content: string;
  created_at: string;
};
```

### `src/App.tsx` – 資料流與畫面組合

- 透過 `useEffect` 於首次渲染時向 Supabase 取得所有 `ideas`。
- 透過 `IdeaForm` 提交新想法，並在成功後以 `setIdeas((prev) => [data, ...prev])` 的方式插入最上方。
- 透過 `IdeaToolbar` 控制篩選條件與搜尋字串。
- 透過 `IdeaList` 呈現過濾後的想法清單。
- `IdeaStats` 則根據 `ideas` 計算累積數量、今日數與近七天數。

---

## 系統設計與資料流簡述

1. **資料來源**：  
   前端僅透過 Supabase JavaScript Client 操作 `ideas` 資料表（無自建 backend）。

2. **讀取流程**：
   - `App` 掛載（mount）時呼叫 `supabase.from("ideas").select("*").order("created_at", { ascending: false })`。
   - 將結果存入 `ideas` state。

3. **送出流程**：
   - 使用者在 `IdeaForm` 輸入文字並送出。
   - `App` 中的 `handleSubmitIdea` 呼叫 `supabase.from("ideas").insert({...}).select().single()`。
   - 若成功，將回傳的新紀錄插入 `ideas` 陣列最前面，畫面即時更新。

4. **篩選 / 搜尋流程**：
   - 在 `App` 中依照 `filter` 與 `search` 的 state 對 `ideas` 作 front-end filter。
   - 將結果傳入 `IdeaList` 顯示。

5. **UI 分層**：
   - `AppShell`：頁面外框與背景風格。
   - `IdeaHeader`：標題、說明與技術標籤。
   - `IdeaStats`：統計卡片區。
   - `IdeaForm`：新增想法表單與送出按鈕。
   - `IdeaToolbar`：篩選 + 搜尋工具列。
   - `IdeaList`：時間軸樣式的想法清單。

---

## AI 輔助日誌 (AI-Assisted Coding Log)

本專案特別將 AI 工具視為「pair programmer」，而非「自動幫我寫完作業的黑盒子」。  
以下是開發過程中最關鍵、最有幫助的 3–5 個提示詞 (Prompts) 範例：

### Prompt 1：系統與 UI 架構規劃

> 「我想用 React + Vite + Supabase + Tailwind 做一個『創意想法牆』的 MVP。  
>  功能：顯示想法清單、送出新想法、成功後即時插入清單最上方。  
>  請幫我規劃元件切分（含 AppShell / Header / Form / Stats / List 等），並說明每個元件各自負責的狀態與 props。」

**用途**：  
先讓 AI 幫忙整理合適的元件結構與資料流，而不是一開始就塞在單一 `App.tsx` 裡。

---

### Prompt 2：與 Supabase 整合的正確寫法

> 「請給我一個在 React 中使用 `@supabase/supabase-js` 讀取 `ideas` 資料表的範例，  
>  要求：依 `created_at` 由新到舊排序，並處理 loading / error 狀態。  
>  同時請提醒我環境變數在 Vite 專案中要如何命名與使用。」

**用途**：  
確認 Supabase 的呼叫方式與錯誤處理是否符合官方建議，並確保 `import.meta.env.VITE_...` 使用正確。

---

### Prompt 3：送出新想法後的 state 更新方式

> 「當我在 Supabase 插入一筆新 `idea` 後，不想重新抓全部清單。  
>  請用 TypeScript 示範：在 React 中如何根據 insert 的回傳值，  
>  直接將新紀錄插入到現有 state 陣列的最前面，並避免 mutate 原本的陣列。」

**用途**：  
讓 AI 提醒我正確使用 `setState(prev => [...])` 的 immutable 寫法，避免誤用 `prev.unshift()` 這種會直接修改原陣列的作法。

---

### Prompt 4：Plus 版 UI + 元件化設計

> 「我已經有一個基本版的想法牆，現在想升級成  
>  深色玻璃風 UI、左右兩欄 layout、上方統計卡片、右側時間軸列表，  
>  並使用 `lucide-react` 作為 icon。  
>  請幫我拆成多個元件（AppShell / IdeaHeader / IdeaStats / IdeaForm / IdeaToolbar / IdeaList），  
>  並提供 Tailwind CSS 的 className 建議。」

**用途**：  
請 AI 幫忙構思 UI 細節與 className 搭配，節省我自己慢慢試色 / 調 spacing 的時間。

---

### Prompt 5：程式碼檢視與邊界情境檢查

> 「以下是我目前的 `App.tsx` 以及與 Supabase 互動的程式碼，  
>  請幫我檢查可能的 bug 或潛在問題（例如環境變數缺失、錯誤處理不足、  
>  在網路錯誤時 UI 是否會卡住等），並提出具體改善建議。」

**用途**：  
請 AI 幫忙當第二雙眼睛，檢查我可能忽略的 edge cases，而不只是產出程式碼片段。

---

## 我如何使用 AI 協助開發

在本作業中，我刻意將 AI 當成「協作夥伴」而不是「一鍵完成工具」，實際做法包括：

1. **由我先決定需求與架構，再請 AI 補完細節**
   - 例如：我先決定資料表結構為 `ideas(id, content, created_at)`，  
     UI 採用左右兩欄（左：表單＋統計，右：清單），  
     再請 AI 針對「已定義好的架構」提供具體實作。

2. **對 AI 產出的程式碼做主動審查**
   - 檢查是否：
     - 符合 Vite + React 的最佳實踐（例如環境變數命名、`React.StrictMode` 等）。
     - 沒有直接 mutate state（確認都使用 immutable 寫法）。
     - 在 Supabase 回傳 error 時有適當的錯誤訊息與 UI 提示。
   - 不合適的地方會再自己調整（如訊息文案、loading 狀態、元件命名等）。

3. **把重複性高、查文件耗時的部分交給 AI**
   - 例如：Tailwind className 的組合、`lucide-react` icon 的挑選、  
     `flex/grid` 版面微調等，讓我可以把心力放在資料流與 UX。

4. **將 AI 輔助過程整理成 README 的一部分**
   - 將關鍵 Prompts 與思路記錄下來，  
     未來團隊內部如果也想用 AI 做類似的內部工具，可以直接參考這份做法。

透過這個流程，我可以在 **維持程式品質與可維護性** 的前提下，  
利用 AI 來 **加速查資料、產出樣板、微調 UI**，而不失去對專案主導權。

---

## 可能的延伸方向 (Future Work)

- ✅ 新增「作者」欄位（搭配簡單登入機制或輸入暱稱）。
- ✅ 新增「標籤 / 分類」欄位，支援依類別快速篩選。
- ✅ 支援「Like / Upvote」讓團隊成員能幫好點子投票。
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
#   I d e a _ W a l l  
 