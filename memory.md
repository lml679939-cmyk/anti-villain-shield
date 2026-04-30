# 防小人護盾 · 專案記憶檔

> 給接手的 AI：這份文件是專案完整快照，從這裡讀，不要問使用者「你要做什麼」。

---

## 專案是什麼

**防小人護盾**（Anti-Villain Emotional Shield）  
一個在遇到人際衝突、情緒快爆炸時使用的即時輔助 PWA。

核心目標：**在情緒快失控的當下，穩住情緒 → 生成有界線的禮貌回應。**

主要使用場景：**學校、職場、朋友圈的人際衝突**——難搞組員、態度差的同學、施壓主管、冷嘲熱諷的人。學校活動偶爾擺攤也用得到，但不是主軸。

> 關鍵原則：回應語氣是「有自信的個人溝通」，**不是客服話術**。生成的句子要像一個清醒有界線的人說的話，不是在道歉。

---

## 技術棧

| 項目 | 選擇 | 原因 |
|---|---|---|
| 架構 | 單一 `index.html` | 零建置、可離線、手機直開 |
| CSS | Tailwind CDN | 不需 build step |
| JS | Vanilla JS | 無框架依賴 |
| AI | Anthropic Claude Haiku（選填） | 使用者自備 API Key，存 localStorage |
| PWA | manifest + sw.js（待補） | 可安裝到手機主畫面 |

---

## 路徑與部署

