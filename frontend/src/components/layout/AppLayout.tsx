import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import TopNav from './TopNav';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/projects', icon: 'folder_open', label: 'Proyectos' },
  { path: '/my-tasks', icon: 'task_alt', label: 'Mis tareas', disabled: true },
  { path: '/team', icon: 'groups', label: 'Equipo', disabled: true },
  { path: '/help', icon: 'help', label: 'Ayuda', disabled: true },
  { path: '/settings', icon: 'settings', label: 'Ajustes', disabled: true },
];

export default function AppLayout() {
  const { sidebarOpen } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-container">
      <TopNav />
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed md:sticky top-28 lg:top-16 left-0 h-[calc(100vh-112px)] lg:h-[calc(100vh-64px)] bg-surface border-r border-outline-variant transition-all duration-300 z-40 overflow-y-auto',
            'w-[min(18rem,calc(100vw-2rem))] md:w-64',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
          )}
        >
          <div className="p-3 border-b border-outline-variant">
            <div className="px-3 py-2">
              <p className={cn('text-xs font-medium uppercase text-outline', !sidebarOpen && 'md:hidden')}>
                Workspace
              </p>
              <p className={cn('text-sm font-semibold text-on-surface truncate', !sidebarOpen && 'md:hidden')}>
                Personal
              </p>
            </div>
            <button
              onClick={() => {
                navigate('/projects');
                window.dispatchEvent(new Event('taskflow:new-project'));
              }}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-primary px-3 py-2.5 text-sm font-medium shadow-sm hover:bg-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className={cn(!sidebarOpen && 'md:hidden')}>Nuevo proyecto</span>
            </button>
          </div>
          <nav className="p-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              const content = (
                <>
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  <span className={cn('text-sm', !sidebarOpen && 'md:hidden')}>
                    {item.label}
                  </span>
                </>
              );

              return item.disabled ? (
                <div
                  key={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant opacity-70"
                >
                  {content}
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      useUIStore.getState().setSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-medium'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  )}
                >
                  {content}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
            onClick={() => useUIStore.getState().setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-112px)] lg:min-h-[calc(100vh-64px)] min-w-0">
          <div className="mx-auto w-full max-w-[1440px] min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
