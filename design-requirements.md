# 个人 IP 网站 — 前端设计需求文档

> 文档路径：`D:\UserData\idea\personal-ip\design-requirements.md`
> 最后更新：2026-05-26

---

## 一、整体架构原则

| 原则 | 说明 |
|------|------|
| **模块化 / 低耦合** | 每个页面是独立路由，不做单页全滚动（不学 brutalist-void / energy-drink 那种把所有内容堆一页的方式） |
| **高内聚** | 旅行日记、随想、项目展示各自是独立模块，组件只关心自身逻辑 |
| **后续扩展友好** | 新增模块只需增加路由 + 对应 API，无需改动其他页面 |
| **SEO 友好** | Next.js App Router + Server Components，关键内容 SSR/SSG |
| **统一后台** | 所有内容由芋道管理系统（RuoYi-Vue-Pro）统一管理 |

---

## 二、导航栏 & 路由规划

导航栏固定顶部，各模块**各自独立页面**，不在一个滚动页面堆叠。

```
/                  首页（Hero + 简介摘要入口）
/about             关于我（个人介绍、技能、团队）
/projects          项目展示
/travel            旅行日记（直接复用 bali2026.html 设计语言）
/thoughts          随想碎片
/blog              博客文章
```

导航栏组件（`components/layout/Navbar.tsx`）维护路由列表，增删路由只改这一个文件。

---

## 三、全局交互特效（所有页面共享）

### 3.1 鼠标点击烟花 ✦

**来源参考：** `modern-gen-z-energy-drink-landing-page/components/click-spark.tsx`

**实现方式：** Canvas 覆盖层，全局监听 `click` 事件，在点击坐标处向 8 个方向辐射发散短线段，`ease-out` 400ms 消散。无外部依赖，纯 Canvas + `requestAnimationFrame`。

**集成方案：**
```tsx
// app/layout.tsx 根布局包裹
<ClickSpark sparkColor="#your-accent" sparkCount={8} sparkRadius={20}>
  {children}
</ClickSpark>
```

**可调参数：** `sparkColor`（跟随主题色）、`sparkCount`、`sparkRadius`、`duration`、`easing`

---

### 3.2 Hover 音效 + 点击音效 🔊

**来源参考：** `portfolio-website-design/hooks/use-sound.ts` + `lib/sound-data.ts`

**实现方式：** 纯 **Web Audio API**，无需任何音频文件。`SoundPlayer` 类用 `AudioContext` + `OscillatorNode` 实时合成：
- `playPop()`：800 Hz 正弦波，100ms，指数衰减 → 元素点击/选中
- `playHover()`：600 Hz 正弦波，50ms，快速衰减 → 鼠标悬停模块

**集成方案：** 封装 `useSound()` Hook，在需要音效的组件调用：
```tsx
const { playSound } = useSound()
<Card onMouseEnter={() => playSound('hover')} onClick={() => playSound('pop')} />
```

**注意：** `AudioContext` 需用户首次交互后才能启动（浏览器安全策略），首次点击页面时初始化即可。

---

### 3.3 Lenis 平滑滚动 🌊

**来源参考：** `modern-gen-z-energy-drink-landing-page/components/lenis-provider.tsx`

**实现方式：** `lenis/react` 的 `ReactLenis` 根 Provider，`lerp: 0.1`，`duration: 1.2`，惯性顺滑。

```tsx
// app/layout.tsx
<LenisProvider>
  {children}
</LenisProvider>
```

---

### 3.4 底部生长小树（背景动画）🌿

**来源参考：** `portfolio-website-design/components/background-animations.tsx`

**实现方式：** 全屏固定 Canvas，`mixBlendMode: screen`，不影响交互（`pointer-events: none`）。包含三层：
1. **星点** — 100 个随机星点，opacity 缓慢闪烁（twinkle）
2. **流星** — 每 3~5 秒随机生成一条带渐变尾迹的斜线流星
3. **小树/植物** — 底部边缘生长，**随页面向下滚动而生长，向上滚动而凋零**。3 种形态：简单叶片、圆形叶片、顶部开花

**适配个人 IP 风格：** 可将颜色从 `rgba(139,154,126,...)` 改为主题色系。

---

## 四、首页（`/`）设计

### 4.1 Hero — 视频背景 + 滚动缩放

**来源参考：** `homie-template/components/hero-section.tsx`

**实现方式：** 这不是简单的 MP4 背景，而是**滚动驱动的 CSS 变换**：

```
scroll 0%  → scale(1.0)   borderRadius(0px)   height(100vh)
scroll 100% → scale(0.85) borderRadius(48px)  height(62.5vh)
```

用 `requestAnimationFrame` + lerp(0.1) 做平滑追踪，比 Framer Motion 更轻量。大号字幕（28vw）在滚动时向下位移并淡出。

