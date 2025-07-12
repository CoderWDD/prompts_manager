'use client';

import { useAppStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Grid, List, Settings, Download, Upload, SortAsc, SortDesc } from 'lucide-react';

interface MainHeaderProps {
  onImport: () => void;
  onExport: () => void;
  onSettings: () => void;
}

export const MainHeader = ({ onImport, onExport, onSettings }: MainHeaderProps) => {
  const { 
    searchFilters, 
    updateSearchFilters, 
    viewMode, 
    setViewMode,
    folders,
    tags,
    settings
  } = useAppStore();

  const getSelectedFolderName = () => {
    if (!searchFilters.selectedFolder) return '我的Prompt';
    const folder = folders.find(f => f.id === searchFilters.selectedFolder);
    return folder ? folder.name : '我的Prompt';
  };

  const getSelectedTagsText = () => {
    if (searchFilters.selectedTags.length === 0) return '';
    if (searchFilters.selectedTags.length === 1) {
      const tag = tags.find(t => t.id === searchFilters.selectedTags[0]);
      return tag ? ` · ${tag.name}` : '';
    }
    return ` · ${searchFilters.selectedTags.length} 个标签`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Main Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {getSelectedFolderName()}{getSelectedTagsText()}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button variant="outline" size="sm" onClick={onSettings} className="relative">
            <Settings className="h-4 w-4" />
            {settings.feishu.enabled && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </Button>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索Prompt..."
              value={searchFilters.query}
              onChange={(e) => updateSearchFilters({ query: e.target.value })}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 dark:text-gray-300"
            >
              📁 所有文件夹
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 dark:text-gray-300"
            >
              🏷️ 所有标签
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 dark:text-gray-300"
              onClick={() => {
                const newOrder = searchFilters.sortOrder === 'desc' ? 'asc' : 'desc';
                updateSearchFilters({ sortOrder: newOrder });
              }}
            >
              {searchFilters.sortOrder === 'desc' ? (
                <SortDesc className="h-4 w-4 mr-1" />
              ) : (
                <SortAsc className="h-4 w-4 mr-1" />
              )}
              最新创建
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};