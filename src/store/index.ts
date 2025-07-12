import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Prompt, Folder, Tag, AppSettings, SearchFilters, ViewMode } from '@/types';
import { generateId, calculateWordCount } from '@/lib/utils';

interface AppState {
  // Data
  prompts: Prompt[];
  folders: Folder[];
  tags: Tag[];
  settings: AppSettings;
  
  // UI State
  searchFilters: SearchFilters;
  viewMode: ViewMode;
  selectedPrompt: Prompt | null;
  isEditing: boolean;
  
  // Actions
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'contentLength' | 'wordCount'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  duplicatePrompt: (id: string) => void;
  
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  
  addTag: (tag: Omit<Tag, 'id' | 'createdAt'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedPrompt: (prompt: Prompt | null) => void;
  setIsEditing: (editing: boolean) => void;
  
  // Import/Export
  exportData: () => string;
  importData: (data: string) => boolean;
  
  // Clear all data
  clearAllData: () => void;
}

const initialSettings: AppSettings = {
  feishu: {
    webhookUrl: '',
    enabled: false,
    messageFormat: 'markdown'
  },
  theme: 'system'
};

const initialSearchFilters: SearchFilters = {
  query: '',
  selectedTags: [],
  selectedFolder: undefined,
  sortBy: 'updatedAt',
  sortOrder: 'desc'
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      prompts: [],
      folders: [],
      tags: [],
      settings: initialSettings,
      searchFilters: initialSearchFilters,
      viewMode: 'cards',
      selectedPrompt: null,
      isEditing: false,
      
      // Prompt actions
      addPrompt: (promptData) => {
        const now = new Date();
        const prompt: Prompt = {
          ...promptData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          contentLength: promptData.content.length,
          wordCount: calculateWordCount(promptData.content)
        };
        
        set((state) => ({
          prompts: [...state.prompts, prompt]
        }));
      },
      
      updatePrompt: (id, updates) => {
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === id
              ? {
                  ...prompt,
                  ...updates,
                  updatedAt: new Date(),
                  contentLength: updates.content ? updates.content.length : prompt.contentLength,
                  wordCount: updates.content ? calculateWordCount(updates.content) : prompt.wordCount
                }
              : prompt
          )
        }));
      },
      
      deletePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
          selectedPrompt: state.selectedPrompt?.id === id ? null : state.selectedPrompt
        }));
      },
      
      duplicatePrompt: (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        if (prompt) {
          const now = new Date();
          const duplicated: Prompt = {
            ...prompt,
            id: generateId(),
            title: `${prompt.title} (副本)`,
            createdAt: now,
            updatedAt: now
          };
          set((state) => ({
            prompts: [...state.prompts, duplicated]
          }));
        }
      },
      
      // Folder actions
      addFolder: (folderData) => {
        const now = new Date();
        const folder: Folder = {
          ...folderData,
          id: generateId(),
          createdAt: now,
          updatedAt: now
        };
        
        set((state) => ({
          folders: [...state.folders, folder]
        }));
      },
      
      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id
              ? { ...folder, ...updates, updatedAt: new Date() }
              : folder
          )
        }));
      },
      
      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          prompts: state.prompts.map((prompt) =>
            prompt.folderId === id ? { ...prompt, folderId: undefined } : prompt
          )
        }));
      },
      
      // Tag actions
      addTag: (tagData) => {
        const tag: Tag = {
          ...tagData,
          id: generateId(),
          createdAt: new Date()
        };
        
        set((state) => ({
          tags: [...state.tags, tag]
        }));
      },
      
      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...updates } : tag
          )
        }));
      },
      
      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          prompts: state.prompts.map((prompt) => ({
            ...prompt,
            tags: prompt.tags.filter((tagId) => tagId !== id)
          }))
        }));
      },
      
      // Settings and UI actions
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      
      updateSearchFilters: (filters) => {
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters }
        }));
      },
      
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },
      
      setSelectedPrompt: (prompt) => {
        set({ selectedPrompt: prompt });
      },
      
      setIsEditing: (editing) => {
        set({ isEditing: editing });
      },
      
      // Import/Export
      exportData: () => {
        const state = get();
        const exportData = {
          prompts: state.prompts,
          folders: state.folders,
          tags: state.tags,
          settings: state.settings,
          exportedAt: new Date(),
          version: '1.0.0'
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.prompts && parsed.folders && parsed.tags) {
            set({
              prompts: parsed.prompts,
              folders: parsed.folders,
              tags: parsed.tags,
              settings: { ...initialSettings, ...parsed.settings }
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      
      clearAllData: () => {
        set({
          prompts: [],
          folders: [],
          tags: [],
          settings: initialSettings,
          searchFilters: initialSearchFilters,
          selectedPrompt: null,
          isEditing: false
        });
      }
    }),
    {
      name: 'prompts-manager-storage',
      partialize: (state) => ({
        prompts: state.prompts,
        folders: state.folders,
        tags: state.tags,
        settings: state.settings,
        viewMode: state.viewMode
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          
          // Convert date strings back to Date objects
          if (parsed.state.prompts) {
            parsed.state.prompts = parsed.state.prompts.map((prompt: any) => ({
              ...prompt,
              createdAt: new Date(prompt.createdAt),
              updatedAt: new Date(prompt.updatedAt)
            }));
          }
          
          if (parsed.state.folders) {
            parsed.state.folders = parsed.state.folders.map((folder: any) => ({
              ...folder,
              createdAt: new Date(folder.createdAt),
              updatedAt: new Date(folder.updatedAt)
            }));
          }
          
          if (parsed.state.tags) {
            parsed.state.tags = parsed.state.tags.map((tag: any) => ({
              ...tag,
              createdAt: new Date(tag.createdAt)
            }));
          }
          
          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        }
      }
    }
  )
);