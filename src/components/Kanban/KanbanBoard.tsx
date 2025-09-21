import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useKanbanStore } from '@/store/kanban-store';
import { KanbanList } from './KanbanList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';


export function KanbanBoard() {
  const { currentBoard, moveCard, createList } = useKanbanStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Enhanced horizontal scrolling with mouse wheel and trackpad
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const hasHorizontalScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
      if (!hasHorizontalScroll) return;

      e.preventDefault();
      
      // Support both wheel directions and Shift+wheel
      let scrollAmount = 0;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        scrollAmount = e.deltaX;
      } else if (e.shiftKey || Math.abs(e.deltaY) > 0) {
        scrollAmount = e.deltaY;
      }

      if (scrollAmount !== 0) {
        // Smooth scrolling with momentum
        const targetScroll = scrollContainer.scrollLeft + scrollAmount;
        scrollContainer.scrollTo({
          left: targetScroll,
          behavior: 'auto'
        });
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, [currentBoard]);

  // Click-and-drag panning functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start panning on left mouse button and not on draggable elements
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    const isOnDraggable = target.closest('[data-sortable-item]') || 
                         target.closest('[data-dnd-item]') || 
                         target.closest('button') ||
                         target.closest('input') ||
                         target.closest('textarea');
    
    if (isOnDraggable || activeId) return;

    e.preventDefault();
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grabbing';
    }
  }, [activeId]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning || !scrollContainerRef.current) return;

    e.preventDefault();
    
    const deltaX = lastPanPoint.x - e.clientX;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + deltaX;
    
    // Cancel any existing animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    // Use RAF for smooth scrolling
    rafRef.current = requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = newScrollLeft;
      }
    });
    
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    if (!isPanning) return;
    
    setIsPanning(false);
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = '';
    }
  }, [isPanning]);

  // Handle mouse leave to stop panning
  const handleMouseLeave = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = '';
      }
    }
  }, [isPanning]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Keyboard navigation for horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainer || e.target !== scrollContainer) return;
      
      const scrollStep = 200;
      const pageStep = scrollContainer.clientWidth * 0.8;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          scrollContainer.scrollBy({ left: -scrollStep, behavior: 'smooth' });
          break;
        case 'ArrowRight':
          e.preventDefault();
          scrollContainer.scrollBy({ left: scrollStep, behavior: 'smooth' });
          break;
        case 'Home':
          e.preventDefault();
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          break;
        case 'End':
          e.preventDefault();
          scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' });
          break;
        case 'PageUp':
          e.preventDefault();
          scrollContainer.scrollBy({ left: -pageStep, behavior: 'smooth' });
          break;
        case 'PageDown':
          e.preventDefault();
          scrollContainer.scrollBy({ left: pageStep, behavior: 'smooth' });
          break;
      }
    };

    scrollContainer.addEventListener('keydown', handleKeyDown);
    return () => scrollContainer.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        <div 
          ref={scrollContainerRef} 
          className="flex gap-6 pb-6 overflow-x-auto overflow-y-hidden min-h-0 scrollbar-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          style={{ 
            cursor: isPanning ? 'grabbing' : scrollContainerRef.current?.scrollWidth > scrollContainerRef.current?.clientWidth ? 'grab' : 'default'
          }}
        >
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleAddList}
                    variant="outline"
                    className="w-80 h-12 border-dashed border-2 hover:bg-muted/50 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add another list
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new list to this board</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}