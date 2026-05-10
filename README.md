# 保研模拟面试官

AI 驱动的保研复试模拟面试工具。上传个人材料后，AI 自动分析薄弱点生成攻击路线图，以面试官身份进行拷问式追问，最终输出结构化复盘报告。

## 运行方式

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

需要配置环境变量 `.env`：

```
DEEPSEEK_API_KEY=your_api_key
```

## 技术栈

- **前端**：Next.js 14 App Router (React 18, TypeScript)
- **样式**：Tailwind CSS
- **持久化**：sql.js (WASM 版 SQLite)
- **AI**：DeepSeek API (v4-pro)
- **部署**：Ubuntu 24.04 + Nginx + PM2

## 项目结构

```
├── app/            # Next.js App Router 页面与 API 路由
│   ├── api/        # RESTful API（sessions, chat, debrief, history）
│   ├── interview/  # 面试对话页
│   └── sessions/   # 复盘报告页
├── components/     # React 组件
├── lib/            # 核心逻辑（db, claude, prompts, pdf）
├── types/          # TypeScript 类型定义
└── data/           # SQLite 数据库文件（gitignored）
```

## 核心功能

1. **材料上传**：支持简历、面试通知、参考题目、个人陈述、成绩单，可文本输入或上传 PDF/TXT
2. **攻击计划生成**：AI 分析材料中的模糊点、矛盾、异常，生成结构化追问策略
3. **模拟面试**：AI 以面试官角色进行追问，支持跳过话题、结束面试
4. **复盘报告**：1-5 分逐项评分，引用对话证据，给出可执行的改进建议
