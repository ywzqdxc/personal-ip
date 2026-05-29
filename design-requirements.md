# 个人 IP 网站 — 设计需求 & 交接文档

> 文档路径：`D:\UserData\idea\personal-ip\design-requirements.md`
> 最后更新：2026-05-30（全量同步：6 个 Hobby 子页 + 荣誉轮转 + Thoughts 视频 + Blog UI + 欢迎音频）
> GitHub：https://github.com/ywzqdxc/personal-ip

---

## 〇、AI 接手速览（先读这里，5 分钟了解全局）

### 项目是什么

个人 IP 展示网站。三个子项目同在 `personal-ip/` 下：

| 子项目 | 技术栈 | 端口 | 说明 |
|--------|--------|------|------|
| `personal-ip-backend/` | Spring Boot 3.5.9 + Java 17 + Maven | 48080 | RuoYi-Vue-Pro 魔改 |
| `personal-ip-admin/` | Vue 3 + Element Plus + pnpm | 80 | 管理后台 |
| `personal-ip-frontend/` | Next.js 16 + React 19 + TypeScript + Tailwind v4 | 3000 | **主战场** |

### 当前进度一句话

**前台核心页面已全部实现。** Travel（4 年数据 + 胶卷日记）、About（Bento Grid + 荣誉轮转 + GitHub Calendar + 6 个 Hobby 子页）、Thoughts（瀑布流 + 视频支持）、Blog（列表 + 杂志风详情）均已上线。全站暖色系统一、全局特效已接入、欢迎音频已接入。后端 IP 模块 8 张表 + CRUD 完整。待做：About 子页（Story/Tech/Career）、首页 Hero、Projects 页、前后端 API 对接、SEO/部署。

### 必须知道的 6 件事

1. **页面全在 `app/` 下用 App Router**，所有 CSS 用 `CSS_LINES = [...]` 数组 + `join('\n')` 方式，避免 TSX 模板字符串问题
2. **数据层有 mock 兜底**：API 返回 null 时自动 fallback。后端未启动也能看完整 UI
3. **全局特效全部在 `app/layout.tsx`**：LenisProvider → ClickSpark → Navigation → BackgroundAnimations → PixarCharacter → WelcomeAudio → {children}
4. **Tailwind v4** 使用 `@layer` 机制，unlayered 的 `<style>` 标签 CSS 会覆盖 Tailwind utilities。导航栏居中问题已用内联 `margin: '0 auto'` 修复
5. **Hobby 子页统一模式**：视频 Hero → Stats → Philosophy → [特色区] → 返回按钮。每个子页有独立配色氛围和独有字体
6. **RewardSection 在 About 页底部**：IntersectionObserver 自动展开 + 滚动驱动轮转。图片路径 `/images/reward/reward_*.jpg`，通过 `/api/rewards` 自动发现

### 关键文件索引

```
📄 design-requirements.md          ← 你在读的
📁 personal-ip-frontend/app/       ← 所有页面路由
│  ├─ page.tsx                     ← 首页（占位）
│  ├─ about/page.tsx               ← About Hub（Bento + 荣誉轮转 + GH Calendar）
│  ├─ about/hobby/page.tsx         ← Hobby Hub（6 张卡片）
│  ├─ about/hobby/{running,coder,reading,music,table-tennis,cooking}/page.tsx
│  ├─ travel/page.tsx              ← 年份浮动卡片
│  ├─ travel/[year]/page.tsx       ← 年份旅行列表
│  ├─ travel/[year]/[tripId]/page.tsx ← 日记详情（~1000 行，胶卷风格）
│  ├─ thoughts/page.tsx            ← 随想瀑布流（视频+图片+文字卡片）
│  ├─ blog/page.tsx                ← 博客列表（暖色卡片）
│  ├─ blog/[slug]/page.tsx         ← 博客详情（杂志风 Hero）
│  └─ api/rewards/route.ts         ← 荣誉图片自动发现 API
📁 personal-ip-frontend/lib/
│  ├─ travel/                      ← Travel 类型/API/mock
│  ├─ api/                         ← thoughts.ts / articles.ts
│  └─ utils.ts / sound-data.ts
📁 personal-ip-frontend/components/ ← 全局组件（19 个）
📁 personal-ip-frontend/public/
│  ├─ videos/                      ← 各页面视频素材（7 个 mp4 + welcome.wav）
│  └─ images/reward/               ← 荣誉证书图片（9 张，自动发现）
```

---

## 一、路由 & 页面状态

