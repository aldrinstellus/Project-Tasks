import { useState, useEffect } from 'react';
import { Card as CardType, Label } from '@/types/kanban';
import { useKanbanStore } from '@/store/kanban-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Tag, 
  X, 
  Save,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface CardDetailModalProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
}

const availableLabels: Label[] = [
  { id: '1', title: 'Bug', color: 'red' },
  { id: '2', title: 'Feature', color: 'blue' },
  { id: '3', title: 'Enhancement', color: 'green' },
  { id: '4', title: 'Priority', color: 'yellow' },
  { id: '5', title: 'Review', color: 'purple' },
  { id: '6', title: 'Documentation', color: 'gray' },
];

export function CardDetailModal({ card, isOpen, onClose }: CardDetailModalProps) {
  const { updateCard, addLabelToCard, removeLabelFromCard } = useKanbanStore();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    card.dueDate ? new Date(card.dueDate) : undefined
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setDueDate(card.dueDate ? new Date(card.dueDate) : undefined);
    setHasChanges(false);
  }, [card, isOpen]);

  useEffect(() => {
    const titleChanged = title !== card.title;
    const descriptionChanged = description !== (card.description || '');
    const dueDateChanged = dueDate?.getTime() !== card.dueDate?.getTime();
    
    setHasChanges(titleChanged || descriptionChanged || dueDateChanged);
  }, [title, description, dueDate, card]);

  const handleSave = () => {
    updateCard(card.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
    });
    setHasChanges(false);
    onClose();
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description || '');
    setDueDate(card.dueDate ? new Date(card.dueDate) : undefined);
    setHasChanges(false);
    onClose();
  };

  const handleAddLabel = (label: Label) => {
    const hasLabel = card.labels?.some(l => l.id === label.id);
    if (!hasLabel) {
      addLabelToCard(card.id, label);
    }
  };

  const handleRemoveLabel = (labelId: string) => {
    removeLabelFromCard(card.id, labelId);
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
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Edit Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-none shadow-none p-0 focus-visible:ring-0"
              placeholder="Card title..."
            />
          </div>

          {/* Labels */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">Labels</span>
            </div>
            
            {card.labels && card.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {card.labels.map((label) => (
                  <Tooltip key={label.id}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className={`${labelColors[label.color]} cursor-pointer hover:opacity-80`}
                        onClick={() => handleRemoveLabel(label.id)}
                      >
                        {label.title}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove {label.title} label</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {availableLabels
                .filter(label => !card.labels?.some(l => l.id === label.id))
                .map((label) => (
                  <Tooltip key={label.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7"
                        onClick={() => handleAddLabel(label)}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${labelColors[label.color]}`} />
                        {label.title}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add {label.title} label</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="min-h-[120px]"
            />
          </div>

          {/* Due Date */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Due Date</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {dueDate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDueDate(undefined)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove due date</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Discard changes (Esc)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || !hasChanges}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save changes (Ctrl+S)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}