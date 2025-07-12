一、产品概述
项目名称：AI Prompt 管理平台
目标用户：日常使用 AI 的开发者、内容创作者、提示词工程师、企业知识管理者
上线目标：提供一个支持本地使用、飞书同步、分类管理、支持 Markdown 的 Prompt 提示词管理平台
部署方式：前端应用，使用 Vercel 一键部署
技术栈：React + TypeScript + TailwindCSS + Zustand（或 Redux）+ shadcn/ui + Markdown 编辑器 + 飞书 Webhook

二、核心功能需求

1. Prompt 增删改查（CRUD）
   新增 Prompt：支持标题、内容（Markdown）、所属文件夹、标签

编辑 Prompt：进入编辑界面，可实时修改

删除 Prompt：确认删除提示

查看 Prompt：卡片式展示全部 Prompt，展示基本信息 + 支持 Markdown 格式预览

2. 分类管理（文件夹结构 + Tag）
   支持文件夹（树状结构）管理 Prompt

支持多个 Tag 为 Prompt 添加标签

支持通过文件夹、标签组合筛选 Prompt

3. Markdown 支持
   Prompt 内容支持 Markdown 格式编写

支持 Markdown 实时预览（双栏或 Tab 切换）

4. 搜索功能
   支持按标题、标签、内容全文搜索

支持筛选：按照创建时间、修改时间、长度排序

5. 本地存储与导出导入
   所有数据默认存储在浏览器（localStorage 或 IndexedDB）

支持将数据导出为 JSON 文件

支持通过上传 JSON 文件进行数据导入

6. 自动记录关键信息
   自动记录并展示每条 Prompt 的：

创建日期

最后修改日期

内容长度（字符 / 单词）

7. 飞书同步功能（可选）
   支持配置飞书群的 Webhook URL

当用户新增或修改 Prompt 时，自动推送内容到指定飞书群

消息格式为 Markdown 文本或飞书消息卡片格式

8. UI 展示与交互
   主页面卡片布局展示 Prompt 信息（shadcn/ui + Tailwind 实现）

支持点击卡片进行查看、编辑、删除操作

文件夹导航区：左侧侧边栏显示嵌套文件夹结构

标签筛选：顶部标签栏

响应式布局，适配桌面浏览器和移动端

三、页面与模块设计
首页（Prompt 列表页）
Prompt 卡片展示

筛选项（按文件夹、标签、时间、关键词搜索）

顶部按钮：新建 Prompt / 导入 / 导出 / 设置（飞书）

Prompt 编辑页
编辑标题、标签、文件夹

Markdown 编辑器（带实时预览）

保存按钮

自动记录修改时间

分类管理面板
可创建、删除、重命名文件夹（树状结构）

Tag 列表，可新增 / 删除 / 编辑标签

设置页（可通过按钮弹出）
配置飞书 Webhook URL

一键测试连接

四、技术实现方案
模块 技术选型
前端框架 React + TypeScript
状态管理 Zustand（轻量级，适合本地存储）
样式系统 TailwindCSS + shadcn/ui
Markdown 编辑器 react-markdown + react-mde
文件夹树结构 react-sortable-tree / 自定义
飞书 API 飞书群机器人 Webhook（POST JSON）
本地存储 localStorage / indexedDB
数据导入导出 JSON.stringify/parse + 文件读写
部署 Vercel
