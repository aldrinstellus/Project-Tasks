import { Plus, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useKanbanStore } from '@/store/kanban-store';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { SearchModal } from '@/components/Search/SearchModal';
import { SearchTrigger } from '@/components/Search/SearchTrigger';
import { ViewToggle } from './ViewToggle';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { currentBoard, createBoard } = useKanbanStore();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleCreateBoard = () => {
    const boardName = prompt('Enter board name:');
    if (boardName?.trim() && user) {
      createBoard(boardName.trim(), user.id);
    }
  };

  const getUserInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-gradient-header border-b border-border/50 shadow-sm w-full sticky top-0 z-50">
      <div className="w-full px-4 py-3">
        <div className="grid grid-cols-3 items-center w-full gap-4">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-white">Project Tasks</h1>
            </div>
            {currentBoard && (
              <div className="hidden lg:flex items-center space-x-2 text-sm text-white/80">
                <span>/</span>
                <span className="font-medium text-white">{currentBoard.title}</span>
              </div>
            )}
          </div>

          {/* Center Section - Prominent Search */}
          <div className="flex justify-center">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center justify-end space-x-4">
            {/* View Toggle */}
            <ViewToggle />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCreateBoard}
                  size="sm"
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Board</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new board (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="btn-ghost-hover">
                      <Avatar className="w-6 h-6">
                        {profile?.avatar_url && (
                          <AvatarImage src={profile.avatar_url} alt={profile.display_name || 'User'} />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account menu</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-2 text-sm">
                  <p className="font-medium">{profile?.display_name || 'User'}</p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}