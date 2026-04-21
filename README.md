# PersonaQuest —— 超级AI大学人格测试

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4-green)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io)

> 一个面向高校学生的四维度人格测试 Web 平台。完成 31 道情境题，解锁你的 16 型人格光谱，生成可分享的个性卡片。

---

## ✨ 核心功能

- **趣味测试** — 31 道校园情境选择题，四维度（E/I · S/N · J/P · A/H）科学计分
- **16 型人格** — 每种人格配有独特像素形象、搞笑解读与四维度光谱条
- **分享卡片** — 一键生成 PNG 结果卡片，适合社交媒体传播
- **测试历史** — 登录后可查看过往所有测试结果与维度变化
- **人格图鉴** — 浏览全部 16 种人格，点击卡片查看详情
- **创作者中心** — 内容创作者可提交新题目与新人格，等待管理员审核
- **管理后台** — 管理员可进行内容审核、题库管理、人格管理与数据统计

---

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### 安装与运行

```bash
# 1. 克隆仓库
git clone <repository-url>
cd personaquest

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 按需修改 .env 中的配置（如 JWT_SECRET）

# 4. 初始化数据库
npm run db:migrate
npm run db:seed

# 5. 启动开发服务器（前后端同时）
npm run dev
```

启动后访问：
- 前端：`http://localhost:5173`
- 后端 API：`http://localhost:3001/api`

### 默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | `admin@example.com` | `admin123` |
| 创作者 | `creator@example.com` | `creator123` |

> ⚠️ 生产环境请务必更换默认密码与 `JWT_SECRET`。

---

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + React Router DOM 7 |
| 构建工具 | Vite 6（客户端）+ TypeScript Compiler（服务端） |
| 样式 | Tailwind CSS v4 |
| 状态管理 | Zustand 5 |
| 图标 | Lucide React |
| 动画 | Framer Motion |
| 后端框架 | Express 4 |
| 数据库 | SQLite（Prisma ORM 6） |
| 认证 | JWT + bcryptjs |
| 运行时 | Node.js，ESM |

---

## 📁 项目结构

```
├── data/                       # 可编辑数据源
│   ├── questions.json          # 题库（31道情境题、选项、分值）
│   └── personalities.json      # 人格库（16型人格定义、描述、像素画）
├── docs/                       # 设计文档
│   ├── question_design.md      # 题库设计稿
│   ├── scoring_criteria.md     # 评分与划分标准
│   └── todo.md                 # 协作任务清单
├── prisma/
│   ├── schema.prisma           # 数据库模型（SQLite）
│   ├── seed.ts                 # 种子脚本：导入 data/*.json
│   └── migrations/             # Prisma 迁移文件
├── src/
│   ├── client/                 # 前端（React + Vite）
│   │   ├── App.tsx             # 路由配置
│   │   ├── pages/              # 页面组件
│   │   ├── components/         # 可复用组件
│   │   ├── stores/             # Zustand 状态管理
│   │   ├── hooks/              # React Hooks
│   │   └── lib/                # 工具与 API 封装
│   ├── server/                 # 后端（Express + Prisma）
│   │   ├── index.ts            # 服务入口
│   │   ├── app.ts              # Express 应用配置
│   │   ├── routes/             # API 路由
│   │   ├── middleware/         # 认证、权限、错误处理
│   │   └── utils/              # PrismaClient 单例
│   └── shared/                 # 前后端共享类型
│       └── types.ts
├── package.json
├── tsconfig.json               # 前端 TS 配置
├── tsconfig.server.json        # 后端 TS 配置
├── vite.config.ts              # Vite 配置
└── .env.example                # 环境变量模板
```

---

## 📝 常用命令

```bash
# 开发模式（前后端同时启动）
npm run dev

# 仅启动前端（Vite，端口 5173）
npm run dev:client

# 仅启动后端（nodemon + tsx，端口 3001）
npm run dev:server

# 数据库迁移（修改 schema.prisma 后执行）
npm run db:migrate

# 生成 Prisma Client
npm run db:generate

# 导入题库与人格数据（修改 data/*.json 后执行）
npm run db:seed

# Prisma Studio（可视化查看/编辑数据库）
npm run db:studio

# 构建生产包（客户端 + 服务端）
npm run build

# 生产环境启动（需先 build）
npm start
```

---

## 🔑 环境变量

复制 `.env.example` 为 `.env` 并根据需要修改：

```env
PORT=3001                           # Express 服务端口号
DATABASE_URL="file:./dev.db"        # SQLite 数据库路径
JWT_SECRET="your-secret-key"        # JWT 签名密钥（生产环境务必更换）
JWT_EXPIRES_IN="7d"                 # Token 有效期
VITE_API_BASE_URL="http://localhost:3001/api"   # 前端 API 基地址
```

---

## 🧪 测试策略

当前项目未配置自动化测试框架。建议后续添加：

- **后端 API**：Vitest + `supertest`
- **前端组件**：Vitest + React Testing Library
- **数据库测试**：独立测试数据库或 Prisma 环境重置方案

---

## 🏗 部署说明

1. 设置环境变量（`.env`）。
2. 执行 `npm run build`：
   - `tsc`（前端类型检查）
   - `vite build`（构建客户端到 `dist/client`）
   - `tsc -p tsconfig.server.json`（编译服务端到 `dist/server`）
3. 执行数据库迁移：`npx prisma migrate deploy`。
4. 执行种子（可选）：`npm run db:seed`。
5. 启动服务：`npm start`（运行 `dist/server/index.js`）。

> **注意**：构建产物中 `dist/client` 为静态前端资源，生产部署时需由外部 Web 服务器（如 Nginx）或 Express 自行托管静态文件。

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/xxx`
3. 提交更改：`git commit -m 'feat: add xxx'`
4. 推送分支：`git push origin feature/xxx`
5. 发起 Pull Request

---

## 📄 许可证

[MIT](LICENSE)

---

> 本项目由 PersonaQuest 团队开发，面向高校学生群体，旨在通过趣味测试探索人格特质。
