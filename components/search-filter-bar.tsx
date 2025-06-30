'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Pin,
  Download,
  Upload,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchFilters } from '@/types/snippet';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onCreateSnippet: () => void;
  onExport: (format: 'json' | 'markdown') => void;
  onImport: () => void;
  tags: Array<{ name: string; count: number }>;
  languages: Array<{ name: string; count: number }>;
  collections: Array<{ id: string; name: string }>;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onCreateSnippet,
  onExport,
  onImport,
  tags,
  languages,
  collections,
}: SearchFilterBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({});
  };

  const toggleFavorites = () => {
    onFiltersChange({
      ...filters,
      isFavorite: filters.isFavorite ? undefined : true,
    });
  };

  const togglePinned = () => {
    onFiltersChange({
      ...filters,
      isPinned: filters.isPinned ? undefined : true,
    });
  };

  return (
    <div className="space-y-4">
      {/* Main search and action bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets by title, description, code, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant={activeFiltersCount > 0 ? "default" : "outline"}
          size="sm"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <Button
          variant={filters.isFavorite ? "default" : "outline"}
          size="sm"
          onClick={toggleFavorites}
        >
          <Star className={`h-4 w-4 mr-2 ${filters.isFavorite ? 'fill-current' : ''}`} />
          Favorites
        </Button>

        <Button
          variant={filters.isPinned ? "default" : "outline"}
          size="sm"
          onClick={togglePinned}
        >
          <Pin className={`h-4 w-4 mr-2 ${filters.isPinned ? 'fill-current' : ''}`} />
          Pinned
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport('json')}>
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('markdown')}>
              Export as Markdown
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>

        <Button onClick={onCreateSnippet}>
          <Plus className="h-4 w-4 mr-2" />
          New Snippet
        </Button>
      </div>

      {/* Expanded filters */}
      {isFiltersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Language</label>
              {filters.language && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, language: undefined })}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <Select
              value={filters.language || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  language: value || undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All languages" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.name} value={lang.name}>
                    {lang.name} ({lang.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Collection</label>
              {filters.collection && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, collection: undefined })}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <Select
              value={filters.collection || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  collection: value || undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All collections" />
              </SelectTrigger>
              <SelectContent>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.name}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {tags.slice(0, 20).map(tag => (
                <Badge
                  key={tag.name}
                  variant={filters.tags?.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => {
                    const currentTags = filters.tags || [];
                    const newTags = currentTags.includes(tag.name)
                      ? currentTags.filter(t => t !== tag.name)
                      : [...currentTags, tag.name];
                    
                    onFiltersChange({
                      ...filters,
                      tags: newTags.length > 0 ? newTags : undefined,
                    });
                  }}
                >
                  #{tag.name} ({tag.count})
                </Badge>
              ))}
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="md:col-span-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 