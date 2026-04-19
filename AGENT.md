# AGENT.md - 趣味人格测试平台 (PersonaQuest)

## 项目概述

一个面向学校场景的人格测试 Web 平台，用户群体包括：
- **学校学生**：完成约30题的趣味测试，获取人格类型结果与个性化解读
- **内容运营者/社团人员**：在基础题库上制作新模板、新增题目或设计新的人格类型
- **平台管理员**：审核运营者提交的内容，维护题库和人格体系

平台包含首页、测试答题页、人格结果页（特征化图标+解读）、人格图鉴四大核心页面；管理端包含题目管理和人格管理。

**核心要求**：轻量化、响应式（手机端+桌面端）、模块清晰、易于扩展。

---

## 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^19.0.0 | UI 框架 |
| TypeScript | ^5.7.0 | 类型安全 |
| Vite | ^6.0.0 | 构建工具 |
| Tailwind CSS | ^4.0.0 | 原子化样式 |
| shadcn/ui | latest | UI 组件库（基于 Tailwind） |
| React Router | ^7.0.0 | 客户端路由 |
| Zustand | ^5.0.0 | 全局状态管理 |
| Lucide React | ^0.460.0 | 图标库 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Express | ^4.21.0 | Web 服务框架 |
| TypeScript | ^5.7.0 | 类型安全 |
| Prisma | ^6.0.0 | ORM + 数据库迁移 |
| SQLite | 3 | 开发数据库（零配置、单文件） |
| jsonwebtoken | ^9.0.0 | JWT 认证 |
| bcryptjs | ^2.4.3 | 密码哈希 |
| cors | ^2.8.5 | 跨域处理 |
| dotenv | ^16.4.0 | 环境变量 |

### 开发工具
- `tsx` - TypeScript 直接运行（开发后端）
- `nodemon` - 后端热重载
- `concurrently` - 前后端同时启动
- `@types/*` - 类型定义包

---

## 项目目录结构

