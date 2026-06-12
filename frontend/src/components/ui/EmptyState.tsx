import Button from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px] text-outline">
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} icon={action.icon ? <span className="material-symbols-outlined">{action.icon}</span> : undefined}>
          {action.label}
        </Button>
      )}
    </div>
  );
}