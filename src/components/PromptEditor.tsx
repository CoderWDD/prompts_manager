'use client';

import { useState, useEffect } from 'react';
import { Prompt, PromptFormData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';
import { X, Plus, Save, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface PromptEditorProps {
  prompt?: Prompt;
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: PromptFormData) => void;
}

export const PromptEditor = ({ prompt, isOpen, onClose, onSave }: PromptEditorProps) => {
  const { folders, tags, addTag } = useAppStore();
  const [formData, setFormData] = useState<PromptFormData>({
    title: '',
    content: '',
    folderId: undefined,
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        content: prompt.content,
        folderId: prompt.folderId,
        tags: prompt.tags
      });
    } else {
      setFormData({
        title: '',
        content: '',
        folderId: undefined,
        tags: []
      });
    }
  }, [prompt]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('请填写标题和内容');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.find(tag => tag.name === newTag.trim())) {
      addTag({ name: newTag.trim() });
      setNewTag('');
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-900 border-b">
          <CardTitle>{prompt ? '编辑提示词' : '新建提示词'}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto bg-white dark:bg-gray-900">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">标题</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="请输入提示词标题"
                className="bg-white dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">文件夹</label>
              <select
                value={formData.folderId || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  folderId: e.target.value || undefined 
                }))}
                className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500"
              >
                <option value="">未分类</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">标签</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新建标签"
                    className="bg-white dark:bg-gray-800"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => {
                    const isSelected = formData.tags.includes(tag.id);
                    return (
                      <Badge
                        key={tag.id}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all duration-200",
                          isSelected 
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        onClick={() => handleTagToggle(tag.id)}
                      >
                        {tag.name}
                        {isSelected && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">内容</label>
              <div>
                {showPreview ? (
                  <div className="min-h-[300px] p-4 border rounded-md bg-white dark:bg-gray-800 prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100" {...props} />,
                        p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700 dark:text-gray-300" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) => 
                          inline ? (
                            <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200" {...props}>
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto" {...props}>
                              {children}
                            </code>
                          ),
                        pre: ({node, ...props}) => <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-3 overflow-x-auto" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-3 text-gray-600 dark:text-gray-400" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                        em: ({node, ...props}) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
                      }}
                    >
                      {formData.content || '*预览内容将在这里显示...*'}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="请输入提示词内容，支持 Markdown 格式"
                    className="min-h-[300px] resize-none bg-white dark:bg-gray-800 font-mono"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t bg-white dark:bg-gray-900">
              <Button variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};