# Feishu Integration Guide

本指南将帮助您配置 AI Prompt 管理平台与飞书的集成。

## 功能特性

✨ **自动通知** - 新建或更新 Prompt 时自动发送通知到指定飞书群
📝 **多种格式** - 支持纯文本和富文本卡片两种消息格式  
🔗 **一键测试** - 内置连接测试功能，确保配置正确
🎯 **灵活控制** - 可随时启用/禁用通知功能

## 设置步骤

### 1. 创建飞书机器人

1. 打开飞书群聊
2. 点击群聊设置 → 群机器人
3. 添加机器人 → 自定义机器人
4. 设置机器人名称和描述
5. 复制生成的 Webhook URL

### 2. 配置通知设置

1. 在应用右上角点击 ⚙️ 设置按钮
2. 在"飞书通知配置"区域：
   - 勾选"启用飞书通知"
   - 粘贴 Webhook URL
   - 选择消息格式（纯文本/富文本卡片）
3. 点击"测试连接"确认配置正确
4. 保存设置

### 3. 使用体验

配置完成后：
- 新建 Prompt 时，飞书群会收到创建通知
- 更新现有 Prompt 时，飞书群会收到更新通知
- 设置按钮会显示绿色指示点，表示飞书集成已启用

## 消息格式示例

### 纯文本格式
```
📝 Prompt 新建

**标题：** Android 开发助手
**长度：** 245 字符 / 52 词
**时间：** 2024-01-15 14:30:22

**内容预览：**
你是一个专业的 Android 开发专家，精通 Kotlin 和 Java...
```

### 富文本卡片格式
富文本卡片会以结构化的形式展示 Prompt 信息，包含：
- 带图标的标题
- 格式化的内容信息
- 更好的视觉展示效果

## 故障排查

**连接测试失败？**
- 检查 Webhook URL 是否完整且正确
- 确认飞书机器人仍然在群聊中
- 验证网络连接是否正常

**没有收到通知？**
- 确认已启用飞书通知
- 检查 Webhook URL 配置
- 查看浏览器开发者工具的控制台是否有错误信息

**消息格式不对？**
- 尝试切换消息格式（纯文本/富文本卡片）
- 重新测试连接

## 安全注意事项

⚠️ **重要提醒**：
- Webhook URL 包含敏感信息，请勿分享给他人
- 定期检查机器人权限，确保安全
- 如需更换群聊，请重新配置 Webhook URL

---

💡 **小贴士**：您可以随时在设置中禁用通知功能，而不会影响其他功能的使用。