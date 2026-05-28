# 个人 IP 网站 — 前端设计需求文档

> 文档路径：`D:\UserData\idea\personal-ip\design-requirements.md`
> 最后更新：2026-05-28（新增 GitHub Calendar，同步最新代码状态）
> GitHub：https://github.com/ywzqdxc/personal-ip

---

## 〇、AI 接手速览（先读这里）

### 项目是什么

个人 IP 展示网站。三个子项目同在 `personal-ip/` 下：

| 子项目 | 技术栈 | 端口 | 说明 |
|--------|--------|------|------|
| `personal-ip-backend/` | Spring Boot 3.5.9 + Java 17 + Maven | 48080 | RuoYi-Vue-Pro 魔改，`yudao-module-ip` 是自定义业务模块 |
| `personal-ip-admin/` | Vue 3 + Element Plus + pnpm | 80 | 芋道管理后台前端，IP 内容管理入口在系统管理菜单下 |
| `personal-ip-frontend/` | Next.js 14 + React 19 + TypeScript + Tailwind | 3000 | **个人主页前台（做的主要是这里）** |

### 当前进度一句话

前台 Travel（旅行日记）+ About（关于我 Hub + Hobby + GitHub Calendar）已完成 UI 和 mock 数据；后端 IP 模块 Travel 三张表 + CRUD 已实现；全站暖色系 CSS vars 已统一；全局特效已全部接入 layout.tsx。下一步是 About 子页（Story/Tech/Career）+ Projects + Blog/Thoughts 页面实现。

### 必须知道的 5 件事

1. **Travel 日记页是核心页面**（`app/travel/[year]/[tripId]/page.tsx`，~1000 行），已从 `bali2026.html` 完整移植胶卷/黑胶风格。存在 React Rules of Hooks 修复历史——必须确保所有 hooks 在条件返回之前调用。

2. **CSS 不要直接写在 TSX template literal 里**——嵌套 `${}` 会触发 TSX 解析器误报。当前方案是 CSS 提取到独立 `.ts` 文件（如 `app/travel/buildCss.ts`），用 `CSS_LINES.join('\n')` 生成。

3. **数据层设计**：`lib/travel/api.ts` 是接口层，`lib/travel/mock-data.ts` 是 mock 兜底。当前 API 返回 `{code:0, data:null}` 时自动 fallback 到 mock。后端上线后只需改 api.ts 的 fetch URL 即可切到真实数据。

4. **后端 IP 模块**（`yudao-module-ip`）已有 8 张表：`ip_article`、`ip_travel_diary`、`ip_travel_trip`、`ip_travel_chapter`、`ip_travel_photo`、`ip_thought`、`ip_project`、`ip_team_member`。Travel 模块（trip/chapter/photo）DO/Controller/Service/VO 已全部实现，SQL 在 `personal-ip-backend/sql/travel_tables.sql`。

5. **全局特效组件已全部接入**：`click-spark.tsx`、`lenis-provider.tsx`、`background-animations.tsx`、`pixar-character.tsx` 已在 `app/layout.tsx` 中引入，全局生效。

### 关键文件索引

```
📄 design-requirements.md          ← 你正在读的
📄 personal-ip-frontend/HANDOFF.md ← Claude 写的交接文档，含 BUG 修复历史 + 下一步任务提示词
📄 环境搭建说明.md                  ← 协作者环境配置指南
📁 personal-ip-frontend/app/travel/ ← Travel 3 个页面
📁 personal-ip-frontend/lib/travel/ ← 类型/API/mock 数据
📁 personal-ip-frontend/components/ ← 全局组件（已全部接入 layout.tsx）
📁 personal-ip-backend/yudao-module-ip/ ← 后端 IP 业务模块
📁 personal-ip-backend/sql/        ← 数据库脚本
📁 personal-ip-admin/src/views/ip/ ← 管理后台 IP 管理页面
```

---

## 一、整体架构原则

| 原则 | 说明 |
|------|------|
| **模块化 / 低耦合** | 每个页面是独立路由，不做单页全滚动 |
| **高内聚** | 旅行日记、随想、项目展示各自是独立模块 |
| **后续扩展友好** | 新增模块只需增加路由 + 对应 API |
| **SEO 友好** | Next.js App Router + Server Components，关键内容 SSR/SSG |
| **统一后台** | 所有内容由芋道管理系统（RuoYi-Vue-Pro）统一管理 |

---

## 二、导航栏 & 路由规划