```
/                          ⬜ 首页（占位，待完善）
/about                     ✅ Bento Grid + 荣誉轮转 + GitHub Calendar
/about/hobby               ✅ 6 张 Hobby 卡片（全黑暗调）
/about/hobby/running       ✅ 视频Hero 黑+金 冥想风（无 Gallery）
/about/hobby/coder         ✅ 视频Hero 终端风 JetBrains Mono
/about/hobby/reading       ✅ 视频Hero 古书风 Libre Baskerville（无 Gallery）
/about/hobby/music         ✅ 视频Hero 黑胶风 Cormorant Garamond
/about/hobby/table-tennis  ✅ 视频Hero 对抗风（无 Inspiration/Snapshots）
/about/hobby/cooking       ✅ 视频Hero 灶火风 Lora（无 Gallery）
/about/story               ⬜ 占位路由
/about/tech                ⬜ 占位路由
/about/career              ⬜ 占位路由
/travel                    ✅ 4 年浮动卡片（2023-2026）
/travel/[year]             ✅ 年份旅行列表
/travel/[year]/[tripId]    ✅ 日记详情（胶卷/黑胶风）
/thoughts                  ✅ 瀑布流（视频+图片+文字，mock 数据）
/blog                      ✅ 列表页（暖色卡片）
/blog/[slug]               ✅ 详情页（杂志风 Hero）
/projects                  ⬜ 待实现
```

---

## 二、设计系统

### 全站配色（暖色系）

| 值 | 用途 |
|-----|------|
| `#FDF6EE` | 页面底色 |
| `#2E1A0E` | 主文字/深棕 |
| `#C45A30` | 强调色/橙红 |
| `#E8855A` | 亮橙（ClickSpark 火花色） |
| `#B07050` | 辅助文字 |
| `#E8C9B0` | 分割线/边框 |

### Hobby 子页差异化总览

| # | 页面 | 底色 | Accent | 独有字体 | 播放速率 | 氛围 |
|---|------|------|--------|----------|----------|------|
| 01 | Running | `#080605` 黑 | `#C9A96E` 金 | Playfair Display italic | 0.85× | 冥想 |
| 02 | Coder | `#0A0E17` 蓝黑 | `#64FFDA` 青绿 | JetBrains Mono | 0.90× | 终端 |
| 03 | Reading | `#1C1612` 深棕 | `#C9A96E` 暗金 | Libre Baskerville | 0.85× | 书店 |
| 04 | Music | `#0D0806` 棕黑 | `#D4A54A` 琥珀 | Cormorant Garamond | 0.80× | 黑胶 |
| 05 | T. Tennis | `#060F08` 深绿 | `#E53935` 红 | Barlow Condensed 全大写 | 1.00× | 对抗 |
| 06 | Cooking | `#1A0E08` 炭黑 | `#E87A4A` 火焰橙 | Lora + Playfair Display | 0.90× | 灶火 |

### 可用字体

Barlow Condensed / Barlow / Caveat / Playfair Display / JetBrains Mono / Libre Baskerville / Cormorant Garamond / Lora / Noto Serif SC

---

## 三、About 页面 (`app/about/page.tsx`)

**当前行数：** ~564 行

**Hero 区：**
- 左：标签 + H1 "Hi, I am Reginamy." + bio + social chips + GitHub Calendar（内嵌，浅色主题，用户 ywzqdxc）
- 右：`cuixin.png` 图片（height: 280，无裁剪无圆角）

**Bento Grid（3×2）：**
- Story（深棕 1-2列/行1）+ Hobby（纯黑 列3/行1-2）+ Tech（蓝白 列1/行2）+ Career（暖白 列2/行2）
- 注：GitHub Calendar 已从 Bento 第三行移到 Hero 区

**荣誉轮转区（RewardSection，滚动到 Career 下方进入）：**
- 阶段 1：IntersectionObserver 检测进入 → 自动扇形展开（0.8s 弹性缓动）
- 阶段 2：展开后滚动驱动转盘轮转，卡片平滑 lerp 滑入/滑出
- 每张证书下方 Cavet 标签，中心高亮边缘渐隐
- 图片通过 `/api/rewards` 自动发现 `public/images/reward/` 目录
- 标签文字在 `AWARD_LABELS` 数组中，可直接修改

---

## 四、Thoughts 页面 (`app/thoughts/page.tsx`)

**当前行数：** ~770 行

**布局：** Caveat 副标题 + 瀑布流卡片网格

