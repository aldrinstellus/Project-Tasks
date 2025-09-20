import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { KanbanBoard } from '@/components/Kanban/KanbanBoard';
import { useKanbanStore } from '@/store/kanban-store';
import { Toaster } from 'react-hot-toast';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { boards, createBoard, setCurrentBoard } = useKanbanStore();

  // Initialize with a default board if none exist
  useEffect(() => {
    if (boards.length === 0) {
      createBoard('My First Board');
    } else if (!useKanbanStore.getState().currentBoard) {
      setCurrentBoard(boards[0].id);
    }
  }, [boards, createBoard, setCurrentBoard]);

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
          <KanbanBoard />
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