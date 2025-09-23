import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useKanbanStore } from '@/store/kanban-store';
import { 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  Edit3, 
  Trash2,
  Calendar,
  Tag,
  MessageCircle
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'created' | 'moved' | 'completed' | 'updated' | 'deleted' | 'due' | 'labeled' | 'commented';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  cardTitle?: string;
  fromList?: string;
  toList?: string;
}

// Mock activity data generator
function generateMockActivity(): ActivityItem[] {
  const now = new Date();
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'completed',
      title: 'Task Completed',
      description: 'Marketing Campaign Launch',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
      user: 'Sarah Chen',
      cardTitle: 'Marketing Campaign Launch'
    },
    {
      id: '2',
      type: 'moved',
      title: 'Card Moved',
      description: 'Authentication System',
      timestamp: new Date(now.getTime() - 32 * 60 * 1000), // 32 minutes ago
      user: 'Alex Rodriguez',
      cardTitle: 'Authentication System',
      fromList: 'Development',
      toList: 'Testing & QA'
    },
    {
      id: '3',
      type: 'created',
      title: 'New Task Created',
      description: 'Mobile App Performance Optimization',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
      user: 'Marcus Kim',
      cardTitle: 'Mobile App Performance Optimization'
    },
    {
      id: '4',
      type: 'due',
      title: 'Due Date Reminder',
      description: 'User Experience Audit',
      timestamp: new Date(now.getTime() - 1.2 * 60 * 60 * 1000), // 1.2 hours ago
      user: 'System',
      cardTitle: 'User Experience Audit'
    },
    {
      id: '5',
      type: 'labeled',
      title: 'Label Added',
      description: 'High Priority label added to Security Audit',
      timestamp: new Date(now.getTime() - 2.1 * 60 * 60 * 1000), // 2.1 hours ago
      user: 'Lisa Wong',
      cardTitle: 'Security Penetration Testing'
    },
    {
      id: '6',
      type: 'commented',
      title: 'Comment Added',
      description: 'Added implementation notes and resource links',
      timestamp: new Date(now.getTime() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
      user: 'Jordan Taylor',
      cardTitle: 'API Integration Layer'
    },
    {
      id: '7',
      type: 'updated',
      title: 'Task Updated',
      description: 'Updated description and due date',
      timestamp: new Date(now.getTime() - 4.2 * 60 * 60 * 1000), // 4.2 hours ago
      user: 'Emma Davis',
      cardTitle: 'SEO Optimization'
    },
    {
      id: '8',
      type: 'moved',
      title: 'Card Moved',
      description: 'Homepage Redesign Implementation',
      timestamp: new Date(now.getTime() - 5.8 * 60 * 60 * 1000), // 5.8 hours ago
      user: 'Ryan Johnson',
      cardTitle: 'Homepage Redesign Implementation',
      fromList: 'Development',
      toList: 'Review & Editing'
    }
  ];

  return activities;
}

function getActivityIcon(type: ActivityItem['type']) {
  switch (type) {
    case 'created':
      return <Plus className="h-4 w-4 text-green-600" />;
    case 'moved':
      return <ArrowRight className="h-4 w-4 text-blue-600" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'updated':
      return <Edit3 className="h-4 w-4 text-yellow-600" />;
    case 'deleted':
      return <Trash2 className="h-4 w-4 text-red-600" />;
    case 'due':
      return <Calendar className="h-4 w-4 text-orange-600" />;
    case 'labeled':
      return <Tag className="h-4 w-4 text-purple-600" />;
    case 'commented':
      return <MessageCircle className="h-4 w-4 text-blue-600" />;
    default:
      return <Edit3 className="h-4 w-4 text-muted-foreground" />;
  }
}

function getActivityColor(type: ActivityItem['type']) {
  switch (type) {
    case 'created':
    case 'completed':
      return 'text-green-600';
    case 'moved':
    case 'commented':
      return 'text-blue-600';
    case 'updated':
      return 'text-yellow-600';
    case 'deleted':
      return 'text-red-600';
    case 'due':
      return 'text-orange-600';
    case 'labeled':
      return 'text-purple-600';
    default:
      return 'text-muted-foreground';
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function RecentActivity() {
  const { currentBoard } = useKanbanStore();
  const activities = generateMockActivity();

  if (!currentBoard) {
    return null;
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getUserInitials(activity.user)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {getActivityIcon(activity.type)}
                <span className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                  {activity.title}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{activity.user}</span>
                {' '}
                {activity.type === 'moved' ? (
                  <>
                    moved <span className="font-medium">"{activity.cardTitle}"</span> from{' '}
                    <Badge variant="outline" className="mx-1">{activity.fromList}</Badge>
                    to <Badge variant="outline" className="mx-1">{activity.toList}</Badge>
                  </>
                ) : activity.type === 'created' ? (
                  <>
                    created <span className="font-medium">"{activity.cardTitle}"</span>
                  </>
                ) : activity.type === 'completed' ? (
                  <>
                    completed <span className="font-medium">"{activity.cardTitle}"</span>
                  </>
                ) : activity.type === 'due' ? (
                  <>
                    <span className="font-medium">"{activity.cardTitle}"</span> is due soon
                  </>
                ) : (
                  <>
                    {activity.description}
                  </>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <button className="text-sm text-primary hover:underline">
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
}