**个人 IP 定制：** 将视频替换为本人拍摄的城市/旅行素材，字幕改为本人名字。

---

### 4.2 3D 线框球体（SentientSphere）

**来源参考：** `brutalist-void-portfolio-template/components/sentient-sphere.tsx`

**实现方式：** Three.js + React Three Fiber，`IcosahedronGeometry`(detail=12) + 自定义 GLSL Vertex Shader，Simplex Noise 驱动顶点位移，线框渲染（`wireframe: true`），鼠标位置影响旋转速度。

球体叠加在 Hero 视频层上方，作为视觉焦点。

---

### 4.3 右下角吉祥物小人 👋

**来源参考：** `portfolio-website-design/components/pixar-character.tsx`

**实现方式：** 纯 SVG + Framer Motion，**非** 3D 模型。绿色 blob 风格小人，左臂持续摆动（`rotate: [-5°, 5°]`循环），眼球左右游移，气泡说 "Hello! 👋"。

**出现时机（可配置）：**
- 首次加载 2 秒后弹出，5 秒后收回
- 页面滚动至 25%、50%、75% 时再次弹出 4 秒

**固定位置：** `fixed bottom-8 right-8 z-[100]`，Spring 弹性入场动画

**个人化建议：** 可将颜色改为主题色，台词改为中英双语交替。

---

### 4.4 关于我摘要 + 入口卡片

- 简短自我介绍（3~4 句）
- Bento 入口卡（3D 倾斜效果，参考 energy-drink bento-grid）
- 技术栈 marquee 滚动条（参考 brutalist-void tech-marquee）

---

## 五、旅行日记（`/travel`）

**直接采用 `bali2026.html` 的完整设计语言：**

- Film strip 胶卷排版，每章节不同 accent color
- 中英混排 CJK/Latin 双语排版
- 章节导航侧边栏
- 章节切换时背景色渐变过渡

后端内容由 RuoYi 的 `ip_travel_diary` 表驱动（见第七章）。

---

## 六、项目展示（`/projects`）

**参考：** `brutalist-void-portfolio-template/components/works.tsx`

- 项目列表悬停 → 浮动预览图随鼠标移动（Spring 跟随动画）
- 点击进入项目详情页（独立路由 `/projects/[slug]`）
- 详情页使用 evasion-template 的 sticky bento 展开动画

---

## 七、RuoYi 后端内容模块规划

以下为需在芋道框架内新建的业务模块，统一放在 `yudao-module-ip` 中。

### 7.1 文章（ip_article）

```sql
CREATE TABLE ip_article (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  title       VARCHAR(200) NOT NULL COMMENT '标题',
  slug        VARCHAR(200) UNIQUE COMMENT 'URL slug',
  cover_url   VARCHAR(500) COMMENT '封面图',
  summary     VARCHAR(500) COMMENT '摘要',
  content     LONGTEXT     COMMENT 'Markdown 正文',
  tags        VARCHAR(200) COMMENT '标签，逗号分隔',
  category    VARCHAR(50)  COMMENT '分类',
  status      TINYINT DEFAULT 0 COMMENT '0草稿 1发布',
  pinned      TINYINT DEFAULT 0 COMMENT '是否置顶',
  view_count  INT DEFAULT 0,
  creator     VARCHAR(64),
  create_time DATETIME,
  updater     VARCHAR(64),
  update_time DATETIME,
  deleted     TINYINT DEFAULT 0
);
```

---

### 7.2 旅行日记（ip_travel_diary）

```sql
CREATE TABLE ip_travel_diary (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  title        VARCHAR(200) NOT NULL COMMENT '章节标题',
  destination  VARCHAR(100) COMMENT '目的地',
  trip_date    DATE         COMMENT '旅行日期',
  cover_url    VARCHAR(500) COMMENT '封面',
  accent_color VARCHAR(20)  COMMENT '章节主题色 eg #FF6B35',
  content      LONGTEXT     COMMENT 'Markdown 正文（支持多媒体）',
  photos       JSON         COMMENT '图片 URL 数组',
  sort_order   INT DEFAULT 0 COMMENT '排序',
  status       TINYINT DEFAULT 0,
  creator      VARCHAR(64),
  create_time  DATETIME,
  updater      VARCHAR(64),
  update_time  DATETIME,
  deleted      TINYINT DEFAULT 0
);
```

---

### 7.3 随想碎片（ip_thought）

```sql
CREATE TABLE ip_thought (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  content     VARCHAR(1000) NOT NULL COMMENT '正文（短文本）',
  mood        VARCHAR(20)   COMMENT '心情标签',
  tags        VARCHAR(200),
  image_url   VARCHAR(500)  COMMENT '可选配图',
  status      TINYINT DEFAULT 0,
  creator     VARCHAR(64),
  create_time DATETIME,
  updater     VARCHAR(64),
  update_time DATETIME,
  deleted     TINYINT DEFAULT 0
);
```