```
/                      首页（Hero + 简介摘要入口）
/about                 关于我（Bento Grid + GitHub Calendar） ✅ 已实现
/about/hobby           Hobby 子页（运动·代码·阅读·音乐） ✅ 已实现
/about/hobby/running      Running 详情页（视频Hero+数据） ✅ 已实现
/about/hobby/table-tennis Table Tennis 详情页（深绿对抗风） ✅ 已实现
/about/story           我的故事（待实现）
/about/tech            技术栈（待实现）
/about/career          职业经历（待实现）
/projects              项目展示
/travel                旅行年份选择页 ✅ 已实现
/travel/[year]         某年旅行列表 ✅ 已实现
/travel/[year]/[tripId] 旅行日记详情页 ✅ 已实现
/thoughts              随想碎片
/blog                  博客文章
```

导航栏组件：`components/navigation.tsx`，增删路由只改这一个文件。

---

## 三、已实现页面详情

### 3.1 `/travel` — 年份浮动卡片页

**文件：** `app/travel/page.tsx`（约 390 行）

**布局：** 全屏固定，左 42% / 右 58% 分栏

**左侧：**
- "Hello, I am" 小标签
- "Collecting / Moments." 大标题（Barlow Condensed 76px）
- Caveat 手写体副标题
- 中文描述
- CTA 按钮

**右侧：**
- SVG 贝塞尔曲线连接卡片
- 5 个浮动年份卡片（各有旋转角度、颜色点、年份数字、标签），定义在 `CARD_SLOTS`
- 每张卡片有独立 float 动画（`@keyframes floatCard0~4`）

**底部：**
- 年份 pill 按钮（`.y-pill`，active 状态深棕 `#2E1A0E`）
- 左下角 "Scroll to explore"
- 右下角 "Life is short, the world is wide." Caveat 字体
- 左上角 Leaf SVG 装饰

**数据：** 通过 `getTravelYears()` 从 `lib/travel/api.ts` 获取，带 mock 数据兜底

---

### 3.2 `/travel/[year]` — 年份内旅行列表

**文件：** `app/travel/[year]/page.tsx`

显示该年所有旅行的卡片列表，点击进入日记详情。

---

### 3.3 `/travel/[year]/[tripId]` — 旅行日记详情

**文件：** `app/travel/[year]/[tripId]/page.tsx`（约 1010 行，含完整 CSS）

**重要：** 文件末尾是以反引号关闭的 CSS 模板字符串（`journalCss`），编辑时注意不要破坏结构。

**布局：** 固定全屏，顶部 Mini Topbar（42px），正文区左右各 50%

**封面页（pg=0）：**
- 左：胶卷风格 tracklist，章节悬停显示 tint overlay 动效
- 右：章节缩略图卡片列表（film-strip 风格）

**章节页（pg≥1）：**
- 左：章节大标题（Barlow Condensed）、accent 线、中文名、tags（打字机效果）、spots、quote、stamp
- 右：背景大图 + 胶片缩略图侧边条（filmstrip）

**已修复 BUG：**
- `goPage()` 里加了 `setHovIdx(null)` — 翻页时清空 hover 状态
- NOW HOVERING 浮层改为 `pg === 0 && hovIdx !== null` — 只在封面页显示

**数据：** 通过 `getTravelTrip(year, tripId)` 获取，mock 数据在 `lib/travel/mock-data.ts`

---

### 3.4 `/about` — About Hub（Bento Grid）

**文件：** `app/about/page.tsx`（约 490 行，含 GitHub Calendar）

**配色：** 暖米色系（`#FDF6EE` 背景，`#2E1A0E` 深棕，`#C45A30` 橙红）

**Hero 区：**
- 左：标签 + H1（Barlow Condensed 64px）+ bio + social chips
- 右：渐变圆形头像（橙色渐变 + "R" 初始字）

**Bento Grid（3列3行）：**

| 卡片 | 占位 | 配色 | 内容 |
|------|------|------|------|
| Story | 1-2列 / 行1 | 深棕 `#2E1A0E` | 标题 + mini 时间线（3个里程碑带彩色点） |
| Hobby | 列3 / 行1-2 | 纯黑 `#141414` | Beyond Work. + 4个迷你 hobby 格 |
| Tech | 列1 / 行2 | 蓝白 `#EEF4FF` | Tech Stack + 技术标签 |
| Career | 列2 / 行2 | 暖白 `#FFF8F0` | Career + 3条经历列表 |
| **GitHub** | **1-3列 / 行3** | **深棕 `#2E1A0E`** | **GitHub Contribution Graph（react-github-calendar，用户 ywzqdxc，暖色系自定义主题）** |