```
D:\KGTI/
├── AGENT.md                  # 本文件 - 项目规范与架构说明
├── README.md                 # 面向开发者的项目说明
├── package.json              # 根级依赖与脚本
├── tsconfig.json             # 前端 TypeScript 配置
├── tsconfig.server.json      # 后端 TypeScript 配置
├── vite.config.ts            # Vite 配置
├── tailwind.config.js        # Tailwind CSS 配置
├── postcss.config.js         # PostCSS 配置
├── .env                      # 环境变量（不提交 git）
├── .env.example              # 环境变量示例
├── prisma/
│   ├── schema.prisma         # Prisma 数据库模型定义
│   └── migrations/           # 数据库迁移文件
├── public/                   # 静态资源（可直接访问）
│   ├── icons/                # 人格特征图标（SVG/PNG）
│   └── assets/               # 其他静态资源
├── src/
│   ├── client/               # ===== 前端代码 =====
│   │   ├── main.tsx          # 前端入口
│   │   ├── App.tsx           # 根组件 + 路由配置
│   │   ├── index.css         # 全局样式 + Tailwind 指令
│   │   ├── pages/            # 页面级组件
│   │   │   ├── HomePage.tsx              # 首页
│   │   │   ├── TestPage.tsx              # 测试答题页
│   │   │   ├── ResultPage.tsx            # 人格结果页
│   │   │   ├── GalleryPage.tsx           # 人格图鉴页
│   │   │   ├── LoginPage.tsx             # 登录页
│   │   │   ├── RegisterPage.tsx          # 注册页
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx    # 管理后台首页
│   │   │   │   ├── QuestionManager.tsx   # 题目管理页
│   │   │   │   └── PersonalityManager.tsx # 人格管理页
│   │   │   └── creator/
│   │   │       ├── CreatorDashboard.tsx  # 运营者创作中心
│   │   │       └── SubmitPage.tsx        # 提交审核页
│   │   ├── components/       # 可复用组件
│   │   │   ├── ui/           # shadcn/ui 基础组件
│   │   │   ├── layout/       # 布局组件（Header、Footer、Nav）
│   │   │   ├── test/         # 测试相关组件
│   │   │   │   ├── QuestionCard.tsx      # 单题展示卡片
│   │   │   │   ├── ProgressBar.tsx       # 答题进度条
│   │   │   │   └── OptionButton.tsx      # 选项按钮
│   │   │   ├── result/       # 结果页相关组件
│   │   │   │   ├── PersonalityCard.tsx   # 人格卡片
│   │   │   │   ├── TraitRadar.tsx        # 特征雷达图
│   │   │   │   └── ShareButton.tsx       # 分享按钮
│   │   │   └── admin/        # 管理端组件
│   │   │       ├── DataTable.tsx         # 数据表格
│   │   │       ├── StatusBadge.tsx       # 状态标签
│   │   │       └── ReviewModal.tsx       # 审核弹窗
│   │   ├── hooks/            # 自定义 React Hooks
│   │   │   ├── useAuth.ts                # 认证状态 Hook
│   │   │   ├── useTest.ts                # 测试流程 Hook
│   │   │   └── useMobile.ts              # 移动端检测 Hook
│   │   ├── stores/           # Zustand 状态仓库
│   │   │   ├── authStore.ts              # 用户认证状态
│   │   │   ├── testStore.ts              # 测试进度状态
│   │   │   └── uiStore.ts                # UI 状态（主题、侧边栏等）
│   │   ├── lib/              # 工具函数与配置
│   │   │   ├── api.ts                    # API 请求封装（axios/fetch）
│   │   │   ├── utils.ts                  # 通用工具函数
│   │   │   └── constants.ts              # 常量定义
│   │   └── types/            # 前端类型定义
│   │       └── index.ts
│   ├── server/               # ===== 后端代码 =====
│   │   ├── index.ts          # 服务入口（启动 Express）
│   │   ├── app.ts            # Express 应用配置（中间件、路由挂载）
│   │   ├── config/           # 配置文件
│   │   │   └── auth.ts                   # JWT 配置
│   │   ├── routes/           # 路由定义
│   │   │   ├── auth.routes.ts            # 认证路由（登录/注册）
│   │   │   ├── test.routes.ts            # 测试路由（答题/提交/结果）
│   │   │   ├── personality.routes.ts     # 人格路由（图鉴/详情）
│   │   │   ├── admin.routes.ts           # 管理员路由（审核/管理）
│   │   │   └── creator.routes.ts         # 运营者路由（提交/草稿）
│   │   ├── controllers/      # 控制器（处理请求/响应）
│   │   │   ├── auth.controller.ts
│   │   │   ├── test.controller.ts
│   │   │   ├── personality.controller.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── creator.controller.ts
│   │   ├── services/         # 业务逻辑层
│   │   │   ├── auth.service.ts
│   │   │   ├── test.service.ts
│   │   │   ├── personality.service.ts
│   │   │   ├── admin.service.ts
│   │   │   └── creator.service.ts
│   │   ├── middleware/       # Express 中间件
│   │   │   ├── auth.middleware.ts        # JWT 验证
│   │   │   ├── role.middleware.ts        # 角色权限检查
│   │   │   └── error.middleware.ts       # 全局错误处理
│   │   └── utils/            # 后端工具函数
│   │       ├── prisma.ts                 # Prisma Client 单例
│   │       └── helpers.ts                # 辅助函数
│   └── shared/               # ===== 前后端共享类型 =====
│       └── types.ts          # API DTO、通用接口定义
```

---

## 数据库模型设计（Prisma Schema）

### 核心模型

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt 哈希
  name      String
  role      Role     @default(STUDENT) // STUDENT | CREATOR | ADMIN
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  results    TestResult[]
  submissions Submission[]
}

enum Role {
  STUDENT
  CREATOR
  ADMIN
}

