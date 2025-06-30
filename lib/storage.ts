import { Snippet, Collection, AppSettings, Template } from '@/types/snippet';

const STORAGE_KEYS = {
  SNIPPETS: 'patch-work-snippets',
  COLLECTIONS: 'patch-work-collections',
  SETTINGS: 'patch-work-settings',
  TEMPLATES: 'patch-work-templates',
} as const;

// Utility functions for localStorage
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error);
    }
  },
};

// Snippet storage functions
export const snippetStorage = {
  getAll: (): Snippet[] => {
    const snippets = storage.get<Snippet[]>(STORAGE_KEYS.SNIPPETS, []);
    // Convert date strings back to Date objects
    return snippets.map(snippet => ({
      ...snippet,
      createdAt: new Date(snippet.createdAt),
      updatedAt: new Date(snippet.updatedAt),
      history: snippet.history?.map(h => ({
        ...h,
        timestamp: new Date(h.timestamp),
      })) || [],
    }));
  },

  save: (snippet: Snippet): void => {
    const snippets = snippetStorage.getAll();
    const existingIndex = snippets.findIndex(s => s.id === snippet.id);
    
    if (existingIndex >= 0) {
      snippets[existingIndex] = snippet;
    } else {
      snippets.push(snippet);
    }
    
    storage.set(STORAGE_KEYS.SNIPPETS, snippets);
  },

  delete: (id: string): void => {
    const snippets = snippetStorage.getAll();
    const filtered = snippets.filter(s => s.id !== id);
    storage.set(STORAGE_KEYS.SNIPPETS, filtered);
  },

  bulkSave: (snippets: Snippet[]): void => {
    storage.set(STORAGE_KEYS.SNIPPETS, snippets);
  },

  exportToJson: (): string => {
    const data = {
      snippets: snippetStorage.getAll(),
      collections: collectionStorage.getAll(),
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  },

  importFromJson: (jsonString: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.snippets && Array.isArray(data.snippets)) {
        snippetStorage.bulkSave(data.snippets);
      }
      
      if (data.collections && Array.isArray(data.collections)) {
        collectionStorage.bulkSave(data.collections);
      }
      
      return { success: true, message: 'Import completed successfully' };
    } catch {
      return { success: false, message: 'Invalid JSON format' };
    }
  },
};

// Collection storage functions
export const collectionStorage = {
  getAll: (): Collection[] => {
    const collections = storage.get<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
    return collections.map(collection => ({
      ...collection,
      createdAt: new Date(collection.createdAt),
      updatedAt: new Date(collection.updatedAt),
      lastSynced: collection.lastSynced ? new Date(collection.lastSynced) : undefined,
    }));
  },

  save: (collection: Collection): void => {
    const collections = collectionStorage.getAll();
    const existingIndex = collections.findIndex(c => c.id === collection.id);
    
    if (existingIndex >= 0) {
      collections[existingIndex] = collection;
    } else {
      collections.push(collection);
    }
    
    storage.set(STORAGE_KEYS.COLLECTIONS, collections);
  },

  delete: (id: string): void => {
    const collections = collectionStorage.getAll();
    const filtered = collections.filter(c => c.id !== id);
    storage.set(STORAGE_KEYS.COLLECTIONS, filtered);
  },

  bulkSave: (collections: Collection[]): void => {
    storage.set(STORAGE_KEYS.COLLECTIONS, collections);
  },
};

// Settings storage functions
export const settingsStorage = {
  get: (): AppSettings => {
    return storage.get<AppSettings>(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      autoDetectLanguage: true,
      autoCopyOnSelect: false,
      showLineNumbers: true,
      enableHistory: true,
      maxHistoryVersions: 10,
      defaultTemplate: '',
      hotkeys: {
        'new-snippet': 'cmd+n',
        'search': 'cmd+k',
        'copy': 'cmd+c',
        'save': 'cmd+s',
      },
    });
  },

  save: (settings: AppSettings): void => {
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  },
};

// Template storage functions
export const templateStorage = {
  getAll: (): Template[] => {
    return storage.get<Template[]>(STORAGE_KEYS.TEMPLATES, []);
  },

  save: (template: Template): void => {
    const templates = templateStorage.getAll();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    storage.set(STORAGE_KEYS.TEMPLATES, templates);
  },

  delete: (id: string): void => {
    const templates = templateStorage.getAll();
    const filtered = templates.filter(t => t.id !== id);
    storage.set(STORAGE_KEYS.TEMPLATES, filtered);
  },

  getDefaults: (): Template[] => {
    return [
      {
        id: 'react-useeffect',
        name: 'React useEffect Hook',
        description: 'Basic useEffect with cleanup',
        code: `useEffect(() => {
  // Effect logic here
  
  return () => {
    // Cleanup logic here
  };
}, [/* dependencies */]);`,
        language: 'javascript',
        category: 'React',
      },
      {
        id: 'curl-request',
        name: 'cURL Request',
        description: 'Basic HTTP request with cURL',
        code: `curl -X {{method}} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer {{token}}" \\
  -d '{{data}}' \\
  {{url}}`,
        language: 'bash',
        category: 'HTTP',
        variables: [
          { name: 'method', description: 'HTTP method', defaultValue: 'GET', required: true },
          { name: 'token', description: 'Authorization token', required: false },
          { name: 'data', description: 'Request body', required: false },
          { name: 'url', description: 'Target URL', required: true },
        ],
      },
      {
        id: 'git-config',
        name: 'Git Configuration',
        description: 'Set up Git user configuration',
        code: `git config --global user.name "{{name}}"
git config --global user.email "{{email}}"
git config --global core.editor "{{editor}}"`,
        language: 'bash',
        category: 'Git',
        variables: [
          { name: 'name', description: 'Your full name', required: true },
          { name: 'email', description: 'Your email address', required: true },
          { name: 'editor', description: 'Preferred editor', defaultValue: 'code', required: false },
        ],
      },
    ];
  },
}; 