前 4 张卡片点击跳转对应子页面。GitHub 卡片右上角 pill 按钮可跳转到 github.com/ywzqdxc。

---

### 3.5 `/about/hobby` — Hobby 子页

**文件：** `app/about/hobby/page.tsx`（约 140 行）

**配色：** 全黑暗调（`#0E0C0A` 背景，金色 `#C9A96E`）

**Hero 区（100vh，Unsplash 山脉背景）：**
- 标签：`MOMENTUM · Life · Passion`
- 标题：`Beyond Work, Inside Life.`（"Life." 为 Playfair Display italic 金色）
- 中文描述：工作塑造了我的能力，而热爱，塑造了我的生活方式和思考方式。
- 左下 Scroll indicator（圆圈 + 箭头）
- 右侧竖排 "SCROLL TO EXPLORE"

**返回按钮：** `position: fixed; top: 92px; left: 36px`（避开 80px 导航栏）

**4张 Hobby 卡片（横排，3/4 宽高比，Unsplash 背景图）：**

| # | 标题 | Unsplash ID |
|---|------|-------------|
| 01 | Running | photo-1461896836934-ffe607ba8211 |
| 02 | Coder | photo-1498050108023-c5249f4df085 |
| 03 | Reading | photo-1524578271613-d550eacf6090 |
| 04 | Music | photo-1478737270239-2f02b77fc618 |

Hero Unsplash ID：`photo-1483728642387-6c3bdd6c93e5`（山脉人物）

**右下引言：** George Bernard Shaw（Playfair Display italic，半透明白色）

---

### 3.6 `/about/hobby/running` — Running 详情页

**文件：** `app/about/hobby/running/page.tsx`（约 214 行）

**设计风格：** 深色极致风 + 金线点缀（与 Hobby 页一致：`#080605` 背景，`#C9A96E` 金色）

**布局：4 个 Section**

| Section | 内容 |
|---------|------|
| Hero（100vh） | 全屏背景视频（`/videos/runner.mp4`），autoplay loop muted，0.85x 慢放。视频加载失败 fallback 到 Unsplash 跑步图。标题 `Running` + Playfair Display italic 副标题 `& the art of forward motion.` + 金线标签 |
| Stats Strip | 4 列数据网格（总距离 / 平均配速 / 马拉松数 / 路上时间），Barlow Condensed 大数字 + 金色 |
| Philosophy | 双栏：左 Playfair Display italic 金色引言，右 Noto Serif SC 中文正文 |
| Gallery | 3 列跑步摄影作品（Unsplash），hover 放大 1.06x，底部 caption |

**返回按钮：** `position: fixed; top: 92px; left: 36px`，返回 `/about/hobby`

**入口：** 从 `/about/hobby` 的 Running 卡片点击进入。

---

### 3.7 `/about/hobby/table-tennis` — Table Tennis 详情页

**文件：** `app/about/hobby/table-tennis/page.tsx`（约 291 行）

**设计风格：** 深绿球桌底 + 纯白线条 + 红色爆发点（`#060F08` 背景，`#E53935` 红色 accent）

**与 Running 的差异化：**

| 维度 | Running | Table Tennis |
|------|---------|-------------|
| 底色 | `#080605` 纯黑 | `#060F08` 深绿 |
| accent | `#C9A96E` 金色 | `#E53935` 红色 |
| 节奏 | 慢速（0.85x）冥想 | 正常速度，快速对抗 |
| 引言字体 | Playfair Display italic | Barlow Condensed 全大写 |
| 氛围 | 向内探索 | 向外对抗 |
| 分割线 | 无 | "Net" 球桌中线 |
| 特色 Section | Stats / Philosophy / Gallery | Stats / Philosophy / **Legends（张继科+马龙）** / Gallery |

**布局：5 个 Section + 1 个 Net 分割线**

| Section | 内容 |
|---------|------|
| Hero（100vh） | 全屏背景视频（`/videos/tabletennis.mp4`），160deg 渐变 + radial vignette。红色脉冲点标签。标题 `Table`+红色`Tennis` |
| Net Divider | 球桌中线分隔，模拟乒乓球台 |
| Stats Strip | 4 列红色数字（反应速度 0.18s / 最佳 rally 47 / 球龄 12年 / 俱乐部冠军 3次） |
| Philosophy | 双栏：左 Barlow Condensed 全大写引言（NO TIME. NO HESITATION. ONLY THE NEXT POINT.），右中文正文 |
| Legends | 张继科 + 马龙 双栏致敬卡片，16:9 宽图，含中文引用 |
| Gallery | 3 列乒乓球摄影（Unsplash） |
| Closing | 居中大写结语 |

