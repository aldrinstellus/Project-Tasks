import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { Card as CardType } from '@/types/kanban';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useKanbanStore } from '@/store/kanban-store';
import { CardDetailModal } from './CardDetailModal';

interface KanbanCardProps {
  card: CardType;
  isDragging: boolean;
}

export function KanbanCard({ card, isDragging }: KanbanCardProps) {
  const { deleteCard } = useKanbanStore();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: `card-${card.id}`,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(card.id);
    }
  };

  const handleEditCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailModalOpen(true);
  };

  const labelColors = {
    red: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`card-kanban group ${isDragging ? 'opacity-50 rotate-2' : ''}`}
        onClick={() => setIsDetailModalOpen(true)}
        {...attributes}
        {...listeners}
      >
        <CardContent className="p-0">
          <div className="p-3">
            {/* Labels */}
            {card.labels && card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {card.labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant="secondary"
                    className={`text-xs px-2 py-1 ${labelColors[label.color]}`}
                  >
                    {label.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-3">
              {card.title}
            </h4>

            {/* Description preview */}
            {card.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {card.description}
              </p>
            )}

            {/* Footer with metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {card.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(card.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditCard}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit card
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteCard}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete card
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <CardDetailModal
        card={card}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
}