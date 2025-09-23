import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useKanbanStore } from '@/store/kanban-store';
import { ViewMode } from '@/types/kanban';

export function ViewToggle() {
  const { viewMode, setViewMode } = useKanbanStore();

  const handleViewChange = (value: string) => {
    if (value && (value === 'kanban' || value === 'list')) {
      setViewMode(value as ViewMode);
    }
  };

  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={handleViewChange} className="bg-muted rounded-lg p-1">
      <ToggleGroupItem value="kanban" aria-label="Kanban view" className="flex items-center gap-2 px-3 py-2">
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Board</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view" className="flex items-center gap-2 px-3 py-2">
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}