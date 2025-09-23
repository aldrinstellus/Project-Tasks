import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { KanbanBoard } from '@/components/Kanban/KanbanBoard';
import { ListView } from '@/components/Kanban/ListView';
import { RecentActivity } from '@/components/Activity/RecentActivity';
import { useKanbanStore } from '@/store/kanban-store';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Toaster } from 'react-hot-toast';

export function BoardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { boards, currentBoard, setCurrentBoard, loadUserBoards, viewMode } = useKanbanStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserBoards(user.id);
    }
  }, [user, loadUserBoards]);

  useEffect(() => {
    if (boardId && boards.length > 0) {
      const board = boards.find(b => b.id === boardId);
      if (board) {
        setCurrentBoard(board.id);
      } else {
        navigate('/dashboard');
      }
    }
  }, [boardId, boards, setCurrentBoard, navigate]);

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

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Board not found</h2>
          <p className="text-muted-foreground mb-4">The board you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{currentBoard.title}</h1>
                  <p className="text-muted-foreground">
                    {currentBoard.lists.reduce((acc, list) => acc + list.cards.length, 0)} tasks across {currentBoard.lists.length} lists
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-6 h-full overflow-hidden">
              <div className="flex-1">
                {viewMode === 'kanban' ? <KanbanBoard /> : <ListView />}
              </div>
              <div className="w-80 hidden xl:block">
                <RecentActivity boardId={currentBoard.id} />
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