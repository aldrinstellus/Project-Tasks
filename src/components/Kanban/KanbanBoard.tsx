import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useKanbanStore } from '@/store/kanban-store';
import { KanbanList } from './KanbanList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';


export function KanbanBoard() {
  const { currentBoard, moveCard, createList } = useKanbanStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!currentBoard) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            No board selected
          </h2>
          <p className="text-muted-foreground">
            Create a new board to get started
          </p>
        </div>
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping on a list (not a card), move to end of that list
    if (overId.startsWith('list-')) {
      const listId = overId.replace('list-', '');
      const targetList = currentBoard.lists.find(list => list.id === listId);
      if (targetList) {
        moveCard(activeId, listId, targetList.cards.length);
      }
    }
    // If dropping on a card, move to that position
    else if (overId.startsWith('card-')) {
      const cardId = overId.replace('card-', '');
      
      // Find the target card and its list
      for (const list of currentBoard.lists) {
        const cardIndex = list.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          moveCard(activeId, list.id, cardIndex);
          break;
        }
      }
    }

    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic for better visual feedback if needed
  };

  const handleAddList = () => {
    const listName = prompt('Enter list name:');
    if (listName?.trim()) {
      createList(currentBoard.id, listName.trim());
    }
  };

  const sortedLists = [...currentBoard.lists].sort((a, b) => a.position - b.position);
  const listIds = sortedLists.map(list => `list-${list.id}`);

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {currentBoard.title}
        </h1>
        <p className="text-muted-foreground">
          {currentBoard.lists.length} lists • Last updated {new Date(currentBoard.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={closestCorners}
      >
        <div className="flex gap-6 pb-6 overflow-x-auto overflow-y-hidden min-h-0 scrollbar-thin">
          <div className="flex gap-6 min-w-max pr-6">
            <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
              {sortedLists.map((list) => (
                <KanbanList
                  key={list.id}
                  list={list}
                  activeCardId={activeId}
                />
              ))}
            </SortableContext>

            <div className="flex-shrink-0">
              <Button
                onClick={handleAddList}
                variant="outline"
                className="w-80 h-12 border-dashed border-2 hover:bg-muted/50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add another list
              </Button>
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}