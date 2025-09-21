import { Moon, Sun, Plus, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useKanbanStore } from '@/store/kanban-store';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const { currentBoard, createBoard } = useKanbanStore();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
    <header className="bg-gradient-header border-b border-border/50 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-white">Project Tasks</h1>
            </div>
            {currentBoard && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-white/80">
                <span>/</span>
                <span className="font-medium text-white">{currentBoard.title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCreateBoard}
              size="sm"
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Board
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="btn-ghost-hover"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <DropdownMenu>
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
    </header>
  );
}