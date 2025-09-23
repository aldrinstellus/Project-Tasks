import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BoardStats } from '@/components/Analytics/BoardStats';
import { RecentActivity } from '@/components/Activity/RecentActivity';
import { ProjectOverview } from '@/components/Dashboard/ProjectOverview';
import { useKanbanStore } from '@/store/kanban-store';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { loadUserBoards } = useKanbanStore();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserBoards(user.id);
    }
  }, [user, loadUserBoards]);

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of all your projects and team activity</p>
              </div>
            </div>
            
            <BoardStats />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ProjectOverview />
              </div>
              <div>
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