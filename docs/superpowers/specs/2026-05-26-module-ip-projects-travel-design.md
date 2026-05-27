# 设计规格：yudao-module-ip — Projects & Travel Diary

**日期：** 2026-05-26
**范围：** 项目展示（Projects）+ 旅行日记（Travel Diary）全栈实现
**状态：** 已批准，待实现

---

## 一、背景与目标

在个人 IP 网站中优先打通两个核心内容模块：
- **Projects**：展示技术项目，面向招聘方/合作者，需要悬浮预览、详情页、技术标签
- **Travel Diary**：展示旅行经历，bali2026.html 风格，每章节独立主题色，胶卷相册

**成功标准：**
- 浏览器可以访问 `/projects` 和 `/travel`，展示来自 RuoYi 后端的真实数据
- 管理员可在芋道后台新增/编辑/删除内容，前端实时反映

---

## 二、整体架构

```
personal-ip-backend/
└── yudao-module-ip/
    ├── yudao-module-ip-api/    ← VO、DTO、枚举、接口常量
    └── yudao-module-ip-biz/    ← Controller、Service、Mapper、DO

personal-ip-frontend/           ← 基于 portfolio-website-design 复制
├── app/
│   ├── projects/page.tsx       ← 项目列表（SSG）
│   ├── projects/[slug]/page.tsx ← 项目详情（SSR）
│   └── travel/page.tsx         ← 旅行日记列表（SSG）
│   └── travel/[id]/page.tsx    ← 单篇日记（SSR）
├── components/
│   ├── layout/Navbar.tsx
│   ├── projects/
│   └── travel/
└── lib/api/
    ├── projects.ts
    └── travel.ts
```

**数据流：**
```
浏览器 → Next.js SSR/SSG → RuoYi 公开 API (localhost:48080) → MySQL
```

---

## 三、实现策略

**方案三：功能纵切（已选定）**
```
① yudao-module-ip Maven 骨架
② ip_project 建表 → 代码生成 → 手动精简 → 公开 API
③ 前端初始化 + Projects 页面接真实数据
④ ip_travel_diary 建表 → 代码生成 → 手动精简 → 公开 API
⑤ Travel Diary 页面（Tailwind + Framer Motion）
```

---

## 四、数据库表结构

### ip_project

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| name | VARCHAR(100) | 项目名称 |
| slug | VARCHAR(100) UNIQUE | URL 标识符 |
| description | VARCHAR(500) | 简短描述 |
| cover_url | VARCHAR(500) | 封面图 URL |
| preview_url | VARCHAR(500) | 悬浮预览图 URL |
| github_url | VARCHAR(300) | GitHub 链接 |
| demo_url | VARCHAR(300) | 演示链接 |
| tech_stack | VARCHAR(300) | 技术栈，逗号分隔 |
| content | LONGTEXT | Markdown 详情正文 |
| sort_order | INT DEFAULT 0 | 排序权重 |
| featured | TINYINT DEFAULT 0 | 是否首页置顶 |
| status | TINYINT DEFAULT 0 | 0=草稿 1=发布 |
| creator / create_time / updater / update_time / deleted | — | 芋道标准审计字段 |

### ip_travel_diary

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 自增主键 |
| title | VARCHAR(200) | 章节标题 |
| destination | VARCHAR(100) | 目的地 |
| trip_date | DATE | 旅行日期 |
| cover_url | VARCHAR(500) | 封面图 URL |
| accent_color | VARCHAR(20) | 章节主题色，如 #FF6B35 |
| content | LONGTEXT | Markdown 正文 |
| photos | JSON | 图片 URL 数组 |
| sort_order | INT DEFAULT 0 | 章节排序 |
| status | TINYINT DEFAULT 0 | 0=草稿 1=发布 |
| creator / create_time / updater / update_time / deleted | — | 芋道标准审计字段 |

---

## 五、API 接口

### 公开端点（无需 Token）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /app-api/ip/project/list | 项目列表，featured 优先排序 |
| GET | /app-api/ip/project/{slug} | 项目详情 |
| GET | /app-api/ip/travel/list | 旅行日记列表，按 sort_order |
| GET | /app-api/ip/travel/{id} | 单篇日记详情 |

### 管理端（需 Token，芋道代码生成器自动生成）

```
/admin-api/ip/project/create   POST
/admin-api/ip/project/update   PUT
/admin-api/ip/project/delete   DELETE
/admin-api/ip/project/page     GET（分页）
/admin-api/ip/travel/create    POST
/admin-api/ip/travel/update    PUT
/admin-api/ip/travel/delete    DELETE
/admin-api/ip/travel/page      GET（分页）
```

---

## 六、前端页面设计

### Projects 列表页 `/projects`

- 渲染方式：SSG（`generateStaticParams` + `revalidate: 3600`）
- 组件：`ProjectList` → `ProjectCard × N`
- 交互：鼠标悬浮时 `preview_url` 图片跟随鼠标（Framer Motion spring）
- 音效：hover 时 `playSound('hover')`，点击时 `playSound('pop')`

### Projects 详情页 `/projects/[slug]`

- 渲染方式：SSR
- 组件：封面全宽图、tech_stack 徽章、github/demo 外链按钮、`react-markdown` 正文

### Travel Diary 页 `/travel`

- 渲染方式：SSG
- 组件：`TravelList`（侧边章节导航）+ `DiaryChapter × N`
- 每章节：`accent_color` 驱动背景渐变、`cover_url` 全宽封面、Markdown 正文、`PhotoStrip`（photos[] 胶卷横排，hover 放大）
- 字体：Playfair Display 正文 + Caveat 手写标注 + Noto Serif SC 中文

### 全局层（继承自模板，不修改）

| 组件 | 功能 |
|------|------|
| LenisProvider | 全局平滑滚动 |
| ClickSpark | 全局点击烟花 |
| BackgroundAnimations | 星空 + 流星 + 生长小树 Canvas |
| PixarCharacter | 右下角挥手小人 |
| Navbar | 固定顶部导航，独立路由 |

---

## 七、图片存储策略

- **开发阶段**：RuoYi 本地存储（`/admin-api/infra/file/upload`），文件存服务器本地目录
- **接口设计**：所有图片字段只存 URL 字符串，与存储后端解耦
- **生产阶段**：替换为阿里云 OSS 或 MinIO，只改 RuoYi 存储配置，代码不动

---

## 八、不在本次范围内

- 文章（ip_article）、随想（ip_thought）、团队成员（ip_team_member）— Phase 2
- AI 集成 — Phase 5
- 评论系统
- 搜索功能
- 深色/浅色主题切换
