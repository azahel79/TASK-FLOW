import type { TaskStatus, TaskFilter } from '@/types';
import { cn } from '@/lib/utils';

interface BadgeProps {
  status: TaskStatus | TaskFilter;
  size?: 'sm' | 'md';
  onClick?: () => void;
  interactive?: boolean;
}

const statusConfig: Record<string, { label: string; icon: string; color: string }> = {
  PENDING: { label: 'Pendiente', icon: 'radio_button_unchecked', color: 'text-outline bg-surface-container-high' },
  IN_PROGRESS: { label: 'En progreso', icon: 'pending', color: 'text-primary bg-primary-container' },
  DONE: { label: 'Completado', icon: 'check_circle', color: 'text-tertiary bg-tertiary-container' },
  ALL: { label: 'Todos', icon: 'list', color: 'text-on-surface-variant bg-surface-container-high' },
};

export default function Badge({ status, size = 'sm', onClick, interactive }: BadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <button
      onClick={onClick}
      disabled={!interactive}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full transition-all',
        config.color,
        size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm',
        interactive && 'hover:shadow-sm cursor-pointer hover:scale-105 active:scale-95',
        !interactive && 'cursor-default'
      )}
    >
      <span className="material-symbols-outlined text-[16px]">{config.icon}</span>
      <span className="font-medium">{config.label}</span>
    </button>
  );
}