**返回按钮：** `position: fixed; top: 92px; left: 36px`，hover 变红

---

## 四、数据层（Mock → 真实 API 过渡）

### lib/travel/types.ts

核心类型：`TravelYear`、`TravelTrip`、`TravelChapter`

关键字段（`TravelChapter`）：`num`、`name`、`dateLabel`、`bg`、`textColor`、`accent`、`tintColor`、`coverImg`、`coverGrad`、`photos[]`、`chinese`、`quote`、`spots[]`、`tags`、`coords`、`time`、`locationCn`、`contactSheet`、`totalExp`、`pageNum`、`region`、`country`、`area`

### lib/travel/api.ts

```typescript
getTravelYears(): Promise<TravelYear[]>
getTravelTrip(year, tripId): Promise<TravelTrip | null>
```

**注意：** 后端返回 `{"code": 0, "data": null}` 时（API 未实现），自动 fallback 到 mock 数据。判断条件为 `res.data !== null && res.data !== undefined`，避免 0/false 被误判。

### lib/travel/mock-data.ts

目前有 1 条完整 mock 数据：`bali2026`（巴厘岛旅行，含 5 个章节，每章节 3 张 Unsplash 图片）

---

## 五、TSX 编写注意事项（避坑指南）

> 这些是在开发过程中踩过的坑，AI 接手时必读。

1. **不要用 Write 工具直接写包含反引号的 TSX 文件** — 会被截断。改用 Python bash 脚本写文件：
   ```bash
   python3 -c "
   content = '...'
   with open('...path...', 'w', encoding='utf-8') as f:
       f.write(content)
   "
   ```

2. **CSS 用字符串数组 `CSS_LINES = [...]` + `CSS_LINES.join('\n')`** — 不要用 template literals 包整块 CSS，会被 TSX parser 误读

3. **Record<> 泛型** 在某些版本会被 TSC 误解，改用 `{ [key: string]: string }`

4. **JSX 里字符串拼接用 `+` 而非 template literal** — 避免嵌套 `${}` 触发解析器问题：
   ```tsx
   // 好：
   className={'card-float-' + card.floatIdx}
   // 避免：
   className={`card-float-${card.floatIdx}`}
   ```

5. **TSC 错误区分：**
   - `TS17008 / TS1005`（Parser 级）= 文件结构真的有问题，需修复
   - `TS2307 / TS7026`（Module 级）= 项目级预存问题（无 @types/react），Next.js/SWC 仍能正常编译

6. **文件写完后用 Python 验证行数和末尾内容**，不要只看 Read 工具的缓存

---

## 六、全局交互特效（已实现 ✅）

### 6.1 鼠标点击烟花 ✦
`components/click-spark.tsx` — 已在 `app/layout.tsx` 接入，暖色火花 `#E8855A`

### 6.2 Lenis 平滑滚动
`components/lenis-provider.tsx` — 已在 `app/layout.tsx` 接入，全局平滑滚动

### 6.3 背景动画
`components/background-animations.tsx` — 已在 `app/layout.tsx` 接入

### 6.4 右下角 Pixar 风格吉祥物
`components/pixar-character.tsx` — 已在 `app/layout.tsx` 接入

### 6.5 Hover 音效 + 点击音效
纯 Web Audio API，`hooks/use-sound.ts` — 导航栏已调用

---

## 七、字体 & 颜色方案

### 旅行 / About 页（暖色系）
- **Barlow Condensed** 700/800/900 — 大标题
- **Barlow** 300/400/500 — 正文
- **Caveat** 400/600/700 — 手写感副标题
- **Playfair Display** italic — Hobby 页卡片标题、引言
- **Noto Serif SC** — 中文

### 日记页
- **Space Mono** — 主字体（代码/胶卷感）
- **Barlow Condensed** — 章节大名
- **Caveat** — tags、quote

### 暖色系调色板（About / Travel）
```css
--warm-bg:      #FDF6EE   /* 米色背景 */
--warm-dark:    #2E1A0E   /* 深棕 */
--warm-accent:  #C45A30   /* 橙红 */
--warm-mid:     #B07050   /* 中棕 */
--warm-light:   #E8C9B0   /* 浅棕边框 */
```

---

## 八、RuoYi 后端模块（已实现）

