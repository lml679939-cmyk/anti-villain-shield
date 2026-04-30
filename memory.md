# 防小人護盾 · 專案記憶檔

> 給接手的 AI：這份文件是專案的完整快照。從這裡開始讀，不需要問使用者「你要做什麼」。

---

## 專案是什麼

**防小人情緒護盾**（Anti-Villain Emotional Shield）  
一個在遇到人際衝突、情緒快爆炸時使用的即時輔助 PWA。

核心目標：**在情緒快失控的當下，幫助使用者快速穩住情緒，並把腦中的氣話轉換成禮貌但有界線的回應。**

主要使用場景：**學校、職場、朋友圈的人際衝突**——對付難搞的組員、態度差的同學、施壓的主管、冷嘲熱諷的人。學校偶爾也會擺攤，會遇到公主病組員，但那只是場景之一，不是主軸。

> 重要：回應語氣是「個人溝通」，不是「客服話術」。所有生成的回應要像一個有自信的人說的話，不是服務業員工在道歉。

---

## 技術棧

| 項目 | 選擇 | 原因 |
|---|---|---|
| 架構 | 單一 `index.html` | 零建置、離線可用、手機直開 |
| CSS | Tailwind CDN | 不需 build step |
| JS | Vanilla JS | 無框架依賴，夜市不一定有網路 |
| PWA | manifest + sw.js（待補） | 可安裝到手機主畫面 |
| 翻譯引擎 | 純前端意圖偵測 | 免 API key、離線可用 |

---

## 檔案結構

```
anti-villain-shield/
├── index.html          ← 目前全部功能都在這一支
├── .gitignore
├── memory.md           ← 本文件
├── manifest.webmanifest  ← 待建（PWA 安裝用）
└── sw.js               ← 待建（離線快取用）
```

---

## 目前完成的功能（P0 MVP）

### 畫面 1：主盾牌頁 (Shield)
- 一顆大圓形「啟動護盾」按鈕
- 點擊後觸覺震動 + 跳至呼吸頁
- 副按鈕「直接翻譯氣話」

### 畫面 2：呼吸引導頁 (Breathe)
- 4-7-8 呼吸法：吸 4 秒、屏息 7 秒、吐氣 8 秒
- CSS `@keyframes` 圓形脈動動畫（19 秒一循環）
- 文字輪播「吸 → 停 → 吐」用 `setTimeout` 驅動
- 「我冷靜了，下一步」跳翻譯頁

### 畫面 3：氣話翻譯機 (Translator)
- textarea 輸入 + 語音輸入按鈕（Web Speech API，Android Chrome）
- **翻譯引擎：意圖偵測 → 模板輸出**（不是字面清洗）
- 6 種意圖情境：
  - `blame_shift`：鍋被甩給我 / 責任推卸
  - `attitude`：態度差 / 公主語氣 / 冷嘲熱諷
  - `unfair_load`：工作分配不公 / 我做比較多
  - `supervisor_pressure`：主管施壓 / 不合理要求
  - `passive_aggressive`：陰陽怪氣 / 話中有話
  - `repeat_nag`：同件事一直盧
- 每種情境 3 句輪替輸出（隨機）
- 兜底 fallback（未命中任何意圖時）
- 複製按鈕

### 畫面 4：話術庫 (Scripts)
- 8 句預設萬用回應（硬編碼）
- 點擊任一句即複製到剪貼簿 + 邊框亮起確認

### 路由
- 純 DOM `display` 切換，無 hash routing
- 所有 `[data-go="x"]` 按鈕共用同一個路由函數
- 切換時觸覺震動 8ms

---

## 未完成（排序）

### P0 剩餘
- [ ] `manifest.webmanifest`（app 名稱、icon、theme color）
- [ ] `sw.js`（最小 cache-first 策略，快取 index.html）
- [ ] 兩張 icon（192×192、512×512）

### P1
- [ ] 呼吸動畫文字節奏微調（setTimeout 可能飄移，考慮改 `animationiteration` 驅動）
- [ ] 話術庫自訂（localStorage CRUD）
- [ ] 字級切換（大 / 預設，戶外強光下看清楚）
- [ ] 翻譯意圖擴充（可加更多關鍵字 mapping）

### P2（暫不動）
- [ ] LLM API 真實翻譯（需評估離線備援）
- [ ] 雲端同步 / 使用記錄統計

---

## 設計原則（接手請遵守）

1. **離線優先**：不依賴外部 API，功能在沒網路時要能用
2. **速度第一**：不加不必要的動畫或過場，三秒內可操作
3. **大按鈕**：手髒 / 光線強，touch target 至少 48px
4. **不做垃圾桶**：工具要引導使用者「保護收入和情緒」，不是讓他發洩完了事
5. **深色系**：`#0a0a0a` 背景，戶外螢幕省電 + 不刺眼
6. **翻譯邏輯不要字面清洗**：一定要「偵測意圖 → 輸出模板」，不然輸出句子會不通

---

## 已知限制

- 專案原始路徑含中文，**git 無法在中文路徑初始化**
- 工作目錄已移至：`C:\Users\user\Projects\anti-villain-shield\`
- 原中文路徑（`個人專案_防小人神器`）保留當紀錄用，**不是開發目錄**

---

## Repo & 部署

- GitHub：https://github.com/lml679939-cmyk/anti-villain-shield
- 部署：GitHub Pages（`main` branch / `root`）
- 預計網址：https://lml679939-cmyk.github.io/anti-villain-shield/

---

## 使用者資訊

- 職業情境：擺攤（夜市）
- 主要裝置：Android 手機（Chrome）
- 技術偏好：先求能用，之後再考慮轉框架
- 協作風格：vibe coding，要快、要實用，不要過度設計
