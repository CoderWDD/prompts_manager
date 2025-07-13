# AI Prompt 管理平台

一个基于 React + TypeScript + Next.js 的现代化 AI 提示词管理平台，支持本地存储、分类管理、Markdown 编辑和飞书同步。

## ✨ 功能特性

### 🎯 核心功能
- **Prompt 管理**: 完整的增删改查功能，支持 Markdown 格式
- **智能分类**: 文件夹树状结构 + 标签系统双重分类
- **强大搜索**: 全文搜索、标签筛选、文件夹筛选、多种排序方式
- **本地存储**: 基于 IndexedDB 的本地数据存储，支持离线使用
- **数据管理**: JSON 格式导入导出，数据备份与恢复

### 📝 编辑体验
- **Markdown 支持**: 完整的 Markdown 语法支持
- **实时预览**: 编辑时可切换预览模式
- **自动统计**: 字符数、词数、创建/修改时间自动记录

### 🎨 界面设计
- **现代 UI**: 基于 shadcn/ui 组件库，简洁美观
- **响应式**: 完美适配桌面和移动端
- **双视图**: 卡片视图和列表视图切换
- **暗色模式**: 支持系统主题跟随

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装步骤

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **打开浏览器访问**
```
http://localhost:3000
```

### 构建部署

1. **构建项目**
```bash
npm run build
```

2. **启动生产服务器**
```bash
npm start
```

### Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

## 🔧 技术栈

### 前端框架
- **Next.js 15**: React 全栈框架
- **React 19**: UI 库
- **TypeScript**: 类型安全

### 状态管理
- **Zustand**: 轻量级状态管理
- **Persist**: 状态持久化

### 样式系统
- **TailwindCSS**: 原子化 CSS 框架
- **shadcn/ui**: 现代组件库
- **Lucide React**: 图标库

### 数据存储
- **Dexie**: IndexedDB 封装库
- **localStorage**: 轻量数据存储

### 编辑器
- **react-markdown**: Markdown 渲染
- **@uiw/react-md-editor**: Markdown 编辑器

## 📖 使用指南

### 基本操作

1. **创建提示词**
   - 点击"新建"按钮
   - 填写标题和内容
   - 选择文件夹和标签
   - 保存

2. **编辑提示词**
   - 点击卡片上的编辑按钮
   - 修改内容
   - 保存更改

3. **搜索筛选**
   - 使用搜索框进行全文搜索
   - 点击筛选按钮设置高级筛选
   - 选择文件夹或标签进行筛选

4. **数据管理**
   - 导出：将所有数据导出为 JSON 文件
   - 导入：从 JSON 文件恢复数据

### 分类管理

1. **文件夹管理**
   - 点击设置按钮打开分类管理
   - 创建、编辑、删除文件夹

2. **标签管理**
   - 在分类管理中创建标签
   - 为提示词添加多个标签
   - 通过标签筛选内容

## 🎯 开发状态

### 已完成 ✅
- [x] 基础项目结构搭建
- [x] TypeScript 类型定义
- [x] Zustand 状态管理
- [x] IndexedDB 本地存储
- [x] 基础 UI 组件
- [x] Prompt CRUD 功能
- [x] 搜索和筛选
- [x] 文件夹和标签管理
- [x] 导入导出功能

### 开发中 🚧
- [ ] Markdown 编辑器优化
- [ ] 飞书 Webhook 集成
- [ ] 设置页面完善

### 计划中 📋
- [ ] AI 提示词模板库
- [ ] 批量操作功能
- [ ] PWA 支持
- [ ] 云端同步

## 📄 许可证

本项目采用 MIT 许可证

---

**让 AI 提示词管理变得简单高效！** 🚀
