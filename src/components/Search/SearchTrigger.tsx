import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "btn-ghost-hover group relative flex items-center justify-center gap-3 min-w-[200px] px-4 bg-background/10 border border-gray-400/50 backdrop-blur-sm",
        className
      )}
    >
      <Search className="w-4 h-4 flex-shrink-0 text-white/90" />
      <span className="hidden sm:inline text-sm text-white/80 group-hover:text-white">
        Search...
      </span>
      <div className="hidden sm:flex items-center gap-1 ml-auto">
        <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border border-white/30 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/70">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </Button>
  );
}