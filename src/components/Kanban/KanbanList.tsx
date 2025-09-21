import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { List } from '@/types/kanban';
import { useKanbanStore } from '@/store/kanban-store';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface KanbanListProps {
  list: List;
  activeCardId: string | null;
}

export function KanbanList({ list, activeCardId }: KanbanListProps) {
  const { updateList, deleteList, createCard } = useKanbanStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [editingTitle, setEditingTitle] = useState(list.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `list-${list.id}`,
    data: {
      type: 'list',
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      createCard(list.id, newCardTitle.trim(), newCardDescription.trim() || undefined);
      setNewCardTitle('');
      setNewCardDescription('');
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = () => {
    if (editingTitle.trim() && editingTitle !== list.title) {
      updateList(list.id, { title: editingTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleDeleteList = () => {
    if (confirm(`Are you sure you want to delete "${list.title}" list? This will also delete all cards in it.`)) {
      deleteList(list.id);
    }
  };

  const sortedCards = [...list.cards].sort((a, b) => a.position - b.position);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col w-80 ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="card-list">
        <div className="flex items-center justify-between p-4 pb-2">
          {isEditingTitle ? (
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateTitle();
                } else if (e.key === 'Escape') {
                  setEditingTitle(list.title);
                  setIsEditingTitle(false);
                }
              }}
              className="text-sm font-medium"
              autoFocus
            />
          ) : (
            <h3
              className="text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
              onClick={() => setIsEditingTitle(true)}
              {...attributes}
              {...listeners}
            >
              {list.title}
            </h3>
          )}
          
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>List actions</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit title
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteList}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="p-4 pt-0 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin">
          {sortedCards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              isDragging={activeCardId === card.id}
            />
          ))}

          {isAddingCard ? (
            <Card className="p-3 border-2 border-dashed border-muted-foreground/20">
              <div className="space-y-2">
                <Input
                  placeholder="Enter card title..."
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  className="text-sm"
                />
                <Textarea
                  placeholder="Add a description (optional)..."
                  value={newCardDescription}
                  onChange={(e) => setNewCardDescription(e.target.value)}
                  className="text-sm min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCard}
                    size="sm"
                    className="btn-primary"
                    disabled={!newCardTitle.trim()}
                  >
                    Add card
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingCard(false);
                      setNewCardTitle('');
                      setNewCardDescription('');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsAddingCard(true)}
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add a card
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new card to this list</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardContent>
      </Card>
    </div>
  );
}