- **開發目錄**：`C:\Users\user\Projects\anti-villain-shield\`
- **GitHub**：https://github.com/lml679939-cmyk/anti-villain-shield
- **GitHub Pages**：https://lml679939-cmyk.github.io/anti-villain-shield/
- 原始記錄路徑含中文（`個人專案_防小人神器`），git 無法在那裡初始化，**開發一律在上面那個英文路徑**

---

## 檔案結構

```
anti-villain-shield/
├── index.html              ← 全部功能在這一支
├── .gitignore
├── memory.md               ← 本文件
├── manifest.webmanifest    ← 待建（PWA 安裝用）
└── sw.js                   ← 待建（離線快取用）
```

---

## 畫面與路由

路由：純 DOM `display` 切換，無 hash routing。`screens` 陣列：

```js
['shield', 'cool', 'breathe', 'translator', 'settings']
```

所有 `[data-go="x"]` 按鈕共用 `go(name)` 函數，切換時 vibrate 8ms。

### 畫面 1：主盾牌頁 `screen-shield`
- 大圓形按鈕「我現在很躁」→ 進降溫模塊（`screen-cool`）
- 副按鈕「直接翻譯氣話」→ 進禮貌化回應生成器（`screen-translator`）
- 左上角標題：**防小人護盾**（不是 SHIELD · 護盾）
- 右上角齒輪進設定

### 畫面 2：降溫模塊 `screen-cool`
情緒溫度計 → 技巧卡 → 暫停計時器，分兩個 Step 區塊：

**Step A：情緒溫度計**
- 1–10 共 10 顆按鈕（1–3 綠、4–6 橙、7–10 紅）
- 選完後顯示 Step B，頁面自動 scroll

**Step B：技巧 + 計時器**
- 依燙度顯示 3–5 張技巧卡（可展開/收合，第一張預設展開）
- 技巧清單：

| key | 名稱 | 燙度適用 |
|---|---|---|
| `breathe` | 4-7-8 呼吸 | 高（8+） |
| `fist` | 握拳釋放 | 中高（5+） |
| `grayrock` | 灰岩法 | 全部 |
| `reframe_high` | 認知重構（高溫版） | 高（8+） |
| `reframe_mid` | 認知重構（中溫版） | 中（5-7） |
| `reframe_low` | 認知重構（低溫版） | 低（1-4） |
| `ground` | 感官接地 | 高（8+） |

- 計時器：選 60/90/120/180 秒，SVG 圓弧倒數，結束 vibrate `[100,80,100,80,200]`

### 畫面 3：呼吸頁 `screen-breathe`
- 4-7-8 呼吸圓形脈動動畫（CSS `@keyframes breathe`，19 秒一循環）
- 文字「吸/停/吐」用 setTimeout 輪播（4000/7000/8000ms）
- 按鈕：「我冷靜了，下一步」→ `translator`
- 按鈕：「← 回到燙度評估」→ `cool`

### 畫面 4：禮貌化回應生成器 `screen-translator`
- 6 個快速情境 chip（點即生成，不需打字）：

| chip | `data-scenario` |
|---|---|
| 鍋甩給我 | `blame_shift` |
| 態度差/酸 | `attitude` |
| 工作分配不公 | `unfair_load` |
| 主管施壓 | `supervisor_pressure` |
| 冷嘲熱諷 | `passive_aggressive` |
| 同件事一直盧 | `repeat_nag` |

- 自由輸入 textarea + 語音輸入（Web Speech API）
- 「生成 3 種回應」按鈕：關鍵字偵測情境 → 套模板
- 輸出 3 張回應卡，各有獨立複製按鈕：

| 卡片 | 元素 ID | 顏色 | 說明 |
|---|---|---|---|
| 安全中性 | `resp-gray` | 綠框 | 灰岩法，最短最無聊 |
| 禮貌堅定 | `resp-firm` | 藍框 | I statement，有禮有節 |
| 設定界線 | `resp-boundary` | 橙框 | 適合重複發生時 |

- 底部「✦ AI 真實生成」按鈕：有 API Key 才啟用，呼叫 Claude Haiku 即時生成

> **注意：萬用話術已移除**（舊版有 `screen-scripts`，現在沒了）

### 畫面 5：設定 `screen-settings`
三個功能區塊 + API Key 輸入：

1. **背景顏色**（6 個色塊）：純黑/深灰/深藍/暖棕/淺色/純白，透過 CSS 自定義屬性 `--u-bg` 等即時切換
2. **字體大小**（4 個按鈕）：14/16/18/21px，改 `html` 的 `font-size`
3. **字型**（3 個按鈕）：標準（system-ui）/ 圓體（Hiragino Maru Gothic）/ 等寬
4. **API Key 欄位**：輸入 `sk-ant-...` → 存 `localStorage('shield_api_key')` → 啟用 AI 按鈕

所有設定持久化存 `localStorage('shield_settings')`，重開自動還原。

---

## SITUATION_DB 結構

```js
// 每個情境有 keywords（RegExp）+ 三種回應
SITUATION_DB = {
  blame_shift:           { keywords, gray, firm, boundary },
  attitude:              { keywords, gray, firm, boundary },
  unfair_load:           { keywords, gray, firm, boundary },
  supervisor_pressure:   { keywords, gray, firm, boundary },
  passive_aggressive:    { keywords, gray, firm, boundary },
  repeat_nag:            { keywords, gray, firm, boundary },
}
// 兜底
FALLBACK = { gray, firm, boundary }
```

---

## AI 真實生成（Claude Haiku）

```
model: claude-haiku-4-5-20251001
endpoint: https://api.anthropic.com/v1/messages
需要 header: anthropic-dangerous-direct-browser-access: true
API Key 存放: localStorage.getItem('shield_api_key')
Prompt: 描述情況 → 輸出 3 行（安全中性 / 禮貌堅定 / 設定界線），用換行分隔
```

---

## CSS 主題系統

`<style id="user-theme">` 中定義 CSS 自定義屬性：

```css
:root {
  --u-bg: #0a0a0a;   --u-panel: #141414;
  --u-edge: #1f1f1f; --u-text: #f5f5f5; --u-muted: #525252;
}
```

Tailwind 的 `.bg-panel`、`.bg-edge`、`.border-edge`、`.text-neutral-100/200/500/600` 全部用 `!important` 覆蓋。JS 透過 `root.style.setProperty('--u-bg', ...)` 切換。

---

## 待完成

### 下一步（高優先）
- [ ] `manifest.webmanifest`（app 名稱、icon、standalone mode）
- [ ] `sw.js`（cache-first 快取 index.html，讓 App 可離線）
- [ ] 兩張 icon：192×192、512×512（`.png`）

### 中優先
- [ ] 呼吸計時文字可能和動畫微微飄移（setTimeout 累積誤差），考慮用 `animationiteration` 事件同步
- [ ] SITUATION_DB 關鍵字擴充（目前只有每組約 8–10 個關鍵字）

### 低優先 / 暫不動
- [ ] 自訂情境（使用者自己新增 SITUATION_DB 條目，存 localStorage）
- [ ] 雲端同步、使用記錄統計

---

## 設計原則（接手請遵守）

1. **離線優先**：規則版功能不依賴網路，API 功能是選配
2. **速度第一**：三秒內可操作，不加多餘過場動畫
3. **大按鈕**：touch target 至少 48px
4. **個人溝通語氣**：輸出要像一個有自信的人說的話，不是客服在道歉
5. **意圖偵測不是字面清洗**：翻譯引擎一定要「偵測情境 → 輸出模板」，絕對不要把氣話刪刪補補後輸出

---

## 使用者資訊

- 身份：學生，主要應對學校與職場人際衝突（同學、組員、主管）
- 主要裝置：Android 手機（Chrome）
- 技術偏好：vibe coding，先求能用，不過度設計
- 協作風格：直接說要改什麼，快速迭代，不需要解釋太多背景
