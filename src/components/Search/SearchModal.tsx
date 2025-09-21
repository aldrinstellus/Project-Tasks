import { useEffect, useState } from 'react';
import { Search, Clock, Hash, FileText, Layers, Folder } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { useKanbanStore } from '@/store/kanban-store';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const { query, setQuery, search, handleShortcut, addRecentSearch, recentSearches, loadRecentSearches } = useSearch();
  const { setCurrentBoard } = useKanbanStore();
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = search(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    addRecentSearch(query);
    
    // Navigate based on result type
    switch (result.type) {
      case 'board':
        setCurrentBoard(result.id);
        break;
      case 'list':
      case 'card':
        // Find the board containing this list/card
        const board = result.data as any;
        if (result.boardTitle) {
          // For lists and cards, we need to find and set the board
          // This is a simplified approach - in a real app you might want more sophisticated navigation
          console.log(`Navigate to ${result.type}: ${result.title} in board: ${result.boardTitle}`);
        }
        break;
    }
    
    onOpenChange(false);
    setQuery('');
  };

  const handleRecentSelect = (recentQuery: string) => {
    setQuery(recentQuery);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'board':
        return <Folder className="w-4 h-4" />;
      case 'list':
        return <Layers className="w-4 h-4" />;
      case 'card':
        return <FileText className="w-4 h-4" />;
      case 'label':
        return <Hash className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getResultDescription = (result: SearchResult) => {
    switch (result.type) {
      case 'board':
        return result.description;
      case 'list':
        return `in ${result.boardTitle}`;
      case 'card':
        return `${result.listTitle} • ${result.boardTitle}`;
      default:
        return result.description;
    }
  };

  const shortcuts = [
    { key: 'board:', label: 'Search boards' },
    { key: 'list:', label: 'Search lists' },
    { key: 'card:', label: 'Search cards' },
    { key: 'label:', label: 'Search labels' },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search boards, lists, cards... (⌘K)"
        value={query}
        onValueChange={setQuery}
        className="text-sm"
      />
      <CommandList>
        {!query && recentSearches.length > 0 && (
          <>
            <CommandGroup heading="Recent searches">
              {recentSearches.map((recentQuery, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleRecentSelect(recentQuery)}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{recentQuery}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {!query && (
          <CommandGroup heading="Search shortcuts">
            {shortcuts.map((shortcut) => (
              <CommandItem
                key={shortcut.key}
                onSelect={() => handleShortcut(shortcut.key)}
                className="flex items-center gap-2"
              >
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-primary">{shortcut.key}</span>
                <span className="text-muted-foreground">{shortcut.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query && results.length === 0 && (
          <CommandEmpty>
            <div className="text-center py-6">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
            </div>
          </CommandEmpty>
        )}

        {results.length > 0 && (
          <>
            {['board', 'list', 'card', 'label'].map((type) => {
              const typeResults = results.filter(r => r.type === type);
              if (typeResults.length === 0) return null;

              return (
                <CommandGroup key={type} heading={`${type.charAt(0).toUpperCase() + type.slice(1)}s`}>
                  {typeResults.map((result) => (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => handleSelect(result)}
                      className="flex items-start gap-3 p-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{result.title}</p>
                          {result.score > 80 && (
                            <Badge variant="secondary" className="text-xs">
                              Exact match
                            </Badge>
                          )}
                        </div>
                        {result.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {getResultDescription(result)}
                          </p>
                        )}
                        {result.labels && result.labels.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {result.labels.slice(0, 3).map((label) => (
                              <Badge
                                key={label.id}
                                variant="outline"
                                className={cn(
                                  "text-xs h-4",
                                  label.color === 'red' && "border-red-200 bg-red-50 text-red-700",
                                  label.color === 'blue' && "border-blue-200 bg-blue-50 text-blue-700",
                                  label.color === 'green' && "border-green-200 bg-green-50 text-green-700",
                                  label.color === 'yellow' && "border-yellow-200 bg-yellow-50 text-yellow-700",
                                  label.color === 'purple' && "border-purple-200 bg-purple-50 text-purple-700",
                                  label.color === 'gray' && "border-gray-200 bg-gray-50 text-gray-700",
                                )}
                              >
                                {label.title}
                              </Badge>
                            ))}
                            {result.labels.length > 3 && (
                              <Badge variant="outline" className="text-xs h-4">
                                +{result.labels.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}