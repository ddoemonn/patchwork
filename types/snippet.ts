export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  collection?: string;
  isFavorite: boolean;
  isMarkdown: boolean;
  createdAt: Date;
  updatedAt: Date;
  history: SnippetVersion[];
  isPinned: boolean;
}

export interface SnippetVersion {
  id: string;
  snippetId: string;
  code: string;
  title: string;
  description?: string;
  timestamp: Date;
  changeNote?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  snippetIds: string[];
  syncEnabled: boolean;
  gitRepo?: string;
  lastSynced?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  name: string;
  color?: string;
  count: number;
}

export interface SearchFilters {
  language?: string;
  tags?: string[];
  collection?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoDetectLanguage: boolean;
  autoCopyOnSelect: boolean;
  showLineNumbers: boolean;
  enableHistory: boolean;
  maxHistoryVersions: number;
  defaultTemplate: string;
  hotkeys: Record<string, string>;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync?: Date;
  pendingChanges: number;
  conflicts: string[];
}

export type LanguageType = 
  | 'javascript' | 'typescript' | 'python' | 'java' | 'go' | 'rust'
  | 'cpp' | 'c' | 'csharp' | 'php' | 'ruby' | 'swift' | 'kotlin'
  | 'dart' | 'bash' | 'powershell' | 'sql' | 'html' | 'css' | 'scss'
  | 'json' | 'yaml' | 'xml' | 'markdown' | 'plaintext';

export interface Template {
  id: string;
  name: string;
  description: string;
  code: string;
  language: LanguageType;
  category: string;
  variables?: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
} 