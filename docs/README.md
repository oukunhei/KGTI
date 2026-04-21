# 超级AI大学人格测试 — 项目框架文档

> 本文档面向项目 owner（你），帮助你快速理解整个项目的结构、前后端组件和数据流向，以便后续自主决策和修改。

---

## 一、项目概览

这是一个面向港科广学生的 **4 维度人格测试 Web 平台**。学生完成 31 道情境题后，系统会根据四个维度的得分组合出 16 种人格之一，并展示个性化解读。

### 核心流程

```
首页 → 选择测试 → 答题（31题，乱序/正序） → 提交 → 结果页（人格+四维度光谱）
```

---

## 二、目录结构（已整理）

```
D:\KGTI/
├── AGENT.md                    # AI 代理规范（不用管）
├── docs/                       # 📁 文档目录
│   ├── README.md               # ← 你正在看的项目框架文档
│   ├── question_design.md      # 原始题库设计稿
│   ├── scoring_criteria.md     # 评分与划分标准
│   └── todo.md                 # 协作任务清单（双方可编辑）
├── data/                       # 📁 可编辑数据目录（推荐你直接改这里）
│   ├── questions.json          # 题库（31题）
│   └── personalities.json      # 人格库（16型）
├── prisma/
│   ├── schema.prisma           # 数据库模型定义
│   ├── dev.db                  # SQLite 数据库文件
│   └── seed.ts                 # 种子脚本（读取 data/*.json）
├── src/
│   ├── client/                 # ===== 前端（React + Vite） =====
│   │   ├── App.tsx             # 路由配置
│   │   ├── main.tsx            # 前端入口
│   │   ├── pages/              # 页面组件
│   │   │   ├── HomePage.tsx              # 首页（展示模板列表）
│   │   │   ├── TestPage.tsx              # 答题页（核心）
│   │   │   ├── ResultPage.tsx            # 结果页（人格卡片+维度条）
│   │   │   ├── GalleryPage.tsx           # 人格图鉴（16宫格）
│   │   │   ├── LoginPage.tsx             # 登录
│   │   │   ├── RegisterPage.tsx          # 注册
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx    # 管理后台首页
│   │   │   │   ├── QuestionManager.tsx   # 题目管理
│   │   │   │   └── PersonalityManager.tsx # 人格管理
│   │   │   └── creator/
│   │   │       ├── CreatorDashboard.tsx  # 创作者中心
│   │   │       └── SubmitPage.tsx        # 提交审核页
│   │   ├── components/         # 可复用组件
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx            # 顶部导航
│   │   │   │   └── Footer.tsx            # 底部
│   │   │   ├── test/
│   │   │   │   ├── QuestionCard.tsx      # 单题展示卡片
│   │   │   │   └── ProgressBar.tsx       # 答题进度条
│   │   │   └── result/
│   │   │       └── PersonalityCard.tsx   # 人格结果卡片
│   │   ├── stores/             # Zustand 状态管理
│   │   │   ├── authStore.ts              # 用户登录状态
│   │   │   └── testStore.ts              # 答题进度状态
│   │   ├── hooks/              # React Hooks
│   │   │   ├── useAuth.ts                # 认证相关
│   │   │   └── useMobile.ts              # 移动端检测
│   │   └── lib/                # 工具函数
│   │       ├── api.ts                    # API 请求封装
│   │       ├── utils.ts                  # 通用工具
│   │       └── constants.ts              # 常量
│   ├── server/                 # ===== 后端（Express + Prisma） =====
│   │   ├── index.ts            # 服务入口（启动 Express）
│   │   ├── app.ts              # Express 应用配置
│   │   ├── routes/             # API 路由
│   │   │   ├── auth.routes.ts            # 登录/注册
│   │   │   ├── test.routes.ts            # 测试提交/题目获取/结果查询
│   │   │   ├── personality.routes.ts     # 人格图鉴 API
│   │   │   ├── admin.routes.ts           # 管理员审核
│   │   │   └── creator.routes.ts         # 创作者提交
│   │   ├── controllers/        # 请求处理（目前大部分逻辑在 routes 里）
│   │   ├── services/           # 业务逻辑层
│   │   ├── middleware/         # 中间件
│   │   │   ├── auth.middleware.ts        # JWT 验证
│   │   │   ├── role.middleware.ts        # 角色权限
│   │   │   └── error.middleware.ts       # 全局错误处理
│   │   └── utils/
│   │       └── prisma.ts                 # Prisma Client 单例
│   └── shared/                 # 前后端共享类型
│       └── types.ts            # TypeScript 接口定义
├── public/                     # 静态资源
├── package.json                # 依赖与脚本
├── tsconfig.json               # 前端 TS 配置
├── tsconfig.server.json        # 后端 TS 配置
├── vite.config.ts              # Vite 配置
└── .env                        # 环境变量（本地配置）
```

