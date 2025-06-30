'use client';

import { useState, useCallback, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { SnippetCard } from '@/components/snippet-card';
import { SnippetEditor } from '@/components/snippet-editor';
import { SearchFilterBar } from '@/components/search-filter-bar';
import { useSnippets } from '@/hooks/use-snippets';
import { useCollections } from '@/hooks/use-collections';
import { Snippet } from '@/types/snippet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { FileText, Code2 } from 'lucide-react';
import { loadSampleData } from '@/lib/sample-snippets';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; snippetId?: string }>({ isOpen: false });

  const {
    snippets,
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
    exportSnippets,
    importSnippets,
  } = useSnippets();

  const { collections } = useCollections();

  // Load sample data on first visit
  useEffect(() => {
    loadSampleData();
  }, []);

  const handleCreateSnippet = useCallback(() => {
    setEditingSnippet(undefined);
    setIsEditorOpen(true);
  }, []);

  const handleEditSnippet = useCallback((snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsEditorOpen(true);
  }, []);

  const handleSaveSnippet = useCallback((snippetData: Partial<Snippet>) => {
    if (editingSnippet) {
      updateSnippet(editingSnippet.id, snippetData);
      toast.success('Snippet updated successfully!');
    } else {
      createSnippet(
        snippetData.title || 'Untitled Snippet',
        snippetData.code || '',
        snippetData.description,
        snippetData.language,
        snippetData.tags,
        snippetData.collection
      );
      toast.success('Snippet created successfully!');
    }
  }, [editingSnippet, updateSnippet, createSnippet]);

  const handleDeleteSnippet = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, snippetId: id });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirm.snippetId) {
      deleteSnippet(deleteConfirm.snippetId);
      toast.success('Snippet deleted successfully!');
    }
    setDeleteConfirm({ isOpen: false });
  }, [deleteConfirm.snippetId, deleteSnippet]);

  const handleDuplicate = useCallback((id: string) => {
    const newSnippet = duplicateSnippet(id);
    if (newSnippet) {
      toast.success('Snippet duplicated successfully!');
    }
  }, [duplicateSnippet]);

  const handleExport = useCallback((format: 'json' | 'markdown') => {
    try {
      const data = exportSnippets(format);
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/markdown' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snippets.${format === 'json' ? 'json' : 'md'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Snippets exported as ${format.toUpperCase()}`);
    } catch {
      toast.error('Failed to export snippets');
    }
  }, [exportSnippets]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const result = importSnippets(data);
            if (result.success) {
              toast.success(result.message);
                         } else {
               toast.error(result.message);
             }
           } catch {
             toast.error('Failed to import snippets');
           }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [importSnippets]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const isTyping = (e.target as HTMLElement)?.tagName === 'INPUT' || 
                      (e.target as HTMLElement)?.tagName === 'TEXTAREA';
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'n' && !isTyping) {
        e.preventDefault();
        handleCreateSnippet();
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !isTyping) {
        e.preventDefault();
        // Focus search input
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateSnippet]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Code2 className="h-16 w-16 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading your snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Code2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">PatchWork</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘</kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">N</kbd>
                  <span>New snippet</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘</kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>
                  <span>Search</span>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Your offline-first code snippet manager • All data stored locally
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onCreateSnippet={handleCreateSnippet}
            onExport={handleExport}
            onImport={handleImport}
            tags={allTags}
            languages={allLanguages}
            collections={collections.map(c => ({ id: c.id, name: c.name }))}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {snippets.length} snippet{snippets.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Snippets Grid */}
        {snippets.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || Object.keys(filters).length > 0 ? 'No snippets found' : 'Welcome to PatchWork!'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {searchQuery || Object.keys(filters).length > 0 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Your offline-first code snippet manager. We\'ve loaded some sample snippets to get you started, or create your own!'
              }
            </p>
            {!searchQuery && Object.keys(filters).length === 0 && (
              <div className="space-y-3">
                <Button onClick={handleCreateSnippet} size="lg">
                  Create Your First Snippet
                </Button>
                <p className="text-sm text-muted-foreground">
                  All your snippets are stored locally and work offline. Use tags, collections, and search to organize your code.
                </p>
              </div>
            )}
          </div>
        ) : (
          <ScrollArea>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              {snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={handleEditSnippet}
                  onDelete={handleDeleteSnippet}
                  onToggleFavorite={toggleFavorite}
                  onTogglePin={togglePinned}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Snippet Editor Dialog */}
        <SnippetEditor
          snippet={editingSnippet}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveSnippet}
          collections={collections.map(c => ({ id: c.id, name: c.name }))}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => setDeleteConfirm({ isOpen: open })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this snippet? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </div>
  );
}
