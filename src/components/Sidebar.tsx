'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Folder, Plus, FolderOpen, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNewPrompt: () => void;
}

export const Sidebar = ({ onNewPrompt }: SidebarProps) => {
  const { 
    folders, 
    tags, 
    prompts, 
    searchFilters, 
    updateSearchFilters,
    addFolder,
    addTag
  } = useAppStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [showNewTag, setShowNewTag] = useState(false);

  const handleFolderSelect = (folderId?: string) => {
    updateSearchFilters({ 
      selectedFolder: folderId,
      // Don't clear tags when switching folders
    });
  };

  const handleTagSelect = (tagId: string) => {
    const currentTags = searchFilters.selectedTags;
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    updateSearchFilters({ selectedTags: newTags });
  };

  const getPromptCountInFolder = (folderId?: string) => {
    return prompts.filter(prompt => prompt.folderId === folderId).length;
  };

  const getPromptCountWithTag = (tagId: string) => {
    return prompts.filter(prompt => prompt.tags.includes(tagId)).length;
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName.trim() });
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim() });
      setNewTagName('');
      setShowNewTag(false);
    }
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button 
          onClick={onNewPrompt}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          新建Prompt
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Folders Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">分类</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNewFolder(true)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* All Prompts */}
          <div 
            className={cn(
              "flex items-center gap-2 p-2 rounded-md cursor-pointer mb-1 text-sm",
              !searchFilters.selectedFolder 
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            )}
            onClick={() => handleFolderSelect(undefined)}
          >
            <FolderOpen className="h-4 w-4" />
            <span className="flex-1">全部</span>
            <span className="text-xs text-gray-500">{getPromptCountInFolder()}</span>
          </div>

          {/* Folder List */}
          {folders.map(folder => (
            <div 
              key={folder.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md cursor-pointer mb-1 text-sm",
                searchFilters.selectedFolder === folder.id
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
              onClick={() => handleFolderSelect(folder.id)}
            >
              <Folder className="h-4 w-4" />
              <span className="flex-1 truncate">{folder.name}</span>
              <span className="text-xs text-gray-500">{getPromptCountInFolder(folder.id)}</span>
            </div>
          ))}

          {/* New Folder Input */}
          {showNewFolder && (
            <div className="mt-2">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="文件夹名称"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') setShowNewFolder(false);
                }}
                onBlur={() => setShowNewFolder(false)}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="p-4 pt-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">标签</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNewTag(true)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Tag List */}
          {tags.map(tag => (
            <div 
              key={tag.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md cursor-pointer mb-1 text-sm",
                searchFilters.selectedTags.includes(tag.id)
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
              onClick={() => handleTagSelect(tag.id)}
            >
              <Hash className="h-4 w-4" />
              <span className="flex-1 truncate">{tag.name}</span>
              <span className="text-xs text-gray-500">{getPromptCountWithTag(tag.id)}</span>
            </div>
          ))}

          {/* New Tag Input */}
          {showNewTag && (
            <div className="mt-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="标签名称"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateTag();
                  if (e.key === 'Escape') setShowNewTag(false);
                }}
                onBlur={() => setShowNewTag(false)}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};