---

## 三、数据库模型

### 核心表

| 表名 | 作用 | 关键字段 |
|------|------|----------|
| `User` | 用户 | email, password, name, role (STUDENT/CREATOR/ADMIN) |
| `Question` | 题目 | content, options (JSON), category, status |
| `Personality` | 人格类型 | id (如 "ENJA"), name, title, description, traits (JSON), icon, color |
| `Template` | 测试模板 | name, description, isDefault |
| `TemplateQuestion` | 模板-题目关联 | templateId, questionId, order |
| `TestResult` | 测试结果 | userId, templateId, personalityId, scores (JSON), answers (JSON) |
| `Submission` | 创作者提交 | type (QUESTION/PERSONALITY), content, status |

---

## 四、API 接口清单

### 认证 `/api/auth`
- `POST /register` — 注册
- `POST /login` — 登录（返回 JWT）
- `GET /me` — 获取当前用户信息

### 测试 `/api/test`
- `GET /templates` — 获取所有模板
- `GET /templates/:id/questions` — 获取模板下的题目列表
- `POST /submit` — 提交答案，返回计算结果
- `GET /results/:id` — 查询测试结果详情

### 人格 `/api/personalities`
- `GET /personalities?status=APPROVED` — 获取全部已审核人格
- `GET /personalities/:id` — 获取单个人格详情

### 管理 `/api/admin`
- `GET /pending` — 待审核列表
- `POST /approve/:id` / `POST /reject/:id` — 审核操作

### 创作者 `/api/creator`
- `POST /submit-question` / `POST /submit-personality` — 提交新内容
- `GET /my-submissions` — 我的提交记录

---

## 五、计分逻辑（后端关键代码）

文件位置：`src/server/routes/test.routes.ts`

```
1. 遍历用户答案
2. 每个选项的 scores 累加到对应维度（E/I, S/N, J/P, A/H）
3. 每个维度比较两边得分，高者胜（同分默认左极）
4. 组合成 4 位代码（如 ENJA）
5. 查询 Personality 表返回结果
```

---

## 六、你可以直接编辑的文件

| 文件 | 内容 | 修改后如何生效 |
|------|------|----------------|
| `data/questions.json` | 题库（题目、选项、分值） | 运行 `npm run db:seed` |
| `data/personalities.json` | 人格库（名称、描述、特征） | 运行 `npm run db:seed` |
| `docs/todo.md` | 协作任务清单 | 直接保存，双方可见 |

> ⚠️ **不要直接改 `prisma/seed.ts` 里的数组**，改 JSON 文件即可。seed.ts 已经改为从 JSON 读取。

---

## 七、常用命令

```bash
# 安装依赖
npm install

# 启动开发（前后端同时）
npm run dev

# 只启动前端
npm run dev:client

# 只启动后端
npm run dev:server

# 数据库迁移（修改 schema.prisma 后执行）
npm run db:migrate

# 重新导入题库/人格数据（修改 JSON 后执行）
npm run db:seed

# 可视化查看数据库
npm run db:studio

# 构建生产包
npm run build
```

---

## 八、用户角色与权限

| 角色 | 权限 |
|------|------|
| STUDENT（学生） | 答题、查看结果、浏览图鉴 |
| CREATOR（创作者） | 提交新题目/新人格、查看自己的提交记录 |
| ADMIN（管理员） | 审核创作者提交、管理所有题目和人格 |

默认账号：
- 管理员：`admin@example.com` / `admin123`
- 创作者：`creator@example.com` / `creator123`

---

## 九、扩展建议（由你决定优先级）

1. **题目乱序**：目前题目按 JSON 中的顺序呈现，可改成每次随机抽取
2. **人格详情页**：GalleryPage 点击人格卡片目前会 404，可添加 `/personality/:id` 页面
3. **分享卡片**：结果页生成图片分享
4. **测试历史**：学生可查看过往测试结果
5. **数据统计**：管理员看各人格占比、各题选项分布
