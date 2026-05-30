# 个人 IP 网站 — 设计需求 & 交接文档

> 文档路径：`D:\UserData\idea\personal-ip\design-requirements.md`
> 最后更新：2026-05-30（全量同步：首页 Bento + About 荣誉交互升级 + Thoughts 模块化重构 + Projects Framer Motion）
> GitHub：https://github.com/ywzqdxc/personal-ip

---

## 〇、AI 接手速览（先读这里）

### 项目是什么

个人 IP 展示网站。三个子项目同在 `personal-ip/` 下：

| 子项目 | 技术栈 | 端口 | 说明 |
|--------|--------|------|------|
| `personal-ip-backend/` | Spring Boot 3.5.9 + Java 17 + Maven | 48080 | RuoYi-Vue-Pro 魔改 |
| `personal-ip-admin/` | Vue 3 + Element Plus + pnpm | 80 | 管理后台 |
| `personal-ip-frontend/` | Next.js 16 + React 19 + TypeScript + Tailwind v4 | 3000 | **主战场** |

### 当前进度一句话

**前台页面全面上线。** 首页（HELLO WORLD Hero + Bento 入口卡）、About（荣誉轮转 + GH Calendar）、6 个 Hobby 子页、Travel（4 年数据 + 胶卷日记）、Thoughts（模块化重构 + 视频/图片/文字卡片）、Blog（列表 + 杂志风详情）、Projects（Framer Motion 筛选网格）均已实现。后端 8 张表完整。

### 必须知道的 7 件事

1. **页面全在 `app/` 下用 App Router**，CSS 用 `CSS_LINES` 数组 + `join('\n')`（Thoughts 模块化后改用 `styles.ts` 文件）
2. **数据层有 mock 兜底**：API 返回 null 自动 fallback。后端未启动也能看完整 UI
3. **全局特效全部在 `app/layout.tsx`**：LenisProvider → ClickSpark → Navigation → BackgroundAnimations → PixarCharacter → WelcomeAudio → {children}
4. **Tailwind v4** `@layer` 机制：unlayered `<style>` 标签 CSS 覆盖 Tailwind utilities。导航栏居中已用内联 `margin: '0 auto'` 修复
5. **Hobby 子页统一模式**：视频 Hero → Stats → Philosophy → [特色区] → 返回按钮。每子页独立配色+字体
6. **About 荣誉轮转**：IntersectionObserver 自动展开 + 鼠标滚轮驱动轮转。图片通过 `/api/rewards` 自动发现。新增 wheel listener + cooldown 机制防止误触
7. **Thoughts 全面模块化重构**（2026-05-30）：主文件 154 行，拆分为 thought-card、timeline、column-distributor、image-preloader、styles、thought-utils、audio-engine

### 关键文件索引

```
📄 design-requirements.md          ← 你在读的
📁 app/
│  ├─ page.tsx                     ← 首页（HELLO WORLD + Bento 入口卡）
│  ├─ about/page.tsx               ← About Hub（751行，Bento+荣誉轮转+GH Calendar+wheel listener）
│  ├─ about/hobby/{running,coder,reading,music,table-tennis,cooking}/page.tsx
│  ├─ travel/page.tsx              ← 年份浮动卡片
│  ├─ travel/[year]/page.tsx       ← 年份旅行列表
│  ├─ travel/[year]/[tripId]/page.tsx ← 日记详情（~1000行，胶卷风）
│  ├─ thoughts/page.tsx            ← 随想瀑布流（154行模块化）
│  ├─ thoughts/{thought-card,timeline,column-distributor,image-preloader,styles,thought-utils,audio-engine}.ts
│  ├─ blog/page.tsx                ← 博客列表
│  ├─ blog/[slug]/page.tsx         ← 博客详情（杂志风 Hero）
│  ├─ projects/page.tsx            ← 项目网格（Framer Motion 筛选动画）
│  └─ api/rewards/route.ts         ← 荣誉图片自动发现 API
📁 lib/
│  ├─ api/{articles,thoughts,projects,team,travel,client}.ts
│  ├─ travel/{types,api,mock-data}.ts
│  └─ {utils,sound-data}.ts
📁 data/
│  ├─ local-projects.ts            ← 本地项目数据（253行，农业/Web/Creative）
│  ├─ projects.json                ← 项目 JSON 数据（13 条）
│  └─ timeline.json
📁 components/
│  ├─ {click-spark,lenis-provider,background-animations,pixar-character,welcome-audio}.tsx ← 全局特效
│  ├─ {hero-section,projects-section,timeline-section,about-section,contact-section}.tsx ← 首页组件
│  ├─ {gallery-section,hobbies-piechart,hobby-characters,ikigai-diagram}.tsx ← About 组件
│  ├─ {three-scene,project-card,simple-icons,theme-provider}.tsx
│  ├─ projects/{ProjectGridCard,ProjectCard,tilt-card,markdown-renderer}.tsx
│  ├─ navigation.tsx / ui/ / travel/
📁 public/
│  ├─ videos/{runner,coder,reader,listener,tabletennis,cook,dy1,hydra}.mp4 + welcome.wav + thoughts/{1,2}.mp4
│  └─ images/{cuixin.png, reward/reward_1~9.jpg}
```