model Question {
  id       String @id @default(uuid())
  content  String // 题目内容
  options  Json   // [{ label: "A", text: "...", scores: { personalityId: 3 } }]
  category String? // 题目分类（可选）
  status   Status @default(PENDING) // PENDING | APPROVED | REJECTED
  
  templates TemplateQuestion[]
  createdBy String?
  createdAt DateTime @default(now())
}

enum Status {
  PENDING   // 待审核
  APPROVED  // 已通过
  REJECTED  // 已拒绝
}

model Personality {
  id          String @id @default(uuid())
  name        String // 人格名称，如"冒险家"
  title       String // 称号，如"无畏的探索者"
  description String // 详细解读
  traits      Json   // 特征标签 [{ name: "创造力", value: 85 }]
  icon        String // 图标路径/URL
  color       String // 主题色，如 #FF6B6B
  status      Status @default(PENDING)
  
  results TestResult[]
  createdAt DateTime @default(now())
}

model Template {
  id          String @id @default(uuid())
  name        String // 模板名称，如"校园人格大测试"
  description String?
  isDefault   Boolean @default(false)
  
  questions TemplateQuestion[]
  results   TestResult[]
  createdAt DateTime @default(now())
}

model TemplateQuestion {
  id         String @id @default(uuid())
  template   Template @relation(fields: [templateId], references: [id])
  templateId String
  question   Question @relation(fields: [questionId], references: [id])
  questionId String
  order      Int    // 题目顺序
  
  @@unique([templateId, questionId])
}

model TestResult {
  id            String @id @default(uuid())
  user          User   @relation(fields: [userId], references: [id])
  userId        String
  template      Template @relation(fields: [templateId], references: [id])
  templateId    String
  personality   Personality @relation(fields: [personalityId], references: [id])
  personalityId String
  scores        Json   // 各人格维度得分 { personalityId: score }
  answers       Json   // 用户答案记录 [{ questionId, optionIndex }]
  createdAt     DateTime @default(now())
}

model Submission {
  id         String @id @default(uuid())
  type       SubmissionType // QUESTION | PERSONALITY
  content    Json   // 提交的内容快照
  status     Status @default(PENDING)
  remark     String? // 审核备注
  creator    User   @relation(fields: [creatorId], references: [id])
  creatorId  String
  reviewerId String?
  createdAt  DateTime @default(now())
  reviewedAt DateTime?
}

