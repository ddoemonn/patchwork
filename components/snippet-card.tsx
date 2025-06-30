'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Edit, 
  Trash2, 
  Star, 
  Pin, 
  MoreHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Snippet } from '@/types/snippet';
import { toast } from 'sonner';

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  onDuplicate,
}: SnippetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const truncateCode = (code: string, maxLines: number = 6) => {
    const lines = code.split('\n');
    if (lines.length <= maxLines) return code;
    return lines.slice(0, maxLines).join('\n') + '\n...';
  };

  const displayCode = isExpanded ? snippet.code : truncateCode(snippet.code);
  const hasMoreLines = snippet.code.split('\n').length > 6;

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      {snippet.isPinned && (
        <div className="absolute top-2 right-2 z-10">
          <Pin className="h-4 w-4 text-amber-500 fill-current" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-none mb-1 truncate">
              {snippet.title}
            </h3>
            {snippet.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {snippet.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(snippet.id)}
              className="h-8 w-8 p-0"
            >
              <Star 
                className={`h-4 w-4 ${
                  snippet.isFavorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
                }`} 
              />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(snippet)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(snippet.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTogglePin(snippet.id)}>
                  <Pin className="h-4 w-4 mr-2" />
                  {snippet.isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLineNumbers(!showLineNumbers)}>
                  {showLineNumbers ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showLineNumbers ? 'Hide' : 'Show'} Line Numbers
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(snippet.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {snippet.language}
          </Badge>
          {snippet.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {snippet.collection && (
            <Badge variant="default" className="text-xs">
              {snippet.collection}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="relative">
          <SyntaxHighlighter
            language={snippet.language}
            style={vscDarkPlus}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
            codeTagProps={{
              style: {
                fontSize: '0.875rem',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }
            }}
          >
            {displayCode}
          </SyntaxHighlighter>
          
          {hasMoreLines && (
            <div className="mt-2 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>
            Updated {snippet.updatedAt.toLocaleDateString()}
          </span>
          {snippet.history.length > 0 && (
            <span>
              {snippet.history.length} version{snippet.history.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 