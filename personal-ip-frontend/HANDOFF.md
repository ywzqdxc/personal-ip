# Personal-IP 项目交接文档
> 生成时间：2026-05-27  
> 最后更新：2026-05-27（第二轮 Claude 修复）  
> 下一执行者：DeepSeek / 继续开发

---

## 一、项目结构速览

```
personal-ip/
├── personal-ip-backend/       Spring Boot 3.5.9 + Java17，端口 48080
├── personal-ip-admin/         RuoYi-Vue-Pro 后台管理，端口 80
└── personal-ip-frontend/      Next.js 14 App Router，端口 3000
```

---

## 二、已完成的工作（本轮）

### 2.1 后台管理菜单（Admin）
- **SQL 文件**：`personal-ip-backend/sql/system_menu_ip.sql`
  - 新增 5 个模块的菜单和按钮权限，ID 5000~5044
  - 须手动导入数据库后，在管理后台才能看到对应入口
- **Vue 页面**：`personal-ip-admin/src/views/ip/` 下 5 个模块全部创建
- **Bug 修复**：团队成员 API 路径从 `/ip/team-member/` 修正为 `/ip/team/`

### 2.2 旅行日记前端（Travel — 重点）

路由结构：
```
/travel                   → 年份选择页（浮动动效，点一下逃跑，再点进入）
/travel/[year]            → 该年旅行列表（多行程才显示，单行程直接跳转）
/travel/[year]/[tripId]   → 日记正文页（完整复刻 bali2026.html 黑胶风格）
```

关键文件：
| 文件 | 说明 |
|------|------|
| `app/travel/page.tsx` | 浮动年份选择，B配色（暖色系） |
| `app/travel/[year]/page.tsx` | 年份内行程卡片 |
| `app/travel/[year]/[tripId]/page.tsx` | **核心**：974行，完整移植 bali2026.html |
| `lib/travel/types.ts` | TypeScript 类型定义（已更新） |
| `lib/travel/mock-data.ts` | 322行，含 Bali2026 / Japan2025 / Europe2024 三年数据 |

**日记页特性（已实现）：**
- 迷你顶栏（位于 site nav 下方 80px 处）：品牌+章节面包屑 / 胶片帧指示器 / PREV·NEXT
- 封面页：左侧大字标题+曲目列表，右侧章节缩略图胶片条
- 章节页：左侧彩色背景+打字机标签+诗句，右侧全屏照片+68px胶片条
- 动效：slideFromLeft / expandWidth / fadeUp / photoReveal / stampAppear 全部保留
- 交互：键盘 ←→ 切章节、↑↓ 翻照片、hover 暂停轮播、点击胶片条跳帧
- 数据驱动：全部从 mock-data.ts 读取，支持任意行程/章节数量

---

## 二点五、本轮（第二轮 Claude）已修复的 Bug

DeepSeek 完成 Task A~B 后引入了以下问题，本轮已全部修复：

| # | 文件 | 问题 | 修复方式 |
|---|------|------|----------|
| 1 | `app/travel/[year]/[tripId]/page.tsx` | **React Rules of Hooks 违规**：DeepSeek 在条件返回 `if (!loaded \|\| !trip) return <Loading />` 之后才调用所有 `useState`/`useRef`/`useEffect`/`useCallback`，运行时必崩 | 拆分为 `TripPage`（数据加载包装层）+ `TripJournal`（所有 hooks 在此，无条件返回前置） |
| 2 | `app/travel/[year]/[tripId]/page.tsx` | `notFound()` 在异步回调 `.then()` 内调用，无法被 Next.js 渲染管道捕获 | 改为 `setIsNotFound(true)` 状态，渲染层判断后显示友好 404 界面 |
| 3 | `app/travel/[year]/page.tsx` | DeepSeek 在文件末尾追加了 400+ 个空字节（null bytes） | Python 脚本清除 |
| 4 | `app/travel/[year]/[tripId]/page.tsx` | `journalCss` 模板字符串截断（末尾动效类和闭合反引号丢失） | 恢复完整动效 CSS |
| 5 | `app/travel/page.tsx` | TSC TSX 解析器因模板字符串+CSS花括号产生级联报错 | 将 CSS 构建函数移至独立 `app/travel/buildCss.ts`（.ts 文件，TSX 解析器不处理），JSX 内样式值改用字符串拼接 |