enum SubmissionType {
  QUESTION
  PERSONALITY
}
```

---

## API 接口设计

### 认证相关 `/api/auth`
- `POST /register` - 注册（email, password, name, role?）
- `POST /login` - 登录（email, password）→ 返回 JWT
- `GET /me` - 获取当前用户信息

### 测试相关 `/api/test`
- `GET /templates` - 获取所有可用模板
- `GET /templates/:id/questions` - 获取模板的题目列表
- `POST /submit` - 提交答案 → 返回计算结果
- `GET /results/:id` - 获取测试结果详情

### 人格图鉴 `/api/personalities`
- `GET /personalities` - 获取全部已审核人格（支持筛选/分页）
- `GET /personalities/:id` - 获取单个人格详情

### 管理员 `/api/admin`
- `GET /pending` - 获取待审核列表（题目+人格）
- `POST /approve/:submissionId` - 通过审核
- `POST /reject/:submissionId` - 拒绝审核（含备注）
- `GET /questions` - 题目列表（管理视图，含状态）
- `PUT /questions/:id` - 编辑题目
- `DELETE /questions/:id` - 删除题目
- `GET /personalities` - 人格列表（管理视图）
- `PUT /personalities/:id` - 编辑人格
- `DELETE /personalities/:id` - 删除人格

### 运营者 `/api/creator`
- `POST /submit-question` - 提交新题目
- `POST /submit-personality` - 提交新的人格类型
- `GET /my-submissions` - 我的提交记录
- `GET /questions` - 查看当前题库（参考用）

---

## 核心功能流程

### 1. 学生测试流程
```
首页 → 选择模板 → 答题页（1题/页或分页，进度条）→ 提交计算 → 结果页
```
- 答题页支持上一题/下一题，可修改答案
- 进度条实时显示（如 12/30）
- 提交后后端根据选项的 `scores` 映射加权计算，取最高得分的人格
- 结果页展示：人格图标、名称、称号、特征雷达图、详细解读、分享按钮

### 2. 人格计算逻辑
```typescript
// 伪代码
function calculatePersonality(answers, questions) {
  const scores = {};
  answers.forEach(({ questionId, optionIndex }) => {
    const q = questions.find(q => q.id === questionId);
    const option = q.options[optionIndex];
    Object.entries(option.scores).forEach(([pid, val]) => {
      scores[pid] = (scores[pid] || 0) + val;
    });
  });
  // 取最高分为结果
  const personalityId = Object.entries(scores).sort((a,b) => b[1]-a[1])[0][0];
  return { personalityId, scores };
}
```

### 3. 运营者提交流程
```
创作中心 → 选择类型（新题/新人格）→ 填写表单 → 提交审核 → 等待管理员审核
```

### 4. 管理员审核流程
```
管理后台 → 审核列表 → 查看详情 → 通过（入库）/ 拒绝（填写原因）
```

---

## 页面布局与响应式设计

### 断点设计（Tailwind）
- `sm`: 640px - 小平板
- `md`: 768px - 平板
- `lg`: 1024px - 桌面
- `xl`: 1280px - 大屏

### 移动端适配要点
- **首页**：单列布局，大按钮，卡片垂直堆叠
- **答题页**：全屏卡片滑动或底部固定导航（上一题/下一题）
- **结果页**：人格图标居中放大，雷达图自适应容器宽度
- **人格图鉴**：2列网格（手机）→ 4列网格（桌面）
- **管理端**：表格在移动端转为卡片列表，或支持横向滚动

### 导航结构
- **公开区**：Logo、首页、人格图鉴、登录/注册
- **学生区**：Logo、首页、我的结果（下拉）、退出
- **运营者区**：Logo、创作中心、我的提交、退出
- **管理区**：侧边栏导航（仪表盘、题目管理、人格管理、审核中心）

---

## 开发规范

### 代码风格
- 使用 **TypeScript**，所有接口必须定义类型
- 前端组件使用 **函数组件 + Hooks**，避免类组件
- 后端使用 **async/await**，统一错误处理中间件
- 文件命名：组件大驼峰（`QuestionCard.tsx`），工具小驼峰（`api.ts`）

### API 响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### 错误处理
- 前端：API 层统一封装，自动处理 401（跳转登录）、显示错误提示
- 后端：全局错误中间件捕获异常，返回标准化错误响应，记录日志

### 状态码规范
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 无权限（角色不符）
- `404` - 资源不存在
- `500` - 服务器内部错误

### 数据库操作
- 所有数据库访问通过 Prisma Client
- 禁止直接写 SQL（除非极特殊情况）
- 迁移文件必须提交到版本控制

---

## npm 脚本规划

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "vite",
    "dev:server": "nodemon --watch src/server --ext ts,json --exec tsx src/server/index.ts",
    "build": "tsc && vite build && tsc -p tsconfig.server.json",
    "start": "node dist/server/index.js",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

---

## 扩展路线图

### 第一阶段（MVP - 当前）
- [x] 基础用户系统（学生/运营者/管理员）
- [x] 答题流程与结果计算
- [x] 人格结果页（图标+解读）
- [x] 人格图鉴浏览
- [x] 管理端题目/人格管理
- [x] 运营者提交与管理员审核

### 第二阶段（后续）
- [ ] 测试结果分享（生成分享卡片图片）
- [ ] 测试历史记录
- [ ] 多模板支持（不同主题的测试）
- [ ] 数据统计看板（管理员）
- [ ] 题目标签分类与搜索

### 第三阶段（可选）
- [ ] 社交功能（查看好友结果）
- [ ] 实时排行榜
- [ ] AI 生成个性化解读文案

---

## 环境变量

```env
# Server
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Client (Vite 前缀 VITE_)
VITE_API_BASE_URL="http://localhost:3001/api"
```
