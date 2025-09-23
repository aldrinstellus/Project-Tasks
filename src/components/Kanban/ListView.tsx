import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar, MoreHorizontal, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { useKanbanStore } from '@/store/kanban-store';
import { Card } from '@/types/kanban';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardDetailModal } from './CardDetailModal';

type SortField = 'title' | 'list' | 'dueDate' | 'created';
type SortDirection = 'asc' | 'desc';

export function ListView() {
  const { currentBoard, updateCard, deleteCard } = useKanbanStore();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [sortField, setSortField] = useState<SortField>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterList, setFilterList] = useState<string>('all');

  const allCards = useMemo(() => {
    if (!currentBoard) return [];
    
    const cards: (Card & { listTitle: string })[] = [];
    currentBoard.lists.forEach(list => {
      list.cards.forEach(card => {
        cards.push({ ...card, listTitle: list.title });
      });
    });
    
    return cards;
  }, [currentBoard]);

  const filteredAndSortedCards = useMemo(() => {
    let filtered = allCards;
    
    // Filter by list
    if (filterList !== 'all') {
      filtered = filtered.filter(card => card.listId === filterList);
    }
    
    // Sort cards
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'list':
          comparison = a.listTitle.localeCompare(b.listTitle);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'created':
          // Use position as a proxy for creation order
          comparison = a.position - b.position;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [allCards, filterList, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = (cardId: string, newListId: string) => {
    const newList = currentBoard?.lists.find(list => list.id === newListId);
    if (newList) {
      updateCard(cardId, { listId: newListId });
    }
  };

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
  };

  const handleDeleteCard = (cardId: string, cardTitle: string) => {
    if (confirm(`Are you sure you want to delete "${cardTitle}"?`)) {
      deleteCard(cardId);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />;
  };

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No board selected</p>
      </div>
    );
  }

  if (allCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No tasks yet</h3>
          <p className="text-muted-foreground">Create your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="list-filter" className="text-sm font-medium">Filter by list:</label>
            <Select value={filterList} onValueChange={setFilterList}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lists</SelectItem>
                {currentBoard.lists.map(list => (
                  <SelectItem key={list.id} value={list.id}>{list.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedCards.length} of {allCards.length} tasks
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                <Button 
                  variant="ghost" 
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('title')}
                >
                  Task {getSortIcon('title')}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('list')}
                >
                  Status {getSortIcon('list')}
                </Button>
              </TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date {getSortIcon('dueDate')}
                </Button>
              </TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCards.map((card) => (
              <TableRow 
                key={card.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleEditCard(card)}
              >
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="font-medium">{card.title}</div>
                    {card.description && (
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {card.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="w-32"
                  >
                    <Select 
                      value={card.listId} 
                      onValueChange={(value) => handleStatusChange(card.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentBoard.lists.map(list => (
                          <SelectItem key={list.id} value={list.id}>{list.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-1">
                    {card.labels?.map((label) => (
                      <Badge 
                        key={label.id} 
                        variant="secondary"
                        className={`
                          ${label.color === 'red' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                          ${label.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                          ${label.color === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                          ${label.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                          ${label.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
                          ${label.color === 'gray' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : ''}
                        `}
                      >
                        {label.title}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {card.dueDate ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(card.dueDate), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No due date</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger 
                      asChild 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEditCard(card);
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card.id, card.title);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}