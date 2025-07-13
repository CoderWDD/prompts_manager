'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import { Sidebar } from '@/components/Sidebar';
import { MainHeader } from '@/components/MainHeader';
import { PromptCard } from '@/components/PromptCard';
import { PromptEditor } from '@/components/PromptEditor';
import { PromptViewer } from '@/components/PromptViewer';
import { FolderManager } from '@/components/FolderManager';
import { EmptyState } from '@/components/EmptyState';
import { Prompt, PromptFormData } from '@/types';
import { SettingsModal } from '@/components/SettingsModal';
import { sendPromptToFeishu } from '@/lib/feishu';
import { readFileAsText, downloadFile } from '@/lib/storage';

export default function Home() {
  const {
    prompts,
    searchFilters,
    viewMode,
    settings,
    addPrompt,
    updatePrompt,
    exportData,
    importData
  } = useAppStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  const [isFolderManagerOpen, setIsFolderManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);

  // Filter and sort prompts based on search criteria
  const filteredPrompts = useMemo(() => {
    let filtered = [...prompts];

    // Apply text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query)
      );
    }

    // Apply folder filter
    if (searchFilters.selectedFolder) {
      filtered = filtered.filter(prompt => prompt.folderId === searchFilters.selectedFolder);
    }

    // Apply tag filters
    if (searchFilters.selectedTags.length > 0) {
      filtered = filtered.filter(prompt =>
        searchFilters.selectedTags.some(tagId => prompt.tags.includes(tagId))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const getValue = (prompt: Prompt) => {
        switch (searchFilters.sortBy) {
          case 'title':
            return prompt.title.toLowerCase();
          case 'createdAt':
            return prompt.createdAt.getTime();
          case 'updatedAt':
            return prompt.updatedAt.getTime();
          case 'contentLength':
            return prompt.contentLength;
          default:
            return prompt.updatedAt.getTime();
        }
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (searchFilters.sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [prompts, searchFilters]);

  const hasFilters = !!(searchFilters.query || 
                        searchFilters.selectedFolder || 
                        searchFilters.selectedTags.length > 0);

  const handleNewPrompt = () => {
    setEditingPrompt(undefined);
    setIsEditorOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsEditorOpen(true);
  };

  const handleViewPrompt = (prompt: Prompt) => {
    setViewingPrompt(prompt);
  };

  const handleSavePrompt = async (promptData: PromptFormData) => {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, promptData);
      
      // Send Feishu notification for update
      if (settings.feishu.enabled) {
        try {
          const updatedPrompt = { ...editingPrompt, ...promptData, updatedAt: new Date() };
          await sendPromptToFeishu(updatedPrompt, 'updated', settings.feishu);
        } catch (error) {
          console.error('Failed to send Feishu notification:', error);
        }
      }
    } else {
      addPrompt(promptData);
      
      // Send Feishu notification for new prompt
      if (settings.feishu.enabled) {
        try {
          // Create a temporary prompt object for notification
          const newPrompt: Prompt = {
            ...promptData,
            id: 'temp',
            createdAt: new Date(),
            updatedAt: new Date(),
            contentLength: promptData.content.length,
            wordCount: promptData.content.split(/\s+/).filter(word => word.length > 0).length
          };
          await sendPromptToFeishu(newPrompt, 'created', settings.feishu);
        } catch (error) {
          console.error('Failed to send Feishu notification:', error);
        }
      }
    }
  };

  const handleExport = () => {
    const data = exportData();
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(data, `prompts-backup-${timestamp}.json`);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const content = await readFileAsText(file);
          const success = importData(content);
          if (success) {
            alert('导入成功！');
          } else {
            alert('导入失败，请检查文件格式。');
          }
        } catch {
          alert('读取文件失败。');
        }
      }
    };
    input.click();
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        onNewPrompt={handleNewPrompt}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <MainHeader
          onImport={handleImport}
          onExport={handleExport}
          onSettings={handleSettings}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {filteredPrompts.length === 0 ? (
              <EmptyState 
                onNewPrompt={handleNewPrompt}
                hasFilters={hasFilters}
              />
            ) : (
              <div className={
                viewMode === 'cards' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }>
                {filteredPrompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onEdit={handleEditPrompt}
                    onView={handleViewPrompt}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <PromptEditor
        prompt={editingPrompt}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSavePrompt}
      />

      <PromptViewer
        prompt={viewingPrompt}
        isOpen={!!viewingPrompt}
        onClose={() => setViewingPrompt(null)}
        onEdit={(prompt) => {
          setViewingPrompt(null);
          setEditingPrompt(prompt);
          setIsEditorOpen(true);
        }}
      />

      <FolderManager
        isOpen={isFolderManagerOpen}
        onClose={() => setIsFolderManagerOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
