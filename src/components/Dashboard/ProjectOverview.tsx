import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useKanbanStore } from '@/store/kanban-store';
import { formatDistanceToNow } from 'date-fns';

export function ProjectOverview() {
  const { boards } = useKanbanStore();
  const navigate = useNavigate();

  const getBoardProgress = (board: any) => {
    const totalCards = board.lists.reduce((acc: number, list: any) => acc + list.cards.length, 0);
    const completedCards = board.lists
      .find((list: any) => list.title.toLowerCase().includes('done') || list.title.toLowerCase().includes('complete'))
      ?.cards.length || 0;
    return totalCards > 0 ? (completedCards / totalCards) * 100 : 0;
  };

  const getBoardStatus = (board: any) => {
    const progress = getBoardProgress(board);
    if (progress === 100) return { label: 'Complete', color: 'bg-green-500' };
    if (progress > 60) return { label: 'On Track', color: 'bg-blue-500' };
    if (progress > 30) return { label: 'In Progress', color: 'bg-yellow-500' };
    return { label: 'Getting Started', color: 'bg-gray-500' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Overview</h2>
        <Button variant="outline" size="sm">
          View All Projects
        </Button>
      </div>
      
      <div className="grid gap-4">
        {boards.map((board) => {
          const progress = getBoardProgress(board);
          const status = getBoardStatus(board);
          const totalCards = board.lists.reduce((acc, list) => acc + list.cards.length, 0);
          const activeMembers = Math.floor(Math.random() * 5) + 1; // Mock data
          
          return (
            <Card key={board.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle 
                      className="text-lg hover:text-primary transition-colors"
                      onClick={() => navigate(`/board/${board.id}`)}
                    >
                      {board.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Updated {formatDistanceToNow(board.updatedAt, { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {totalCards} tasks
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {activeMembers} members
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                      {status.label}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/board/${board.id}`)}>
                          Open Board
                        </DropdownMenuItem>
                        <DropdownMenuItem>Share Board</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Archive Board
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/board/${board.id}`)}
                  >
                    Open Board
                  </Button>
                  <div className="flex items-center -space-x-2">
                    {Array.from({ length: Math.min(activeMembers, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-background flex items-center justify-center text-xs text-primary-foreground font-medium"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    {activeMembers > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                        +{activeMembers - 3}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}