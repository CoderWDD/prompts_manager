'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Settings, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { getFeishuService } from '@/lib/feishu';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { settings, updateSettings } = useAppStore();
  const [feishuUrl, setFeishuUrl] = useState(settings.feishu.webhookUrl);
  const [feishuEnabled, setFeishuEnabled] = useState(settings.feishu.enabled);
  const [messageFormat, setMessageFormat] = useState(settings.feishu.messageFormat);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings({
      feishu: {
        webhookUrl: feishuUrl,
        enabled: feishuEnabled,
        messageFormat
      }
    });
    onClose();
  };

  const handleTestConnection = async () => {
    if (!feishuUrl.trim()) {
      setTestError('请先输入 Webhook URL');
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');
    setTestError('');

    try {
      const service = getFeishuService({
        webhookUrl: feishuUrl,
        enabled: true,
        messageFormat
      });

      const success = await service.testConnection();
      
      if (success) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
        setTestError('连接失败，请检查 Webhook URL 是否正确');
      }
    } catch (error) {
      setTestStatus('error');
      setTestError(error instanceof Error ? error.message : '连接测试失败');
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setTestStatus('idle');
      setTestError('');
    }, 3000);
  };

  const getTestButtonContent = () => {
    switch (testStatus) {
      case 'testing':
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            测试中...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            连接成功
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="h-4 w-4 mr-2 text-red-600" />
            连接失败
          </>
        );
      default:
        return (
          <>
            <Send className="h-4 w-4 mr-2" />
            测试连接
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-900 border-b">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            设置
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto bg-white dark:bg-gray-900 p-6">
          <div className="space-y-6">
            {/* Feishu Webhook Configuration */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                飞书通知配置
                {feishuEnabled && feishuUrl && (
                  <Badge variant="default" className="bg-green-600 text-white">
                    已启用
                  </Badge>
                )}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={feishuEnabled}
                      onChange={(e) => setFeishuEnabled(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    启用飞书通知
                  </label>
                  <p className="text-sm text-gray-500">新建或更新 Prompt 时自动发送通知到飞书群</p>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Webhook URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={feishuUrl}
                      onChange={(e) => setFeishuUrl(e.target.value)}
                      placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..."
                      className="flex-1"
                      disabled={!feishuEnabled}
                    />
                    <Button
                      onClick={handleTestConnection}
                      disabled={!feishuEnabled || !feishuUrl.trim() || testStatus === 'testing'}
                      variant="outline"
                      className={cn(
                        'min-w-[120px]',
                        testStatus === 'success' && 'border-green-500 text-green-600',
                        testStatus === 'error' && 'border-red-500 text-red-600'
                      )}
                    >
                      {getTestButtonContent()}
                    </Button>
                  </div>
                  {testError && (
                    <p className="text-sm text-red-600 mt-1">{testError}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    在飞书群中添加机器人，获取 Webhook URL
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    消息格式
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={messageFormat === 'markdown' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMessageFormat('markdown')}
                      disabled={!feishuEnabled}
                    >
                      纯文本
                    </Button>
                    <Button
                      variant={messageFormat === 'card' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMessageFormat('card')}
                      disabled={!feishuEnabled}
                    >
                      富文本卡片
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    选择发送到飞书的消息格式
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">使用说明</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <strong>1. 创建飞书机器人：</strong>
                  <p className="ml-4">在飞书群中添加「自定义机器人」，复制 Webhook URL</p>
                </div>
                <div>
                  <strong>2. 配置通知：</strong>
                  <p className="ml-4">将 Webhook URL 粘贴到上方输入框，选择消息格式</p>
                </div>
                <div>
                  <strong>3. 测试连接：</strong>
                  <p className="ml-4">点击「测试连接」确保配置正确</p>
                </div>
                <div>
                  <strong>4. 启用通知：</strong>
                  <p className="ml-4">勾选「启用飞书通知」，新建或更新 Prompt 时将自动发送通知</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存设置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};