`yudao-module-ip` 模块已创建，包含 8 张表：
- `ip_article` — 文章
- `ip_travel_diary` — 旅行日记（旧版）
- `ip_travel_trip` + `ip_travel_chapter` + `ip_travel_photo` — 旅行行程/章节/照片（新版，DO/Controller/Service/VO 已完整实现）
- `ip_thought` — 随想
- `ip_project` — 项目
- `ip_team_member` — 团队成员

> Travel 三张表 SQL：`personal-ip-backend/sql/travel_tables.sql`
> 菜单 SQL：`personal-ip-backend/sql/system_menu_ip.sql`（ID 5000-5049）

公开 API 端点前缀：`/app-api/ip/`（前台）/ `/ip/`（管理后台）

管理后台入口：系统管理 → IP 内容管理（已创建菜单，含 trip + chapter 子管理页）

---

## 九、开发进度

> 最后更新：2026-05-28。优先顺序：About 子页 → Projects/Blog/Thoughts → 前后端 API 对接。

```
Phase 1（基础）：
  ✅ 后端环境搭建（Spring Boot 3.5.9 + Java 17）
  ✅ 初始化 Next.js 前端项目（Next.js 14 + React 19 + TypeScript + Tailwind）
  ✅ 创建 yudao-module-ip 业务模块（5张表 + CRUD + 公开API）
  ✅ 管理后台菜单（IP内容管理入口，SQL: system_menu_ip.sql）
  ✅ 管理后台 Vue 页面（src/views/ip/ 下 5 个模块）

Phase 2（核心页面）：
  ✅ /travel 年份浮动卡片页（暖色系浮动动画，buildCss.ts 分离方案）
  ✅ /travel/[year] 年份列表页
  ✅ /travel/[year]/[tripId] 日记详情页（bali2026 胶卷风格，已修复 Rules of Hooks）
  ✅ /about Bento Grid Hub 页
  ✅ /about/hobby Hobby 子页（全黑暗调，Playfair Display）
  ✅ /about/hobby/running Running 详情页（视频Hero + 数据统计 + 理念）
  ✅ /about/hobby/table-tennis Table Tennis 详情页（深绿+白+红，对抗风格）
  ⬜ /about/story、/about/tech、/about/career（占位路由存在，内容待实现）
  ⬜ 首页 / Hero（框架存在，内容待完善）
  ⬜ /projects 项目展示页

Phase 3（交互特效）：
  ⬜ 全局 ClickSpark（click-spark.tsx 已存在，未接入 layout）
  ⬜ 音效系统（hooks/use-sound.ts 待创建）
  ⬜ Lenis 平滑滚动（lenis-provider.tsx 已存在，未接入 layout）
  ⬜ 背景动画（background-animations.tsx 已存在）
  ⬜ 右下角吉祥物小人（pixar-character.tsx 已存在）

Phase 4（内容模块 & 后端对接）：
  ⬜ Travel 后端 3 张表（ip_travel_trip / ip_travel_chapter / ip_travel_photo）
  ⬜ Travel 后端 CRUD（Java DO/Controller/Service/Mapper/VO）
  ⬜ Travel 管理后台菜单 + Vue 页面
  ⬜ 前端 lib/travel/api.ts 对接真实 API（当前 mock 兜底）
  ⬜ /thoughts 随想碎片页
  ⬜ /blog 博客列表 + 详情

Phase 5（全站统一 & 上线准备）：
  ⬜ 全站暖色系切换（方案 B：#FDF6EE 底色，Travel 已用，其他页待统一）
  ⬜ SEO 优化
  ⬜ 部署配置

Phase 6（AI 集成）：
  ⬜ 预留，后续实现
```

---

## 十、待办 & 注意事项

1. **About 子页（Story / Tech / Career）** — 路由存在，点击会 404，需实现页面内容
2. **后端 Travel API 对接** — `lib/travel/api.ts` 已有 fallback 逻辑，后端 API 上线后直接生效
3. **全局特效组件** — 已全部在 `app/layout.tsx` 中引入，无需额外操作
4. **About 页 hobby-dot CSS 类** 已定义但 JSX 中未使用，可清理
5. **旅行 mock-data** 只有 bali2026，后续新增旅行需在 `mock-data.ts` 添加数据

---

## 十一、不采用的设计决策

| 特性 | 排除原因 |
|------|----------|
| 所有模块在同一单页滚动 | 难以扩展，SEO 差 |
| Halo CMS | 已决定用 RuoYi 统一管理 |
| Now Page | 归入 Thoughts 模块 |
