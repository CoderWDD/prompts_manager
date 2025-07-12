'use client';

import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onNewPrompt: () => void;
  hasFilters: boolean;
}

export const EmptyState = ({ onNewPrompt, hasFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {hasFilters ? '没有找到符合条件的Prompt' : '没有找到任何Prompt'}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {hasFilters 
          ? '尝试调整搜索条件或清除筛选器来查看更多内容' 
          : '开始创建您的第一个Prompt，让AI助手更好地为您服务'
        }
      </p>
      
      {!hasFilters && (
        <Button onClick={onNewPrompt} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          点击创建新Prompt
        </Button>
      )}
    </div>
  );
};