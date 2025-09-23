import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { KanbanBoard } from '@/components/Kanban/KanbanBoard';
import { ListView } from '@/components/Kanban/ListView';
import { BoardStats } from '@/components/Analytics/BoardStats';
import { RecentActivity } from '@/components/Activity/RecentActivity';
import { useKanbanStore } from '@/store/kanban-store';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { boards, createBoard, setCurrentBoard, loadUserBoards, viewMode } = useKanbanStore();
  const { user } = useAuth();

  // Initialize with user boards or create a default board
  useEffect(() => {
    if (user) {
      loadUserBoards(user.id);
      
      // If no boards exist for this user, create a default one
      setTimeout(() => {
        const currentBoards = useKanbanStore.getState().boards;
        if (currentBoards.length === 0) {
          createBoard('My First Board', user.id);
        } else if (!useKanbanStore.getState().currentBoard) {
          setCurrentBoard(currentBoards[0].id);
        }
      }, 100);
    }
  }, [user, loadUserBoards, createBoard, setCurrentBoard]);

  // Handle responsive sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 min-h-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-6 space-y-6 overflow-auto">
            <BoardStats />
            <div className="flex gap-6 h-full overflow-hidden">
              <div className="flex-1">
                {viewMode === 'kanban' ? <KanbanBoard /> : <ListView />}
              </div>
              <div className="w-80 hidden xl:block">
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-card text-card-foreground border border-border',
          duration: 3000,
        }}
      />
    </div>
  );
}