import { useState } from 'react';
import { useKanbanStore } from '@/store/kanban-store';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft,
  ChevronRight,
  Trello, 
  Plus, 
  MoreHorizontal,
  Trash2,
  Edit2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { boards, currentBoard, setCurrentBoard, createBoard, deleteBoard } = useKanbanStore();
  const { user } = useAuth();

  const handleCreateBoard = () => {
    const boardName = prompt('Enter board name:');
    if (boardName?.trim() && user) {
      createBoard(boardName.trim(), user.id);
    }
  };

  const handleDeleteBoard = (boardId: string, boardTitle: string) => {
    if (confirm(`Are you sure you want to delete "${boardTitle}" board? This action cannot be undone.`)) {
      deleteBoard(boardId);
    }
  };

  return (
    <div
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-12" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Trello className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Boards</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="btn-ghost-hover hover:bg-primary/10"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Boards List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {!collapsed && (
            <Button
              onClick={handleCreateBoard}
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Board
            </Button>
          )}
          
          {collapsed && (
            <Button
              onClick={handleCreateBoard}
              variant="ghost"
              size="sm"
              className="w-full aspect-square p-0"
              title="New Board"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}

          {boards.length > 0 && !collapsed && <Separator className="my-2" />}

          {boards.map((board) => (
            <div key={board.id} className="group relative">
              <Button
                onClick={() => setCurrentBoard(board.id)}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left",
                  currentBoard?.id === board.id
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-muted/50"
                )}
                title={collapsed ? board.title : undefined}
              >
                {collapsed ? (
                  <Trello className="w-4 h-4" />
                ) : (
                  <>
                    <Trello className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{board.title}</span>
                  </>
                )}
              </Button>

              {!collapsed && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleDeleteBoard(board.id, board.title)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete board
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {boards.length} board{boards.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}