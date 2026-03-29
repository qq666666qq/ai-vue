# AI心理健康咨询平台

一个基于Vue 3的智能心理健康咨询Web应用，提供AI对话、情绪记录、知识普及和数据分析等功能。

## ✨ 功能特性

### 用户端
- 🤖 **AI智能咨询** - 基于流式输出的实时对话，支持Markdown格式渲染
- 🌸 **情绪花园** - 可视化情绪分析展示，提供个性化建议
- 📝 **情绪日记** - 记录每日心情，追踪情绪变化
- 📚 **心理健康知识库** - 丰富的心理知识文章，支持富文本展示
- 💬 **会话历史** - 保存历史对话记录，随时回顾

### 管理端
- 📊 **数据分析仪表盘** - 用户统计、情绪趋势、咨询会话等数据可视化
- 📄 **知识文章管理** - 创建、编辑、发布心理健康知识文章
- 💭 **咨询记录管理** - 查看和管理用户咨询会话
- 📔 **情绪日志管理** - 审核和分析用户情绪记录

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.x | 前端框架 |
| Vite | 7.3.x | 构建工具 |
| Element Plus | 2.13.x | UI组件库 |
| Vue Router | 4.6.x | 路由管理 |
| Axios | 1.13.x | HTTP客户端 |
| ECharts | 6.0.x | 数据可视化 |
| WangEditor | 5.1.x | 富文本编辑器 |
| SCSS | 1.97.x | CSS预处理器 |
| fetch-event-source | 2.0.x | SSE流式请求 |

## 📁 项目结构

```
ai-vue/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口封装
│   │   ├── admin.js       # 管理端接口
│   │   └── frontend.js    # 用户端接口
│   ├── assets/            # 资源文件
│   │   └── images/        # 图片资源
│   ├── components/        # 公共组件
│   │   ├── MarkdownRenderer.vue    # Markdown渲染组件
│   │   ├── RichTextEditor.vue      # 富文本编辑器
│   │   ├── authLayout.vue           # 认证布局
│   │   ├── fixedLayout.vue          # 管理端布局
│   │   ├── frontLayout.vue          # 用户端布局
│   │   └── ...
│   ├── config/            # 配置文件
│   ├── router/            # 路由配置
│   ├── util/              # 工具函数
│   ├── views/             # 页面组件
│   │   ├── consultation.vue          # AI咨询页面
│   │   ├── emotionDiary.vue          # 情绪日记页面
│   │   ├── frontentKnowledge.vue     # 知识库页面
│   │   ├── articleDetail.vue         # 文章详情页
│   │   ├── dataAnalysis.vue          # 数据分析页面
│   │   ├── knowledgeArticle.vue      # 知识文章管理
│   │   ├── consultationRecord.vue    # 咨询记录管理
│   │   ├── moodJournal.vue           # 情绪日志管理
│   │   └── ...
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   └── style.css          # 全局样式
├── index.html             # HTML模板
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📝 核心功能说明

### AI流式对话

使用 `@microsoft/fetch-event-source` 实现SSE流式输出，让AI回复实时展示：

```javascript
fetchEventSource('/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.getItem('token'),
        'accept': 'text/event-stream',
    },
    body: JSON.stringify({ sessionId, userMessage }),
    onmessage: (event) => {
        // 实时追加AI回复内容
        aiMessage.content += payload.data.content
    }
})
```

### Markdown渲染

自定义Markdown渲染组件，支持代码块、列表、引用等格式：

- 代码块语法高亮
- 粗体、斜体样式
- 标题、列表、引用
- 链接和分割线

### 数据可视化

使用ECharts实现丰富的数据图表：

- 情绪趋势分析（折线图）
- 咨询会话统计（柱状图）
- 用户活跃度趋势（面积图）

## 🔐 权限控制

系统支持两种用户角色：

- **普通用户 (userType=1)** - 可访问用户端功能（AI咨询、情绪日记、知识库）
- **管理员 (userType=2)** - 可访问管理端功能（数据分析、内容管理）

路由守卫自动根据用户类型控制页面访问权限。

## 🎨 设计特点

- 🎯 渐变色UI设计，温暖治愈的视觉风格
- 📱 响应式布局，适配不同屏幕尺寸
- ✨ 平滑动画效果，提升用户体验
- 🎭 情绪图标和色彩搭配，贴合心理健康主题

## 📄 License

MIT License

---

**一次温暖的对话，化孤独为慰藉** 💝
