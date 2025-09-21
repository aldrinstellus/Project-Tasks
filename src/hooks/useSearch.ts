import { useState, useMemo, useCallback } from 'react';
import { useKanbanStore } from '@/store/kanban-store';
import { useAuth } from '@/contexts/AuthContext';
import { Board, List, Card, Label } from '@/types/kanban';

export type SearchResultType = 'board' | 'list' | 'card' | 'label';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  boardTitle?: string;
  listTitle?: string;
  labels?: Label[];
  score: number;
  data: Board | List | Card | Label;
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const { boards } = useKanbanStore();
  const { user } = useAuth();

  // Create search index
  const searchIndex = useMemo(() => {
    const results: SearchResult[] = [];
    
    if (!user) return results;

    // Filter boards for current user
    const userBoards = boards.filter(board => board.userId === user.id);

    userBoards.forEach(board => {
      // Index boards
      results.push({
        id: board.id,
        type: 'board',
        title: board.title,
        description: `Board with ${board.lists.length} lists`,
        score: 0,
        data: board,
      });

      // Index lists
      board.lists.forEach(list => {
        results.push({
          id: list.id,
          type: 'list',
          title: list.title,
          description: `List in ${board.title} with ${list.cards.length} cards`,
          boardTitle: board.title,
          score: 0,
          data: list,
        });

        // Index cards
        list.cards.forEach(card => {
          results.push({
            id: card.id,
            type: 'card',
            title: card.title,
            description: card.description || `Card in ${list.title}`,
            boardTitle: board.title,
            listTitle: list.title,
            labels: card.labels,
            score: 0,
            data: card,
          });
        });
      });
    });

    return results;
  }, [boards, user]);

  // Fuzzy search algorithm
  const calculateScore = useCallback((text: string, query: string): number => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match gets highest score
    if (textLower === queryLower) return 100;
    
    // Starts with query gets high score
    if (textLower.startsWith(queryLower)) return 80;
    
    // Contains query gets medium score
    if (textLower.includes(queryLower)) return 60;
    
    // Fuzzy match (character matching)
    let score = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score += 10 / (i - queryIndex + 1); // Closer matches get higher scores
        queryIndex++;
      }
    }
    
    return queryIndex === queryLower.length ? score : 0;
  }, []);

  // Search function
  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return [];
    
    const results = searchIndex
      .map(item => {
        let score = 0;
        
        // Search in title (highest weight)
        score += calculateScore(item.title, searchQuery) * 3;
        
        // Search in description (medium weight)
        if (item.description) {
          score += calculateScore(item.description, searchQuery) * 2;
        }
        
        // Search in board title (low weight)
        if (item.boardTitle) {
          score += calculateScore(item.boardTitle, searchQuery);
        }
        
        // Search in list title (low weight)
        if (item.listTitle) {
          score += calculateScore(item.listTitle, searchQuery);
        }
        
        // Search in labels (medium weight)
        if (item.labels) {
          item.labels.forEach(label => {
            score += calculateScore(label.title, searchQuery) * 2;
          });
        }
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Limit to top 50 results
    
    return results;
  }, [searchIndex, calculateScore]);

  // Handle search shortcuts
  const handleShortcut = useCallback((shortcut: string) => {
    const shortcuts: Record<string, string> = {
      'board:': 'Search boards...',
      'list:': 'Search lists...',
      'card:': 'Search cards...',
      'label:': 'Search labels...',
    };
    
    if (shortcuts[shortcut]) {
      setQuery(shortcut);
    }
  }, []);

  // Add to recent searches
  const addRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setRecentSearches(prev => {
      const updated = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
      localStorage.setItem('recent-searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load recent searches from localStorage
  const loadRecentSearches = useCallback(() => {
    try {
      const saved = localStorage.getItem('recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    recentSearches,
    search,
    handleShortcut,
    addRecentSearch,
    loadRecentSearches,
  };
}