**卡片类型支持：**
- 文字卡片（标准）
- 代码卡片（含 ``` 的代码块，暗色背景 + Syntax 高亮预留）
- 图片卡片（`imageUrl` 存在时）
- **视频卡片**（`videoUrl` 存在时，优先渲染 `<video autoPlay loop muted>`）

**Thought 类型（`lib/api/thoughts.ts`）：**
```ts
interface Thought {
  id: number; content: string; mood: string | null;
  tags: string | null; imageUrl: string | null;
  videoUrl?: string | null;  // 2026-05-29 新增
  createTime: string;
}
```

**Mock 数据：** 12 条，前两条为视频（1.mp4 "果然深情的人喝不醉" / 2.mp4 "雏菊的花语是…"），后端未启动时自动使用

---

## 五、Blog 页面

- `app/blog/page.tsx` — 列表页，暖色卡片，pinned 标记
- `app/blog/[slug]/page.tsx` — 详情页，全宽封面 Hero + 元数据条 + 680px 正文区
- 数据来自 `lib/api/articles.ts`，mock 兜底

---

## 六、数据层

### Travel（`lib/travel/`）
- `types.ts` — TravelYear / TravelTrip / TravelChapter
- `api.ts` — getTravelYears() / getTravelTrip()，ISR 3600s，mock fallback
- `mock-data.ts` — 4 年数据：Thailand 2023 / Europe 2024 / Japan 2025 / Bali 2026

### Thoughts（`lib/api/thoughts.ts`）
- `getPublishedThoughts()` — 返回 Thought[]，mock fallback 12 条

### Blog（`lib/api/articles.ts`）
- `getPublishedArticles()` — 返回 Article[]，mock fallback

---

## 七、全局特效（全部已接入 `app/layout.tsx`）

| 组件 | 文件 | 说明 |
|------|------|------|
| ClickSpark | `components/click-spark.tsx` | 鼠标点击烟花，暖色 `#E8855A` |
| LenisProvider | `components/lenis-provider.tsx` | 全局平滑滚动 |
| BackgroundAnimations | `components/background-animations.tsx` | 背景画布动画 |
| PixarCharacter | `components/pixar-character.tsx` | 右下角吉祥物 |
| WelcomeAudio | `components/welcome-audio.tsx` | 首次交互播放 `welcome.wav`（音量 0.25） |

**layout.tsx 结构：**
```
<html>
  <body>
    <ThemeProvider>
      <LenisProvider>
        <ClickSpark>
          <Navigation />
          <BackgroundAnimations />
          <PixarCharacter />
          <WelcomeAudio />
          {children}
        </ClickSpark>
      </LenisProvider>
    </ThemeProvider>
  </body>
</html>
```

---

## 八、后端模块（`yudao-module-ip`）

8 张表全部到位：
- `ip_article` / `ip_travel_diary`（旧）/ `ip_travel_trip` / `ip_travel_chapter` / `ip_travel_photo` / `ip_thought` / `ip_project` / `ip_team_member`
- Travel 模块 DO/Controller/Service/VO 完整实现
- SQL：`personal-ip-backend/sql/travel_tables.sql`
- 菜单 SQL：`personal-ip-backend/sql/system_menu_ip.sql`

---

## 九、开发进度（2026-05-30）

```
Phase 1（基础）：        ✅ 100%
Phase 2（核心页面）：    ▓▓  ~90%  About子页/首页Hero/Projects 待做
Phase 3（交互特效）：    ✅ 100%  全部接入 layout.tsx
Phase 4（后端对接）：    ▓▓  ~60%  后端 CRUD 已写，前端 mock 兜底
Phase 5（全站统一）：    ▓▓  ~50%  暖色系已统一，SEO/部署待做
Phase 6（AI 集成）：     ⬜ 0%
```

### 待办优先级

1. **About 子页** — Story / Tech / Career 路由存在但 404
2. **首页 Hero** — `app/page.tsx` 是框架占位
3. **Projects 页** — 路由占位
4. **前后端 API 对接** — 替换 mock 数据
5. **SEO / 部署**

---

## 十、视频/图片素材清单

```
public/videos/
  runner.mp4         — Running 子页 Hero
  coder.mp4          — Coder 子页 Hero
  reader.mp4         — Reading 子页 Hero
  listener.mp4       — Music 子页 Hero
  tabletennis.mp4    — Table Tennis 子页 Hero
  cook.mp4           — Cooking 子页 Hero
  welcome.wav        — 网站进入欢迎音频
  thoughts/1.mp4     — 随想视频帖子
  thoughts/2.mp4     — 随想视频帖子

public/images/
  cuixin.png         — About 页头像
  reward/reward_1~9.jpg — 荣誉证书图片（API 自动发现）
```

---

## 十一、已知注意事项

1. **导航栏"About"按钮**在 desktop 右键，navItems 中已移除 About（避免重复）
2. **Hobby 子页 CSS 重置** `*, *::before, *::after { margin: 0 }` 会覆盖 Tailwind `mx-auto`，导航栏已用内联 style 修复
3. **About 页隐藏全局背景 canvas**：`'canvas.pointer-events-none { display:none !important; }'` 避免干扰
4. **Thoughts 页视频** autoplay 在移动端可能被阻止，仅桌面端自动播放
5. **RewardSection 依赖 Lenis 的 useLenis 回调**，确保 `<LenisProvider>` 包裹了整个应用
