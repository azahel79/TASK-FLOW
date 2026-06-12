import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-[560px]',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 backdrop-blur-custom animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'form-glass w-full rounded-xl overflow-hidden animate-slide-up max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)] flex flex-col',
          maxWidth
        )}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-outline-variant flex items-start justify-between gap-3 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-on-surface">{title}</h2>
            {description && (
              <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:bg-surface-container transition-colors p-2 rounded-full flex-shrink-0"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-4 bg-surface-container-low flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-outline-variant flex-shrink-0 [&>button]:w-full sm:[&>button]:w-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
