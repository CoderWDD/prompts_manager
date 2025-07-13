'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Folder, Plus, Edit, Trash2, X } from 'lucide-react';

interface FolderManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FolderManager = ({ isOpen, onClose }: FolderManagerProps) => {
  const { folders, tags, addFolder, updateFolder, deleteFolder, addTag, updateTag, deleteTag } = useAppStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName.trim() });
      setNewFolderName('');
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim() });
      setNewTagName('');
    }
  };

  const handleEditFolder = (id: string, name: string) => {
    setEditingFolder(id);
    setEditName(name);
  };

  const handleEditTag = (id: string, name: string) => {
    setEditingTag(id);
    setEditName(name);
  };

  const handleSaveFolder = () => {
    if (editingFolder && editName.trim()) {
      updateFolder(editingFolder, { name: editName.trim() });
      setEditingFolder(null);
      setEditName('');
    }
  };

  const handleSaveTag = () => {
    if (editingTag && editName.trim()) {
      updateTag(editingTag, { name: editName.trim() });
      setEditingTag(null);
      setEditName('');
    }
  };

  const handleDeleteFolder = (id: string, name: string) => {
    if (confirm(`确定要删除文件夹 "${name}" 吗？文件夹内的提示词将移动到未分类。`)) {
      deleteFolder(id);
    }
  };

  const handleDeleteTag = (id: string, name: string) => {
    if (confirm(`确定要删除标签 "${name}" 吗？`)) {
      deleteTag(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white dark:bg-gray-900 border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-900 border-b">
          <CardTitle>分类管理</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto space-y-6 bg-white dark:bg-gray-900">
          {/* Folder Management */}
          <div>
            <h3 className="text-lg font-medium mb-3">文件夹管理</h3>
            
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="新建文件夹"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-white dark:bg-gray-800"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFolder();
                  }
                }}
              />
              <Button onClick={handleAddFolder}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {folders.map(folder => (
                <div key={folder.id} className="flex items-center gap-2 p-2 border rounded bg-white dark:bg-gray-800">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  {editingFolder === folder.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white dark:bg-gray-700"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveFolder();
                          }
                          if (e.key === 'Escape') {
                            setEditingFolder(null);
                            setEditName('');
                          }
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveFolder}>
                        保存
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingFolder(null)}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{folder.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditFolder(folder.id, folder.name)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFolder(folder.id, folder.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
              {folders.length === 0 && (
                <p className="text-muted-foreground text-sm">还没有创建任何文件夹</p>
              )}
            </div>
          </div>

          {/* Tag Management */}
          <div>
            <h3 className="text-lg font-medium mb-3">标签管理</h3>
            
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="新建标签"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="bg-white dark:bg-gray-800"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center gap-1">
                  {editingTag === tag.id ? (
                    <div className="flex gap-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-20 h-6 text-xs bg-white dark:bg-gray-700"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveTag();
                          }
                          if (e.key === 'Escape') {
                            setEditingTag(null);
                            setEditName('');
                          }
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleSaveTag} className="h-6 px-2 text-xs">
                        保存
                      </Button>
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer group"
                      onClick={() => handleEditTag(tag.id, tag.name)}
                    >
                      {tag.name}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-0 ml-1 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTag(tag.id, tag.name);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              ))}
              {tags.length === 0 && (
                <p className="text-muted-foreground text-sm">还没有创建任何标签</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};