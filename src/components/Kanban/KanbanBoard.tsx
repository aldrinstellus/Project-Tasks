import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent, 
  closestCorners,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useKanbanStore } from '@/store/kanban-store';
import { KanbanList } from './KanbanList';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Card as CardType } from '@/types/kanban';


export function KanbanBoard() {
  const { currentBoard, moveCard, createList } = useKanbanStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const autoScrollRef = useRef<number>();

  // Enhanced sensors for better mobile and accessibility support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Delay before touch drag starts
        tolerance: 5, // Touch tolerance
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
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
    const id = event.active.id as string;
    setActiveId(id);
    
    // Find the active card for drag overlay
    if (id.startsWith('card-')) {
      const cardId = id.replace('card-', '');
      for (const list of currentBoard.lists) {
        const card = list.cards.find(c => c.id === cardId);
        if (card) {
          setActiveCard(card);
          break;
        }
      }
    }
    
    // Start auto-scroll detection
    setIsAutoScrolling(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clean up drag state
    setActiveId(null);
    setActiveCard(null);
    setIsAutoScrolling(false);
    
    // Cancel auto-scroll
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
    }
    
    if (!over) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Extract the actual card ID by removing the "card-" prefix
    const actualCardId = activeId.startsWith('card-') ? activeId.replace('card-', '') : activeId;

    // If dropping on a list (not a card), move to end of that list
    if (overId.startsWith('list-')) {
      const listId = overId.replace('list-', '');
      const targetList = currentBoard.lists.find(list => list.id === listId);
      if (targetList) {
        moveCard(actualCardId, listId, targetList.cards.length);
      }
    }
    // If dropping on a card, move to that position
    else if (overId.startsWith('card-')) {
      const cardId = overId.replace('card-', '');
      
      // Find the target card and its list
      for (const list of currentBoard.lists) {
        const cardIndex = list.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          moveCard(actualCardId, list.id, cardIndex);
          break;
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Auto-scroll when dragging near edges
    if (!isAutoScrolling || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollThreshold = 100; // Distance from edge to trigger auto-scroll
    const scrollSpeed = 10; // Pixels per frame
    
    if (event.activatorEvent) {
      const activatorEvent = event.activatorEvent as MouseEvent | TouchEvent;
      let clientX: number | undefined;
      
      if ('touches' in activatorEvent && activatorEvent.touches.length > 0) {
        clientX = activatorEvent.touches[0].clientX;
      } else if ('clientX' in activatorEvent) {
        clientX = activatorEvent.clientX;
      }
      
      if (clientX) {
        const distanceFromLeft = clientX - rect.left;
        const distanceFromRight = rect.right - clientX;
        
        let scrollDirection = 0;
        
        if (distanceFromLeft < scrollThreshold && container.scrollLeft > 0) {
          scrollDirection = -scrollSpeed;
        } else if (distanceFromRight < scrollThreshold && 
                   container.scrollLeft < container.scrollWidth - container.clientWidth) {
          scrollDirection = scrollSpeed;
        }
        
        if (scrollDirection !== 0) {
          // Cancel previous animation frame
          if (autoScrollRef.current) {
            cancelAnimationFrame(autoScrollRef.current);
          }
          
          // Start auto-scroll animation
          const autoScroll = () => {
            if (container && isAutoScrolling) {
              container.scrollLeft += scrollDirection;
              autoScrollRef.current = requestAnimationFrame(autoScroll);
            }
          };
          
          autoScrollRef.current = requestAnimationFrame(autoScroll);
        }
      }
    }
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
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={closestCorners}
        accessibility={{
          announcements: {
            onDragStart: ({ active }) => {
              return `Picked up ${active.data.current?.type || 'item'}.`;
            },
            onDragOver: ({ active, over }) => {
              if (!over) return '';
              return `${active.data.current?.type || 'Item'} is over ${over.data.current?.type || 'area'}.`;
            },
            onDragEnd: ({ active, over }) => {
              if (!over) {
                return `${active.data.current?.type || 'Item'} was dropped.`;
              }
              return `${active.data.current?.type || 'Item'} was dropped over ${over.data.current?.type || 'area'}.`;
            },
            onDragCancel: ({ active }) => {
              return `${active.data.current?.type || 'Item'} drag was cancelled.`;
            },
          },
        }}
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
        
        {/* Enhanced Drag Overlay with animations */}
        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}
        >
          {activeCard && (
            <div className="transform rotate-3 scale-105 shadow-2xl ring-2 ring-primary/20">
              <KanbanCard 
                card={activeCard} 
                isDragging={true}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}