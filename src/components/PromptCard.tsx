'use client';

import { Prompt } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { useAppStore } from '@/store';
import { Edit, Copy, Trash2, Eye, Check, Files } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onView: (prompt: Prompt) => void;
}

export const PromptCard = ({ prompt, onEdit, onView }: PromptCardProps) => {
  const { deletePrompt, duplicatePrompt, tags, folders } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = prompt.content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
        alert('复制失败，请手动选择内容复制');
      }
    }
  };

  const handleDelete = () => {
    if (confirm(`确定要删除提示词 "${prompt.title}" 吗？`)) {
      deletePrompt(prompt.id);
    }
  };

  const handleDuplicate = () => {
    duplicatePrompt(prompt.id);
  };

  const getTagName = (tagId: string) => {
    return tags.find(tag => tag.id === tagId)?.name || tagId;
  };

  const getFolderName = (folderId: string) => {
    return folders.find(folder => folder.id === folderId)?.name || '未分类';
  };

  const previewContent = prompt.content.length > 200 
    ? prompt.content.substring(0, 200) + '...' 
    : prompt.content;

  // Ensure dates are valid
  const updatedAt = prompt.updatedAt instanceof Date ? prompt.updatedAt : new Date(prompt.updatedAt);

  return (
    <Card className="h-fit hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
      <CardHeader className="pb-3 bg-white dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium truncate">
            {prompt.title}
          </CardTitle>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(prompt)}
              className="h-8 w-8"
              title="查看详情"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(prompt)}
              className="h-8 w-8"
              title="编辑"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
              title="复制到剪贴板"
            >
              {copySuccess ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="删除"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {prompt.folderId && (
            <Badge variant="outline" className="text-xs">
              📁 {getFolderName(prompt.folderId)}
            </Badge>
          )}
          {prompt.tags.map(tagId => (
            <Badge key={tagId} variant="secondary" className="text-xs">
              {getTagName(tagId)}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0 bg-white dark:bg-gray-900">
        <div className="max-w-none">
          {isExpanded ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: (props) => <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100" {...props} />,
                  h2: (props) => <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100" {...props} />,
                  h3: (props) => <h3 className="text-base font-medium mb-2 text-gray-900 dark:text-gray-100" {...props} />,
                  p: (props) => <p className="mb-2 leading-relaxed text-gray-700 dark:text-gray-300 text-sm" {...props} />,
                  ul: (props) => <ul className="list-disc list-inside mb-2 space-y-1 text-gray-700 dark:text-gray-300 text-sm" {...props} />,
                  ol: (props) => <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-700 dark:text-gray-300 text-sm" {...props} />,
                  li: (props) => <li className="mb-0.5" {...props} />,
                  code: ({ children, ...props }) => {
                    const isInline = !String(children).includes('\n');
                    return isInline ? (
                      <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono text-gray-800 dark:text-gray-200" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: (props) => <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2 overflow-x-auto" {...props} />,
                  blockquote: (props) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic mb-2 text-gray-600 dark:text-gray-400 text-sm" {...props} />,
                  strong: (props) => <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                  em: (props) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
                }}
              >
                {prompt.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground overflow-hidden">
              <div className="line-clamp-4">{previewContent}</div>
            </div>
          )}
        </div>
        
        {prompt.content.length > 200 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 p-0 h-auto text-xs hover:underline"
          >
            {isExpanded ? '收起' : '展开'}
          </Button>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>{prompt.contentLength} 字符</span>
            <span>{prompt.wordCount} 词</span>
          </div>
          <div className="flex items-center gap-3">
            <span>更新: {formatRelativeTime(updatedAt)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              className="h-auto p-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="创建副本"
            >
              <Files className="h-3 w-3 mr-1" />
              副本
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};