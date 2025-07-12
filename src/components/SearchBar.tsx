'use client';

import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, Plus, Upload, Download, Settings } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onNewPrompt: () => void;
  onImport: () => void;
  onExport: () => void;
  onSettings: () => void;
}

export const SearchBar = ({ onNewPrompt, onImport, onExport, onSettings }: SearchBarProps) => {
  const { 
    searchFilters, 
    updateSearchFilters, 
    viewMode, 
    setViewMode, 
    tags, 
    folders 
  } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  const handleTagFilter = (tagId: string) => {
    const currentTags = searchFilters.selectedTags;
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    updateSearchFilters({ selectedTags: newTags });
  };

  const handleFolderFilter = (folderId: string) => {
    updateSearchFilters({ 
      selectedFolder: searchFilters.selectedFolder === folderId ? undefined : folderId 
    });
  };

  const clearFilters = () => {
    updateSearchFilters({
      query: '',
      selectedTags: [],
      selectedFolder: undefined
    });
  };

  const getTagName = (tagId: string) => {
    return tags.find(tag => tag.id === tagId)?.name || tagId;
  };

  const getFolderName = (folderId: string) => {
    return folders.find(folder => folder.id === folderId)?.name || '未分类';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索提示词..."
            value={searchFilters.query}
            onChange={(e) => updateSearchFilters({ query: e.target.value })}
            className="pl-10 bg-white dark:bg-gray-800"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('cards')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={onNewPrompt}>
            <Plus className="h-4 w-4 mr-2" />
            新建
          </Button>
          
          <Button variant="outline" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
          
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          
          <Button variant="outline" onClick={onSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">筛选选项</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              清除筛选
            </Button>
          </div>

          {/* Folder Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">文件夹</label>
            <div className="flex flex-wrap gap-1">
              {folders.map(folder => (
                <Badge
                  key={folder.id}
                  variant={searchFilters.selectedFolder === folder.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleFolderFilter(folder.id)}
                >
                  📁 {folder.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">标签</label>
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <Badge
                  key={tag.id}
                  variant={searchFilters.selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagFilter(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-medium mb-2 block">排序</label>
            <div className="flex gap-2">
              <select
                value={searchFilters.sortBy}
                onChange={(e) => updateSearchFilters({ 
                  sortBy: e.target.value as 'createdAt' | 'updatedAt' | 'title' | 'contentLength'
                })}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="updatedAt">更新时间</option>
                <option value="createdAt">创建时间</option>
                <option value="title">标题</option>
                <option value="contentLength">内容长度</option>
              </select>
              
              <select
                value={searchFilters.sortOrder}
                onChange={(e) => updateSearchFilters({ 
                  sortOrder: e.target.value as 'asc' | 'desc'
                })}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchFilters.selectedTags.length > 0 || searchFilters.selectedFolder) && (
            <div>
              <label className="text-sm font-medium mb-2 block">当前筛选</label>
              <div className="flex flex-wrap gap-1">
                {searchFilters.selectedFolder && (
                  <Badge variant="secondary">
                    📁 {getFolderName(searchFilters.selectedFolder)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => updateSearchFilters({ selectedFolder: undefined })}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {searchFilters.selectedTags.map(tagId => (
                  <Badge key={tagId} variant="secondary">
                    {getTagName(tagId)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleTagFilter(tagId)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};