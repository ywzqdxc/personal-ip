# personal-ip-frontend

崔鑫个人 IP 展示网站前端，基于 Next.js 14 + TypeScript + Tailwind CSS 构建。

## 技术栈

- **框架**：Next.js 14（App Router）
- **语言**：TypeScript
- **样式**：Tailwind CSS + shadcn/ui
- **包管理**：pnpm
- **运行环境**：Node.js 18+

## 目录结构

```
personal-ip-frontend/
├── app/                    # 页面路由（Next.js App Router）
│   ├── page.tsx            # 首页
│   ├── about/              # 关于页
│   ├── blog/               # 博客列表 & 详情
│   ├── projects/           # 项目列表 & 详情
│   ├── thoughts/           # 随想页
│   ├── travel/             # 旅行页
│   └── api/                # API 路由
├── components/             # 通用组件
│   ├── ui/                 # shadcn/ui 基础组件
│   └── *.tsx               # 业务组件（导航、Hero、时间线等）
├── lib/                    # 工具函数 & API 封装
│   ├── api/                # 后端接口调用（文章、项目、旅行等）
│   └── utils.ts            # 通用工具函数
├── data/                   # 本地静态数据
│   ├── projects.json       # 项目数据
│   └── timeline.json       # 时间线数据
├── hooks/                  # 自定义 React Hooks
├── public/                 # 静态资源
│   ├── images/             # 图片
│   └── videos/             # 视频
├── styles/                 # 全局样式
├── next.config.mjs         # Next.js 配置
└── .env.local              # 环境变量（本地，不提交）
```

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认 http://localhost:3000）
pnpm dev
```

## 构建

```bash
# 生产构建
pnpm build

# 启动生产服务（构建后）
pnpm start
```

## 环境变量

复制 `.env.local` 并填写对应值：

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_API_URL` | 后端 API 基础地址 |

## 数据说明

- 博客文章、随想、旅行等动态内容通过 `lib/api/` 调用后端接口获取
- 项目数据支持本地 JSON（`data/projects.json`）与远程接口两种来源
- 时间线数据存于 `data/timeline.json`