新增文件：`app/travel/buildCss.ts`（CSS keyframes 生成器，纯 TypeScript）

---

## 三、遗留问题（待下一步处理）

### ❶ ~~TSC 解析警告~~ ✅ 已修复

原 `app/travel/page.tsx` 的 TSC 报错已通过 `buildCss.ts` 分离方案彻底解决。当前 `tsc --noEmit` 对所有 `app/travel/` 下的文件**零报错**。

其余非 travel 文件的 TSC 错误（`app/about`, `app/blog`, `components/background-animations.tsx` 等）为原有遗留问题，不在本轮修复范围。

### ❷ 原 ❶（已跳过）→ 以下为原有待办
**错误**：`TS1005/TS1109` — TypeScript TSX 解析器无法正确处理 `<style>` 内的嵌套模板字符串  
**现状**：Next.js 用 SWC/Babel 编译，此错误不影响 `next dev` 和 `next build`，仅 `tsc --noEmit` 报错  
**修复方法**：

```tsx
// 在 return 之前，把 CSS 提取为变量：
const driftCss = items.map(({ year, pos }) =>
  `@keyframes drift-${year} {
    0%   { transform: translate(0px,0px) rotate(${pos.rot}deg); }
    25%  { transform: translate(${pos.size*0.09}px,${-pos.size*0.07}px) rotate(${pos.rot+0.9}deg); }
    50%  { transform: translate(${-pos.size*0.06}px,${pos.size*0.1}px) rotate(${pos.rot-0.6}deg); }
    75%  { transform: translate(${pos.size*0.08}px,${pos.size*0.06}px) rotate(${pos.rot+0.4}deg); }
    100% { transform: translate(${-pos.size*0.05}px,${-pos.size*0.08}px) rotate(${pos.rot}deg); }
  }`
).join('\n')

const allCss = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500&display=swap');
  ${driftCss}
  @keyframes fadeUp {
    from { opacity:0; transform: translateX(-50%) translateY(8px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }
`

// return 里把 <style>{`...`}</style> 改为：
// <style>{allCss}</style>
```

### ❷ Travel 后端（前端确认 UI 后再做）

mock-data.ts 是纯前端假数据，后端需要新建 3 张表：

```sql
-- 三张表
ip_travel_trip      -- 对应 TravelTrip 类型
ip_travel_chapter   -- 对应 TravelChapter 类型  
ip_travel_photo     -- 章节照片（多对一）
```

对应 Java 实体 / Controller / Service 参考现有 `ip_project` 模块写法，路径前缀用 `/ip/travel/`。

### ❸ 全站暖色系切换（最后做）

现在只有 Travel 用了暖色方案 B（`#FDF6EE` 底色），其他页面还是旧配色。Travel 页面确认满意后，再全站统一。

---

## 四、下一步任务提示词（给 DeepSeek）

---

### 任务 A：修复 TSC 警告

```
项目：personal-ip-frontend（Next.js 14 App Router，TypeScript）
文件：app/travel/page.tsx

问题：该文件尾部 <style> 标签内使用了嵌套模板字符串（template literal inside template literal inside JSX），
导致 tsc --noEmit 报 TS1005/TS1109 解析警告。

要求：
1. 在 return 语句之前，将 CSS 字符串提取为两个普通变量：driftCss（动态 keyframes）和 allCss（完整 CSS）
2. 在 JSX 里改成 <style>{allCss}</style>，不再使用嵌套模板字符串
3. 不改变任何运行时行为和视觉效果
4. 改完后确认 tsc --noEmit 无报错
```

---

### 任务 B：Travel 后端实现

