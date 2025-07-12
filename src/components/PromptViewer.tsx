'use client';

import { Prompt } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';
import { X, Copy, Check, Edit, Calendar } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils';

interface PromptViewerProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (prompt: Prompt) => void;
}

export const PromptViewer = ({ prompt, isOpen, onClose, onEdit }: PromptViewerProps) => {
  const { tags, folders } = useAppStore();
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen || !prompt) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
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

  const getTagName = (tagId: string) => {
    return tags.find(tag => tag.id === tagId)?.name || tagId;
  };

  const getFolderName = (folderId: string) => {
    return folders.find(folder => folder.id === folderId)?.name || '未分类';
  };

  const createdAt = prompt.createdAt instanceof Date ? prompt.createdAt : new Date(prompt.createdAt);
  const updatedAt = prompt.updatedAt instanceof Date ? prompt.updatedAt : new Date(prompt.updatedAt);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-900 border-b">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{prompt.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              {prompt.folderId && (
                <Badge variant="outline" className="text-sm">
                  📁 {getFolderName(prompt.folderId)}
                </Badge>
              )}
              {prompt.tags.map(tagId => (
                <Badge key={tagId} variant="secondary" className="text-sm">
                  {getTagName(tagId)}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>创建: {formatDate(createdAt)}</span>
              </div>
              <span>•</span>
              <span>更新: {formatDate(updatedAt)}</span>
              <span>•</span>
              <span>{prompt.contentLength} 字符</span>
              <span>•</span>
              <span>{prompt.wordCount} 词</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  复制
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onEdit(prompt)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              编辑
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto bg-white dark:bg-gray-900 p-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: (props) => <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                h2: (props) => <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100" {...props} />,
                h3: (props) => <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-gray-100" {...props} />,
                h4: (props) => <h4 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100" {...props} />,
                p: (props) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
                ul: (props) => <ul className="list-disc list-outside mb-4 ml-6 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
                ol: (props) => <ol className="list-decimal list-outside mb-4 ml-6 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
                li: (props) => <li className="mb-1" {...props} />,
                code: ({ children, ...props }) => {
                  const isInline = !String(children).includes('\n');
                  return isInline ? (
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto" {...props}>
                      {children}
                    </code>
                  );
                },
                pre: (props) => <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 overflow-x-auto" {...props} />,
                blockquote: (props) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-4 text-gray-600 dark:text-gray-400" {...props} />,
                strong: (props) => <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                em: (props) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
                table: (props) => <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 mb-4" {...props} />,
                th: (props) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left" {...props} />,
                td: (props) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props} />,
                hr: (props) => <hr className="my-6 border-gray-300 dark:border-gray-600" {...props} />,
                a: (props) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
              }}
            >
              {prompt.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};