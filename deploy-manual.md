# Personal IP — 前端部署手册

> 适用：Ubuntu 22.04 LTS · Alibaba Cloud ECS  
> 项目：`personal-ip-frontend`（Next.js 16 + React 19 + pnpm）  
> 部署目录：`/opt/personal-ip-frontend`

---

## 概览

```
浏览器 → Nginx (:80/443) → localhost:3000 → Next.js (PM2)
```

| 组件 | 用途 |
|------|------|
| Nginx 1.24 | 反向代理 + 静态资源缓存 + SSL 终结 |
| PM2 | 进程守护、自动重启 |
| pnpm | 包管理（与本地一致，避免 lockfile 冲突） |
| Node.js 20 LTS | 运行时 |

---

## 一、服务器初始化

```bash
ssh root@<你的ECS公网IP>
```

> 新服务器建议先 `apt update && apt upgrade -y`；已运行的跳过。

---

## 二、安装依赖

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# pnpm
npm install -g pnpm

# Nginx
apt install -y nginx
systemctl enable --now nginx

# PM2
npm install -g pm2
```

---

## 三、首次部署

> 策略：本地构建，直接上传到服务器 `/opt/personal-ip-frontend`，不依赖服务器拉取 GitHub。  
> 只上传 frontend，admin / backend 不上传。

### 3.1 本地构建

在本地 PowerShell 执行：

```powershell
cd D:\UserData\idea\personal-ip\personal-ip-frontend
pnpm install
pnpm build
```

构建完成后，需要上传的文件/目录如下（其余不需要）：

```
personal-ip-frontend/
├── .next/          ← 构建产物（必传）
├── public/         ← 静态资源（必传）
├── package.json    ← 依赖声明（必传）
└── pnpm-lock.yaml  ← 锁文件（必传）
```

> `node_modules/` 和 `src/` 不需要上传，服务器会自行安装。

### 3.2 上传文件（面板文件管理器）

先在服务器创建目录：

```bash
mkdir -p /opt/personal-ip-frontend
```

1. 打开服务器面板的文件管理器，导航到 `/opt/personal-ip-frontend`
3. 进入该文件夹，点击上传，选择以下内容逐一上传：

```
# 需要上传的路径（本地 personal-ip-frontend 目录下）
.next/          → 选择整个文件夹上传
public/         → 选择整个文件夹上传
package.json    → 单个文件
pnpm-lock.yaml  → 单个文件
```

> **注意**：`.next/` 以 `.` 开头，Windows 资源管理器默认不显示隐藏文件夹。  
> 需在资源管理器 → 查看 → 勾选「显示隐藏的项目」才能看到并选中它。

### 3.3 服务器端初始化

```bash
# 安装 unzip（没装过的话）
apt install -y unzip

cd /opt/personal-ip-frontend

# 解压上传的压缩包
unzip .next.zip
unzip public.zip

# 验证解压结果（-a 才能看到 .next 这类隐藏目录）
ls -la
```

应看到 `.next/`、`public/`、`package.json`、`pnpm-lock.yaml` 四项。

> 如果解压后**没有 `.next/` 目录**（说明压缩时打包的是文件夹内容而非文件夹本身），用以下命令补救：
> ```bash
> mkdir -p .next && unzip .next.zip -d .next/
> ```

确认目录结构正确后，删除 zip 文件释放空间：

```bash
rm .next.zip public.zip
```

继续初始化：

```bash
# 写入环境变量（后端暂未部署，先占位）
echo 'NEXT_PUBLIC_API_BASE=http://localhost:48080' > .env.local

# 安装生产依赖（只装 dependencies，跳过 devDependencies）
pnpm install --prod --frozen-lockfile

# PM2 启动
pm2 start pnpm --name "personal-ip" -- start
pm2 startup systemd && pm2 save
```

验证：`curl http://localhost:3000` 返回 HTML 即成功。

---

## 四、Nginx 反向代理

```bash
tee /etc/nginx/sites-available/personal-ip << 'EOF'
server {
    listen 80;
    server_name _;

    client_max_body_size 50m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/personal-ip /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## 五、SSL 证书（有域名时）

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d <你的域名>
certbot renew --dry-run
```

---

## 六、持续更新流程

每次改完代码，本地构建后上传覆盖即可，约 1~2 分钟。

### 步骤

**① 本地构建（PowerShell）**

```powershell
cd D:\UserData\idea\personal-ip\personal-ip-frontend
pnpm build
```

**② 面板文件管理器覆盖上传**

1. 进入 `/opt/personal-ip-frontend`
2. 删除旧的 `.next/` 文件夹
3. 重新上传本地新构建的 `.next/`
4. `public/` 有改动时同理覆盖上传

**③ 服务器重启（SSH 执行一行）**

```bash
cd /opt/personal-ip-frontend && pm2 restart personal-ip
```

> `package.json` / `pnpm-lock.yaml` 有变化时（新增或删除了依赖），重启前多执行一步：
> ```bash
> pnpm install --prod --frozen-lockfile
> ```

---

## 七、常用运维命令

```bash
pm2 status                    # 查看进程状态
pm2 logs personal-ip          # 查看日志
pm2 restart personal-ip       # 重启
nginx -t                      # 检查 Nginx 配置
systemctl reload nginx        # 重载 Nginx
```

---

## 八、防火墙

阿里云安全组（入方向）开放 **22、80、443**，**不要**开放 3000。

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 九、故障排查

| 现象 | 检查命令 |
|------|---------|
| 网站打不开 | `pm2 status`；`curl http://127.0.0.1:3000` |
| Nginx 502 | `pm2 logs personal-ip` |
| 构建失败 | 检查本地 `pnpm build` 报错 |
| 内存不足 | `fallocate -l 2G /swapfile && mkswap /swapfile && swapon /swapfile` |
| 页面没更新 | 浏览器强刷 Ctrl+Shift+R；或 `pm2 restart personal-ip` |
