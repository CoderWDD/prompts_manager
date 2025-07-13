export interface Prompt {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  contentLength: number;
  wordCount: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
}

export interface FeishuConfig {
  webhookUrl: string;
  enabled: boolean;
  messageFormat: 'markdown' | 'card';
}

export interface AppSettings {
  feishu: FeishuConfig;
  theme: 'light' | 'dark' | 'system';
  defaultFolder?: string;
}

export interface SearchFilters {
  query: string;
  selectedTags: string[];
  selectedFolder?: string;
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'contentLength';
  sortOrder: 'asc' | 'desc';
}

export interface ExportData {
  prompts: Prompt[];
  folders: Folder[];
  tags: Tag[];
  settings: AppSettings;
  exportedAt: Date;
  version: string;
}

export type ViewMode = 'cards' | 'list';
export type PromptFormData = Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'contentLength' | 'wordCount'>;