```
项目：personal-ip-backend（Spring Boot 3.5.9，Java 17，RuoYi-Vue-Pro 框架）
模块：yudao-module-ip

现状：
- 前端 Travel 页面已完成，数据来自 personal-ip-frontend/lib/travel/mock-data.ts
- 需要为 travel 功能创建对应的后端 CRUD

任务：

1. 数据库（在 personal-ip-backend/sql/ 下新建 travel_tables.sql）
   建三张表：
   - ip_travel_trip（id, year, title, title_year, subtitle, chinese, tagline,
                    film_label, film_header, dev_credit, side_text, cover_img, accent_color）
   - ip_travel_chapter（id, trip_id, num, name, chinese, region, country, area,
                       bg, text_color, accent, page_num, date_label, time,
                       coords, location_cn, total_exp, contact_sheet, tags,
                       quote, caption, cover_img, cover_grad, tint_color,
                       sort_order）
   - ip_travel_photo（id, chapter_id, url, sort_order）
   每张表都要有 creator/create_time/updater/update_time/deleted/tenant_id 字段（RuoYi 规范）

2. Java 代码（参考 yudao-module-ip/src/main/java/.../ip/project/ 模块写法）
   为 TravelTrip 和 TravelChapter 创建：
   - DO（数据对象）
   - Controller（@RequestMapping("/ip/travel/trip") 和 "/ip/travel/chapter"）
   - Service / ServiceImpl
   - Mapper
   - VO（PageReqVO / PageRespVO / SaveReqVO）
   - Convert（MapStruct）

3. system_menu SQL：在 personal-ip-backend/sql/system_menu_ip.sql 中追加旅行管理的菜单和按钮
   （参考文件里已有的 5000~5044 段）

4. Admin Vue 页面：
   - personal-ip-admin/src/views/ip/travel/trip/index.vue（行程管理）
   - personal-ip-admin/src/views/ip/travel/chapter/index.vue（章节管理，含照片子表）

完成后前端只需把 getTravelTrip() 改成调用 /admin-api/ip/travel/trip/get?year=&tripId= 即可。
```

---

### 任务 C：前端 Travel 对接真实 API

```
项目：personal-ip-frontend（Next.js 14 App Router）
现状：lib/travel/mock-data.ts 是假数据

任务：新建 lib/travel/api.ts，实现以下函数（与 mock-data.ts 导出接口完全一致）：

export async function getTravelYears(): Promise<TravelYear[]>
  → GET /admin-api/ip/travel/year/list

export async function getTravelYear(year: number): Promise<TravelYear | undefined>
  → GET /admin-api/ip/travel/year/get?year=

export async function getTravelTrip(year: number, tripId: string): Promise<TravelTrip | undefined>
  → GET /admin-api/ip/travel/trip/get?year=&tripId=

要求：
- 用 Next.js fetch + revalidate: 3600 做 ISR 缓存
- 保留 lib/travel/mock-data.ts 作为 fallback（API 报错时使用 mock 数据）
- 把 app/travel/page.tsx、app/travel/[year]/page.tsx、app/travel/[year]/[tripId]/page.tsx
  中的 import { getTravelYears/getTravelYear/getTravelTrip } from '@/lib/travel/mock-data'
  全部改成从 '@/lib/travel/api' 引入
```

---

### 任务 D：全站暖色系切换

```
项目：personal-ip-frontend（Next.js 14 App Router）
现状：Travel 模块已经使用暖色方案 B，其他页面用旧配色

方案 B 配色：
  bg:     #FDF6EE  （页面背景）
  text:   #2E1A0E  （正文）
  accent: #E8855A  （橙色强调）
  brick:  #C45A30  （砖红）
  peach:  #F5D0B8  （桃色浅色）
  muted:  #B07050  （辅助文字）
  line:   #E8C9B0  （分割线）

任务：
把以下页面的配色全部替换为方案 B：
- app/page.tsx（首页）
- app/projects/page.tsx
- app/projects/[id]/page.tsx（如有）
- app/thoughts/page.tsx
- app/articles/page.tsx
- components/Navbar.tsx（或 nav 组件）

要求：
- 字体保持 Barlow Condensed / Barlow（已在 Travel 页面引入）
- 导航栏背景改为 #FDF6EE，文字用 #2E1A0E，active/hover 用 #C45A30
- 不改变布局和功能，只改颜色
```

---

## 五、本地开发启动方式

```bash
# 后端（需要 Java 17 + MySQL + Redis）
cd personal-ip-backend
mvn spring-boot:run -pl yudao-server -Dspring.profiles.active=local

# 前端
cd personal-ip-frontend
pnpm dev   # → http://localhost:3000

# 管理后台
cd personal-ip-admin
pnpm dev   # → http://localhost:80（或 pnpm build → dist/）
```

---

*本文档由 Claude (Cowork) 自动生成，供 DeepSeek 接力使用。*
