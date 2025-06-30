import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Snippet, SnippetVersion, SearchFilters } from '@/types/snippet';
import { snippetStorage } from '@/lib/storage';

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load snippets from localStorage on mount
  useEffect(() => {
    const loadSnippets = () => {
      try {
        const stored = snippetStorage.getAll();
        setSnippets(stored);
      } catch (error) {
        console.error('Failed to load snippets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSnippets();
  }, []);

  // Create a new snippet
  const createSnippet = useCallback((
    title: string,
    code: string,
    description?: string,
    language?: string,
    tags: string[] = [],
    collection?: string
  ): Snippet => {
    const now = new Date();
    const detectedLanguage = language || 'javascript'; // detectLanguage(code);
    
    const snippet: Snippet = {
      id: uuidv4(),
      title: title.trim() || 'Untitled Snippet',
      description: description?.trim(),
      code,
      language: detectedLanguage,
      tags: tags.map(tag => tag.toLowerCase().trim()).filter(Boolean),
      collection,
      isFavorite: false,
      isMarkdown: detectedLanguage === 'markdown',
      createdAt: now,
      updatedAt: now,
      history: [],
      isPinned: false,
    };

    setSnippets(prev => {
      const updated = [...prev, snippet];
      snippetStorage.bulkSave(updated);
      return updated;
    });

    return snippet;
  }, []);

  // Update an existing snippet
  const updateSnippet = useCallback((id: string, updates: Partial<Snippet>) => {
    setSnippets(prev => {
      const updated = prev.map(snippet => {
        if (snippet.id !== id) return snippet;

        const now = new Date();
        const hasCodeChanged = updates.code && updates.code !== snippet.code;
        
        // Create history entry if code changed
        let newHistory = snippet.history;
        if (hasCodeChanged) {
          const historyEntry: SnippetVersion = {
            id: uuidv4(),
            snippetId: id,
            code: snippet.code,
            title: snippet.title,
            description: snippet.description,
            timestamp: snippet.updatedAt,
            changeNote: updates.title !== snippet.title ? 'Title updated' : 'Code updated',
          };
          
          newHistory = [historyEntry, ...snippet.history].slice(0, 10); // Keep last 10 versions
        }

        const updatedSnippet: Snippet = {
          ...snippet,
          ...updates,
          updatedAt: now,
          history: newHistory,
          language: updates.code ? 'javascript' : snippet.language, // detectLanguage would go here
        };

        return updatedSnippet;
      });

      snippetStorage.bulkSave(updated);
      return updated;
    });
  }, []);

  // Delete a snippet
  const deleteSnippet = useCallback((id: string) => {
    setSnippets(prev => {
      const updated = prev.filter(snippet => snippet.id !== id);
      snippetStorage.bulkSave(updated);
      return updated;
    });
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string) => {
    updateSnippet(id, { isFavorite: !snippets.find(s => s.id === id)?.isFavorite });
  }, [snippets, updateSnippet]);

  // Toggle pinned status
  const togglePinned = useCallback((id: string) => {
    updateSnippet(id, { isPinned: !snippets.find(s => s.id === id)?.isPinned });
  }, [snippets, updateSnippet]);

  // Duplicate a snippet
  const duplicateSnippet = useCallback((id: string): Snippet | null => {
    const original = snippets.find(s => s.id === id);
    if (!original) return null;

    return createSnippet(
      `${original.title} (Copy)`,
      original.code,
      original.description,
      original.language,
      original.tags,
      original.collection
    );
  }, [snippets, createSnippet]);

  // Add tags to a snippet
  const addTags = useCallback((id: string, newTags: string[]) => {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return;

    const uniqueTags = Array.from(new Set([
      ...snippet.tags,
      ...newTags.map(tag => tag.toLowerCase().trim()).filter(Boolean)
    ]));

    updateSnippet(id, { tags: uniqueTags });
  }, [snippets, updateSnippet]);

  // Remove tags from a snippet
  const removeTags = useCallback((id: string, tagsToRemove: string[]) => {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return;

    const filteredTags = snippet.tags.filter(
      tag => !tagsToRemove.map(t => t.toLowerCase()).includes(tag.toLowerCase())
    );

    updateSnippet(id, { tags: filteredTags });
  }, [snippets, updateSnippet]);

  // Filter and search snippets
  const filteredSnippets = useMemo(() => {
    let result = [...snippets];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description?.toLowerCase().includes(query) ||
        snippet.code.toLowerCase().includes(query) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.language) {
      result = result.filter(snippet => snippet.language === filters.language);
    }

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(snippet =>
        filters.tags!.every(tag =>
          snippet.tags.some(snippetTag =>
            snippetTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    if (filters.collection) {
      result = result.filter(snippet => snippet.collection === filters.collection);
    }

    if (filters.isFavorite !== undefined) {
      result = result.filter(snippet => snippet.isFavorite === filters.isFavorite);
    }

    if (filters.isPinned !== undefined) {
      result = result.filter(snippet => snippet.isPinned === filters.isPinned);
    }

    // Sort: pinned first, then by updated date
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return result;
  }, [snippets, searchQuery, filters]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    
    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [snippets]);

  // Get all unique languages
  const allLanguages = useMemo(() => {
    const languageCounts = new Map<string, number>();
    
    snippets.forEach(snippet => {
      languageCounts.set(snippet.language, (languageCounts.get(snippet.language) || 0) + 1);
    });

    return Array.from(languageCounts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [snippets]);

  // Get snippet by ID
  const getSnippet = useCallback((id: string) => {
    return snippets.find(snippet => snippet.id === id);
  }, [snippets]);

  // Export snippets
  const exportSnippets = useCallback((format: 'json' | 'markdown' = 'json') => {
    if (format === 'json') {
      return snippetStorage.exportToJson();
    }
    
    // Markdown export
    const markdown = filteredSnippets.map(snippet => {
      const tags = snippet.tags.length > 0 ? `\nTags: ${snippet.tags.join(', ')}` : '';
      const description = snippet.description ? `\n${snippet.description}` : '';
      
      return `# ${snippet.title}${description}${tags}

\`\`\`${snippet.language}
${snippet.code}
\`\`\`

---
`;
    }).join('\n');

    return markdown;
  }, [filteredSnippets]);

  // Import snippets
  const importSnippets = useCallback((data: string) => {
    const result = snippetStorage.importFromJson(data);
    if (result.success) {
      // Reload snippets from storage
      const updated = snippetStorage.getAll();
      setSnippets(updated);
    }
    return result;
  }, []);

  return {
    snippets: filteredSnippets,
    allSnippets: snippets,
    isLoading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    allTags,
    allLanguages,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
    togglePinned,
    duplicateSnippet,
    addTags,
    removeTags,
    getSnippet,
    exportSnippets,
    importSnippets,
  };
}; 