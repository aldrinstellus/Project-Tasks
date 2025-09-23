import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useKanbanStore } from '@/store/kanban-store';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

export function BoardStats() {
  const { currentBoard, boards } = useKanbanStore();

  if (!currentBoard) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2" />
              <p>Select a board to view analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const allCards = currentBoard.lists.flatMap(list => list.cards);
  const totalCards = allCards.length;
  const completedCards = currentBoard.lists
    .filter(list => list.title.toLowerCase().includes('done') || 
                   list.title.toLowerCase().includes('complete') ||
                   list.title.toLowerCase().includes('resolved') ||
                   list.title.toLowerCase().includes('published') ||
                   list.title.toLowerCase().includes('launch'))
    .flatMap(list => list.cards).length;

  const overdueTasks = allCards.filter(card => 
    card.dueDate && new Date(card.dueDate) < new Date()
  ).length;

  const dueTodayTasks = allCards.filter(card => {
    if (!card.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(card.dueDate);
    return dueDate.toDateString() === today.toDateString();
  }).length;

  const highPriorityTasks = allCards.filter(card =>
    card.labels?.some(label => 
      label.title.toLowerCase().includes('high') || 
      label.title.toLowerCase().includes('urgent')
    )
  ).length;

  const completionRate = totalCards > 0 ? (completedCards / totalCards) * 100 : 0;

  // Calculate velocity (mock data based on completion rate)
  const weeklyVelocity = Math.round((completedCards / 4) * (completionRate / 100) + Math.random() * 3);

  return (
    <div className="space-y-6 mb-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground">
              Across {currentBoard.lists.length} lists
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCards}</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dueTodayTasks}</div>
            {overdueTasks > 0 && (
              <Badge variant="destructive" className="mt-2">
                {overdueTasks} overdue
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highPriorityTasks}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyVelocity}</div>
            <p className="text-xs text-muted-foreground">
              Tasks completed per week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Boards</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boards.length}</div>
            <p className="text-xs text-muted-foreground">
              Total project boards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {new Date(currentBoard.updatedAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(currentBoard.updatedAt).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}