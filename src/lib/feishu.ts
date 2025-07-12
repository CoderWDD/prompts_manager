import { Prompt, FeishuConfig } from '@/types';

export interface FeishuMessage {
  msg_type: 'text' | 'post' | 'interactive';
  content: {
    text?: string;
    post?: {
      zh_cn: {
        title: string;
        content: Array<Array<{
          tag: string;
          text?: string;
          href?: string;
        }>>;
      };
    };
  };
}

export class FeishuWebhookService {
  private config: FeishuConfig;

  constructor(config: FeishuConfig) {
    this.config = config;
  }

  updateConfig(config: FeishuConfig) {
    this.config = config;
  }

  async sendPromptCreatedMessage(prompt: Prompt): Promise<boolean> {
    if (!this.config.enabled || !this.config.webhookUrl) {
      return false;
    }

    const message = this.formatPromptMessage(prompt, '新建');
    return this.sendMessage(message);
  }

  async sendPromptUpdatedMessage(prompt: Prompt): Promise<boolean> {
    if (!this.config.enabled || !this.config.webhookUrl) {
      return false;
    }

    const message = this.formatPromptMessage(prompt, '更新');
    return this.sendMessage(message);
  }

  async testConnection(): Promise<boolean> {
    if (!this.config.webhookUrl) {
      throw new Error('请先配置 Webhook URL');
    }

    const testMessage: FeishuMessage = {
      msg_type: 'text',
      content: {
        text: '🔔 AI Prompt 管理平台连接测试成功！'
      }
    };

    return this.sendMessage(testMessage);
  }

  private formatPromptMessage(prompt: Prompt, action: '新建' | '更新'): FeishuMessage {
    if (this.config.messageFormat === 'card') {
      return this.formatCardMessage(prompt, action);
    } else {
      return this.formatTextMessage(prompt, action);
    }
  }

  private formatTextMessage(prompt: Prompt, action: '新建' | '更新'): FeishuMessage {
    const text = [
      `📝 Prompt ${action}`,
      ``,
      `**标题：** ${prompt.title}`,
      `**长度：** ${prompt.contentLength} 字符 / ${prompt.wordCount} 词`,
      `**时间：** ${prompt.updatedAt.toLocaleString('zh-CN')}`,
      ``,
      `**内容预览：**`,
      `${prompt.content.length > 200 ? prompt.content.substring(0, 200) + '...' : prompt.content}`
    ].join('\n');

    return {
      msg_type: 'text',
      content: {
        text
      }
    };
  }

  private formatCardMessage(prompt: Prompt, action: '新建' | '更新'): FeishuMessage {
    const icon = action === '新建' ? '✨' : '🔄';
    
    return {
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            title: `${icon} Prompt ${action}`,
            content: [
              [
                {
                  tag: 'text',
                  text: `标题：${prompt.title}`
                }
              ],
              [
                {
                  tag: 'text',
                  text: `长度：${prompt.contentLength} 字符 / ${prompt.wordCount} 词`
                }
              ],
              [
                {
                  tag: 'text',
                  text: `时间：${prompt.updatedAt.toLocaleString('zh-CN')}`
                }
              ],
              [
                {
                  tag: 'text',
                  text: '内容预览：'
                }
              ],
              [
                {
                  tag: 'text',
                  text: prompt.content.length > 300 ? prompt.content.substring(0, 300) + '...' : prompt.content
                }
              ]
            ]
          }
        }
      }
    };
  }

  private async sendMessage(message: FeishuMessage): Promise<boolean> {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.error('Feishu webhook failed:', response.status, response.statusText);
        return false;
      }

      const result = await response.json();
      
      // Feishu webhook returns { code: 0 } on success
      if (result.code !== 0) {
        console.error('Feishu webhook error:', result);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to send Feishu message:', error);
      return false;
    }
  }
}

// Global instance
let feishuService: FeishuWebhookService | null = null;

export const getFeishuService = (config: FeishuConfig): FeishuWebhookService => {
  if (!feishuService) {
    feishuService = new FeishuWebhookService(config);
  } else {
    feishuService.updateConfig(config);
  }
  return feishuService;
};

export const sendPromptToFeishu = async (prompt: Prompt, action: 'created' | 'updated', config: FeishuConfig): Promise<boolean> => {
  const service = getFeishuService(config);
  
  if (action === 'created') {
    return service.sendPromptCreatedMessage(prompt);
  } else {
    return service.sendPromptUpdatedMessage(prompt);
  }
};