---

## 一、路由 & 页面状态

```
/                          ✅ HELLO WORLD Hero + Bento 入口卡（Projects/Travel/Thoughts/Blog）
/about                     ✅ Bento Grid 3×2 + 荣誉轮转 + GH Calendar（751行）
/about/hobby               ✅ 6 张 Hobby 卡片
/about/hobby/{running,coder,reading,music,table-tennis,cooking} ✅ 6 个子页各具特色
/about/story               ⬜ 占位
/about/tech                ⬜ 占位
/about/career              ⬜ 占位
/travel                    ✅ 4 年浮动卡片
/travel/[year]             ✅ 年份列表
/travel/[year]/[tripId]    ✅ 日记详情（Bali 2026 最完整）
/thoughts                  ✅ 模块化瀑布流（视频+图片+文字，有 Lightbox）
/blog                      ✅ 列表 + 杂志风详情
/blog/[slug]               ✅ 详情页
/projects                  ✅ Framer Motion 筛选网格（13 个项目，3 分类）
```

---

## 二、设计系统

### 全站配色（暖色系）

| 值 | 用途 |
|-----|------|
| `#FDF6EE` | 页面底色 |
| `#2E1A0E` | 主文字 |
| `#C45A30` | 强调色 |
| `#E8855A` | 亮橙（ClickSpark 火花） |
| `#B07050` | 辅助文字 |
| `#E8C9B0` | 分割线/边框 |

### Hobby 子页差异化

| # | 页面 | 底色 | Accent | 独有字体 | 速率 | 氛围 |
|---|------|------|--------|----------|------|------|
| 01 | Running | `#080605` 黑 | `#C9A96E` 金 | Playfair Display italic | 0.85× | 冥想 |
| 02 | Coder | `#0A0E17` 蓝黑 | `#64FFDA` 青绿 | JetBrains Mono | 0.90× | 终端 |
| 03 | Reading | `#1C1612` 深棕 | `#C9A96E` 暗金 | Libre Baskerville | 0.85× | 书店 |
| 04 | Music | `#0D0806` 棕黑 | `#D4A54A` 琥珀 | Cormorant Garamond | 0.80× | 黑胶 |
| 05 | T. Tennis | `#060F08` 深绿 | `#E53935` 红 | Barlow Condensed 全大写 | 1.00× | 对抗 |
| 06 | Cooking | `#1A0E08` 炭黑 | `#E87A4A` 火焰橙 | Lora + Playfair Display | 0.90× | 灶火 |

---

## 三、首页 (`app/page.tsx`)

92 行。HELLO WORLD Hero（Barlow Condensed 大字）+ 4 卡 Bento 入口（Projects/Travel/Thoughts/Blog），暖色系卡片 hover 带箭头滑动。

---

## 四、About 页面 (`app/about/page.tsx`) — 751 行

### Hero 区
- 左：标签 + "Hi, I am Reginamy." + bio + social chips + GitHub Calendar（ywzqdxc，浅色主题）
- 右：`cuixin.png` 头像（height: 280，无裁剪圆角）

