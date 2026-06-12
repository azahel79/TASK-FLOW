import { useUIStore } from '@/stores/ui.store';

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  const colorMap = {
    success: 'bg-tertiary-container text-on-tertiary-container',
    error: 'bg-error text-on-error',
    info: 'bg-primary text-on-primary',
  };

  const accentMap = {
    success: 'border-l-tertiary',
    error: 'border-l-error',
    info: 'border-l-primary',
  };

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:top-6 z-[200] flex flex-col gap-3 md:w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-surface-container-lowest text-on-surface px-5 py-4 rounded-xl shadow-2xl border border-outline-variant border-l-4 flex items-start gap-4 animate-toast-slide-in w-full ${accentMap[toast.type]}`}
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${colorMap[toast.type]}`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {iconMap[toast.type]}
            </span>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-base font-semibold">{toast.title}</p>
            {toast.message && (
              <p className="text-sm text-on-surface-variant mt-1 leading-snug">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors rounded-full p-1"
            title="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
