import Dexie, { Table } from 'dexie';
import { Prompt, Folder, Tag, AppSettings } from '@/types';

export class PromptsDatabase extends Dexie {
  prompts!: Table<Prompt>;
  folders!: Table<Folder>;
  tags!: Table<Tag>;
  settings!: Table<AppSettings & { id: number }>;

  constructor() {
    super('PromptsManagerDB');
    this.version(1).stores({
      prompts: 'id, title, folderId, *tags, createdAt, updatedAt',
      folders: 'id, name, parentId, createdAt, updatedAt',
      tags: 'id, name, createdAt',
      settings: 'id'
    });
  }
}

export const db = new PromptsDatabase();

export class StorageService {
  static async savePrompt(prompt: Prompt): Promise<void> {
    await db.prompts.put(prompt);
  }

  static async getPrompts(): Promise<Prompt[]> {
    return await db.prompts.orderBy('updatedAt').reverse().toArray();
  }

  static async getPrompt(id: string): Promise<Prompt | undefined> {
    return await db.prompts.get(id);
  }

  static async deletePrompt(id: string): Promise<void> {
    await db.prompts.delete(id);
  }

  static async saveFolder(folder: Folder): Promise<void> {
    await db.folders.put(folder);
  }

  static async getFolders(): Promise<Folder[]> {
    return await db.folders.orderBy('name').toArray();
  }

  static async deleteFolder(id: string): Promise<void> {
    await db.folders.delete(id);
    const prompts = await db.prompts.where('folderId').equals(id).toArray();
    for (const prompt of prompts) {
      await db.prompts.update(prompt.id, { folderId: undefined });
    }
  }

  static async saveTag(tag: Tag): Promise<void> {
    await db.tags.put(tag);
  }

  static async getTags(): Promise<Tag[]> {
    return await db.tags.orderBy('name').toArray();
  }

  static async deleteTag(id: string): Promise<void> {
    await db.tags.delete(id);
    const prompts = await db.prompts.toArray();
    for (const prompt of prompts) {
      if (prompt.tags.includes(id)) {
        const updatedTags = prompt.tags.filter(tagId => tagId !== id);
        await db.prompts.update(prompt.id, { tags: updatedTags });
      }
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    await db.settings.put({ ...settings, id: 1 });
  }

  static async getSettings(): Promise<AppSettings | undefined> {
    const result = await db.settings.get(1);
    if (result) {
      const { id, ...settings } = result;
      return settings;
    }
    return undefined;
  }

  static async searchPrompts(query: string): Promise<Prompt[]> {
    const prompts = await db.prompts.toArray();
    const searchTerm = query.toLowerCase();
    
    return prompts.filter(prompt =>
      prompt.title.toLowerCase().includes(searchTerm) ||
      prompt.content.toLowerCase().includes(searchTerm)
    );
  }

  static async getPromptsByFolder(folderId: string): Promise<Prompt[]> {
    return await db.prompts.where('folderId').equals(folderId).toArray();
  }

  static async getPromptsByTag(tagId: string): Promise<Prompt[]> {
    const prompts = await db.prompts.toArray();
    return prompts.filter(prompt => prompt.tags.includes(tagId));
  }

  static async exportAllData(): Promise<string> {
    const [prompts, folders, tags, settings] = await Promise.all([
      this.getPrompts(),
      this.getFolders(),
      this.getTags(),
      this.getSettings()
    ]);

    const exportData = {
      prompts,
      folders,
      tags,
      settings: settings || {},
      exportedAt: new Date(),
      version: '1.0.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  static async importAllData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.prompts || !Array.isArray(data.prompts)) {
        throw new Error('Invalid data format');
      }

      await db.transaction('rw', db.prompts, db.folders, db.tags, db.settings, async () => {
        await db.prompts.clear();
        await db.folders.clear();
        await db.tags.clear();
        await db.settings.clear();

        if (data.prompts.length > 0) {
          await db.prompts.bulkAdd(data.prompts);
        }
        
        if (data.folders && data.folders.length > 0) {
          await db.folders.bulkAdd(data.folders);
        }
        
        if (data.tags && data.tags.length > 0) {
          await db.tags.bulkAdd(data.tags);
        }
        
        if (data.settings) {
          await db.settings.put({ ...data.settings, id: 1 });
        }
      });

      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  static async clearAllData(): Promise<void> {
    await db.transaction('rw', db.prompts, db.folders, db.tags, db.settings, async () => {
      await db.prompts.clear();
      await db.folders.clear();
      await db.tags.clear();
      await db.settings.clear();
    });
  }
}

export const downloadFile = (content: string, filename: string, mimeType: string = 'application/json'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file);
  });
};