---

### 7.4 项目展示（ip_project）

```sql
CREATE TABLE ip_project (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  slug         VARCHAR(100) UNIQUE,
  description  VARCHAR(500),
  cover_url    VARCHAR(500),
  preview_url  VARCHAR(500) COMMENT '悬浮预览图',
  github_url   VARCHAR(300),
  demo_url     VARCHAR(300),
  tech_stack   VARCHAR(300) COMMENT '技术栈，逗号分隔',
  content      LONGTEXT     COMMENT '详情 Markdown',
  sort_order   INT DEFAULT 0,
  featured     TINYINT DEFAULT 0 COMMENT '是否在首页展示',
  status       TINYINT DEFAULT 0,
  creator      VARCHAR(64),
  create_time  DATETIME,
  updater      VARCHAR(64),
  update_time  DATETIME,
  deleted      TINYINT DEFAULT 0
);
```

---

### 7.5 团队成员（ip_team_member）

```sql
CREATE TABLE ip_team_member (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  role         VARCHAR(100) COMMENT '职位/身份',
  avatar_url   VARCHAR(500),
  bio          VARCHAR(500),
  github_url   VARCHAR(300),
  linkedin_url VARCHAR(300),
  sort_order   INT DEFAULT 0,
  status       TINYINT DEFAULT 1,
  creator      VARCHAR(64),
  create_time  DATETIME,
  updater      VARCHAR(64),
  update_time  DATETIME,
  deleted      TINYINT DEFAULT 0
);
```

---

### 7.6 API 接口规划（公开端点）

```
GET  /app-api/ip/article/page          文章分页列表
GET  /app-api/ip/article/{slug}        文章详情
GET  /app-api/ip/travel/list           旅行日记列表
GET  /app-api/ip/travel/{id}           旅行日记详情
GET  /app-api/ip/thought/page          随想分页
GET  /app-api/ip/project/list          项目列表
GET  /app-api/ip/project/{slug}        项目详情
GET  /app-api/ip/team/list             团队成员列表
```

---

## 八、字体 & 颜色方案

### 字体栈（与之前设计语言一致）

| 用途 | 字体 | CDN |
|------|------|-----|
| 大标题 Display | Barlow Condensed 700 | Google Fonts |
| 正文 Body | Playfair Display 400/700 | Google Fonts |
| 标签 Label | Geist Mono 400 | Google Fonts |
| 手写感 | Caveat 600 | Google Fonts |
| 中文 | Noto Serif SC | Google Fonts |

### 主题色（待最终确认）

```css
--color-bg:      #0a0a0a    /* 深黑底 */
--color-surface: #141414    /* 卡片底 */
--color-accent:  #AFFF00    /* 荧光绿（参考 energy-drink）*/
--color-text:    #f0f0f0
--color-muted:   #888
```

---

## 九、技术依赖汇总

```json
{
  "core": ["next", "react", "typescript"],
  "3d": ["three", "@react-three/fiber", "@react-three/drei"],
  "animation": ["framer-motion", "lenis"],
  "styling": ["tailwindcss", "clsx", "tailwind-merge"],
  "ui": ["shadcn/ui"],
  "audio": "Web Audio API (no package needed)"
}
```

---

## 十、不采用的设计决策（明确排除）

| 模板特性 | 排除原因 |
|----------|----------|
| 所有模块在同一单页滚动 | 难以扩展，耦合度高，SEO 差 |
| Halo CMS | 已决定用 RuoYi 统一管理 |
| 复杂 3D 商业场景（evasion 的 bento 展开）| 可选做，不是必须 |

---

## 十一、开发优先级

```
Phase 1（基础）：
  ✅ 后端环境搭建（已完成）
  ⬜ 初始化 Next.js 前端项目
  ⬜ 创建 yudao-module-ip 业务模块
  ⬜ 实现 5 张表 + CRUD + 公开 API

Phase 2（核心页面）：
  ⬜ 首页 Hero（视频 + SentientSphere）
  ⬜ 旅行日记页（bali2026 风格）
  ⬜ 项目展示页

Phase 3（交互特效）：
  ⬜ 全局 ClickSpark（烟花点击效果）
  ⬜ 音效系统（hover/click）
  ⬜ Lenis 平滑滚动
  ⬜ 背景动画（星空 + 小树）
  ⬜ 右下角吉祥物小人

Phase 4（内容模块）：
  ⬜ 随想、博客、关于我、团队

Phase 5（AI 集成）：
  ⬜ 预留，后续实现
```
