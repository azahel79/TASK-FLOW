import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { getInitials } from '@/lib/utils';

export default function TopNav() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="glass-header border-b border-outline-variant sticky top-0 z-50">
      <div className="min-h-16 flex items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface flex-shrink-0"
            title="Abrir menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined filled text-on-primary text-[20px]">task_alt</span>
            </div>
            <span className="text-lg font-semibold text-on-surface hidden sm:block truncate">TaskFlow</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <label className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
              search
            </span>
            <input
              className="w-full h-10 rounded-full bg-surface-container-lowest border border-outline-variant pl-11 pr-4 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
              placeholder="Buscar proyectos, tareas o equipo"
              type="search"
            />
          </label>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {['notifications', 'settings'].map((icon) => (
            <button
              key={icon}
              className="hidden sm:inline-flex p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
              title={icon === 'notifications' ? 'Notificaciones' : 'Configuración'}
            >
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
          <div className="flex items-center gap-3 md:mr-2">
            <div className="w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
              {user ? getInitials(user.name) : '?'}
            </div>
            <span className="text-sm font-medium text-on-surface hidden xl:block max-w-40 truncate">
              {user?.name}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-error-container hover:text-error rounded-full transition-colors text-on-surface-variant"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 lg:hidden">
        <label className="relative block">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
            search
          </span>
          <input
            className="w-full h-10 rounded-full bg-surface-container-lowest border border-outline-variant pl-11 pr-4 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
            placeholder="Buscar"
            type="search"
          />
        </label>
      </div>
    </header>
  );
}