### Bento Grid (3×2)
- Story（深棕 1-2列）+ Hobby（纯黑 列3 跨1-2行）+ Tech（蓝白）+ Career（暖白）

### 荣誉轮转区（RewardSection）
- 阶段 1：IntersectionObserver → 自动扇形展开（0.8s 弹性缓动）
- 阶段 2：鼠标滚轮驱动转盘轮转，连续浮点偏移平滑插值，卡片从左侧滑入/右侧滑出
- wheel listener + cooldown（600ms）防止误触
- 每张证书下方 Caveat 标签，中心高亮边缘渐隐
- 图片通过 `/api/rewards` 自动发现 `public/images/reward/`

---

## 五、Thoughts 页面 (`app/thoughts/`) — 模块化重构

**主文件：** `page.tsx` 154 行

**子模块（同目录）：**
| 文件 | 职责 |
|------|------|
| `thought-card.tsx` | 单张卡片渲染 + Lightbox |
| `timeline.tsx` | 时间线布局组件 |
| `column-distributor.ts` | 卡片分列 + DOM rebalance |
| `image-preloader.ts` | 图片预加载 |
| `styles.ts` | CSS 样式（替代 CSS_LINES） |
| `thought-utils.ts` | MOCK_THOUGHTS + 工具函数 |
| `audio-engine.ts` | 音频引擎 |

**支持类型：** 文字/代码/图片/视频（`videoUrl` 优先）

**Mock 数据：** 前两条为视频帖子（1.mp4 / 2.mp4）

---

## 六、Projects 页面 (`app/projects/page.tsx`) — 423 行

- **依赖：** framer-motion（`AnimatePresence`, `motion`）
- **数据源：** `data/projects.json`（13 条）+ `data/local-projects.ts`（农业/Web/Creative）
- **布局：** 分类筛选 tabs + CSS Grid 卡片 + Filter/All 切换 + stagger 动画
- **组件：** `ProjectGridCard`（`components/projects/ProjectGridCard.tsx`）

---

## 七、全局特效（全部接入 layout.tsx）

| 组件 | 文件 |
|------|------|
| ClickSpark | `components/click-spark.tsx` |
| LenisProvider | `components/lenis-provider.tsx` |
| BackgroundAnimations | `components/background-animations.tsx` |
| PixarCharacter | `components/pixar-character.tsx` |
| WelcomeAudio | `components/welcome-audio.tsx`（首次交互播放 `welcome.wav`，音量 0.25） |

---

## 八、后端模块

8 张表完整。Travel 模块 DO/Controller/Service/VO 已实现。SQL 在 `personal-ip-backend/sql/`。

---

## 九、开发进度（2026-05-30）

```
Phase 1（基础）：        ✅ 100%
Phase 2（核心页面）：    ✅ 100% 所有页面已上线
Phase 3（交互特效）：    ✅ 100%
Phase 4（后端对接）：    ▓▓  ~60%  后端 CRUD 已写，前端仍 mock
Phase 5（全站统一/SEO）：⬜ 待做
Phase 6（AI 集成）：     ⬜ 待做
```

### 待办

1. About 子页 — Story / Tech / Career
2. 前后端 API 对接
3. SEO / 元数据 / 部署

---

## 十、素材清单

```
public/videos/
  runner.mp4  coder.mp4  reader.mp4  listener.mp4  tabletennis.mp4  cook.mp4
  dy1.mp4  hydra.mp4  welcome.wav  thoughts/{1,2}.mp4

public/images/
  cuixin.png  reward/reward_1~9.jpg
```

---

## 十一、已知注意事项

1. **导航栏**"About"在右侧按钮，navItems 中已去重
2. **Hobby CSS 重置**覆盖 Tailwind `mx-auto`，导航栏已用内联 style 修复
3. **About 页**隐藏全局 background canvas 避免干扰
4. **Thoughts 模块化**——修改时注意子模块文件，不要只改 page.tsx
5. **RewardSection** 依赖 Lenis `useLenis` 回调 + wheel listener
6. **Projects** 使用 framer-motion，需保持依赖
