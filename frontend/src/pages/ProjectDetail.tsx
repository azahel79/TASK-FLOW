import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Project, Task, TaskStatus, TaskFilter, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import { projectsService } from '@/services/projects.service';
import { tasksService } from '@/services/tasks.service';
import { useUIStore } from '@/stores/ui.store';
import { formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

const statusOptions: { value: TaskStatus; label: string; icon: string }[] = [
  { value: 'PENDING', label: 'Pending', icon: 'radio_button_unchecked' },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: 'motion_photos_on' },
  { value: 'DONE', label: 'Done', icon: 'check_circle' },
];

export default function ProjectDetail() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('ALL');
  const [search, setSearch] = useState('');

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('PENDING');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showEditProject, setShowEditProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await projectsService.getById(projectId);
      setProject(data);
      setProjectName(data.name);
      setProjectDescription(data.description || '');
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo cargar el proyecto' });
      navigate('/');
    }
  }, [projectId, addToast, navigate]);

  const loadTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const params = filter !== 'ALL' ? { status: filter } : undefined;
      const response = await tasksService.getByProject(projectId, params);
      setTasks(response.data);
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudieron cargar las tareas' });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, filter, addToast]);

  const loadTaskStats = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await tasksService.getByProject(projectId, { limit: 100 });
      setAllTasks(response.data);
    } catch {
      // The visible task list handles load errors.
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadTaskStats();
  }, [loadTaskStats]);

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('PENDING');
    setEditingTask(null);
  };

  const openCreateTask = () => {
    resetTaskForm();
    setShowTaskModal(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskStatus(task.status);
    setShowTaskModal(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setIsSubmitting(true);
    try {
      const data: CreateTaskRequest = {
        title: taskTitle,
        description: taskDescription || undefined,
        status: taskStatus,
        projectId,
      };
      await tasksService.create(projectId, data);
      addToast({ type: 'success', title: '¡Tarea creada!' });
      setShowTaskModal(false);
      resetTaskForm();
      loadTaskStats();
      loadTasks();
    } catch {
      addToast({ type: 'error', title: 'Error Creating Task', message: 'No se pudo crear la tarea' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !editingTask) return;
    setIsSubmitting(true);
    try {
      const data: UpdateTaskRequest = {
        title: taskTitle,
        description: taskDescription || undefined,
        status: taskStatus,
      };
      await tasksService.update(projectId, editingTask.id, data);
      addToast({ type: 'success', title: '¡Tarea actualizada!' });
      setShowTaskModal(false);
      resetTaskForm();
      loadTaskStats();
      loadTasks();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo actualizar la tarea' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!projectId || !deletingTask) return;
    setIsSubmitting(true);
    try {
      await tasksService.delete(projectId, deletingTask.id);
      addToast({ type: 'success', title: 'Tarea eliminada' });
      setShowDeleteTaskModal(false);
      setDeletingTask(null);
      loadTaskStats();
      loadTasks();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo eliminar la tarea' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (!projectId) return;
    try {
      await tasksService.update(projectId, task.id, { status: newStatus });
      loadTaskStats();
      loadTasks();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo actualizar el estado' });
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setIsSubmitting(true);
    try {
      await projectsService.update(projectId, { name: projectName, description: projectDescription });
      addToast({ type: 'success', title: '¡Proyecto actualizado!' });
      setShowEditProject(false);
      loadProject();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo actualizar el proyecto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statsSource = allTasks.length > 0 || tasks.length === 0 ? allTasks : tasks;
  const stats = {
    all: project?._count?.tasks ?? statsSource.length,
    pending: statsSource.filter((task) => task.status === 'PENDING').length,
    inProgress: statsSource.filter((task) => task.status === 'IN_PROGRESS').length,
    done: statsSource.filter((task) => task.status === 'DONE').length,
  };

  const visibleTasks = tasks.filter((task) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${task.title} ${task.description ?? ''}`.toLowerCase().includes(query);
  });

  if (!project && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary animate-spin text-[28px]">progress_activity</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant overflow-hidden">
        <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
          Dashboard
        </button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium truncate">{project?.name}</span>
      </div>

      <section className="glass rounded-xl border border-outline-variant p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{project?.name}</h1>
            <p className="text-on-surface-variant mt-1 max-w-2xl">
              {project?.description || 'Sin descripción todavía.'}
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Creado el {project?.createdAt ? formatDate(project.createdAt) : ''}
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => setShowEditProject(true)}
            icon={<span className="material-symbols-outlined">edit</span>}
          >
            Edit
          </Button>
        </div>
      </section>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {([
            ['ALL', `All ${stats.all}`],
            ['PENDING', `Pending ${stats.pending}`],
            ['IN_PROGRESS', `In Progress ${stats.inProgress}`],
            ['DONE', `Completed ${stats.done}`],
          ] as [TaskFilter, string][]).map(([status, label]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                filter === status
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <label className="relative sm:w-72">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">search</span>
            <input
              className="w-full h-10 rounded-lg bg-surface-container-lowest border border-outline-variant pl-11 pr-4 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
              placeholder="Buscar tareas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
            />
          </label>
          <Button className="w-full sm:w-auto" onClick={openCreateTask} icon={<span className="material-symbols-outlined">add</span>}>
            New Task
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary animate-spin text-[28px]">progress_activity</span>
          </div>
        </div>
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          icon="task_alt"
          title={filter !== 'ALL' ? 'Sin tareas con este filtro' : 'Sin tareas todavía'}
          description={filter !== 'ALL' ? 'Cambia el filtro o crea nuevas tareas.' : 'Crea tu primera tarea para este proyecto.'}
          action={filter === 'ALL' ? { label: 'Create New Task', onClick: openCreateTask, icon: 'add' } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {visibleTasks.map((task) => {
            const nextStatus: Record<TaskStatus, TaskStatus> = {
              PENDING: 'IN_PROGRESS',
              IN_PROGRESS: 'DONE',
              DONE: 'PENDING',
            };

            return (
              <article
                key={task.id}
                className={cn(
                  'task-row-transition bg-surface-container-lowest rounded-xl border border-outline-variant p-4 group',
                  task.status === 'IN_PROGRESS' && 'border-l-4 border-l-primary',
                  task.status === 'DONE' && 'opacity-80'
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleQuickStatusChange(task, nextStatus[task.status])}
                    className={cn(
                      'checkbox-pop w-9 h-9 rounded-full flex items-center justify-center transition-all mt-0.5 flex-shrink-0',
                      task.status === 'DONE'
                        ? 'bg-tertiary-container text-on-tertiary-container'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
                    )}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {task.status === 'DONE' ? 'check_circle' : task.status === 'IN_PROGRESS' ? 'motion_photos_on' : 'radio_button_unchecked'}
                    </span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className={cn('font-medium text-on-surface', task.status === 'DONE' && 'line-through opacity-70')}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => openEditTask(task)} className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => { setDeletingTask(task); setShowDeleteTaskModal(true); }} className="p-1.5 hover:bg-error-container hover:text-error rounded-lg transition-colors text-on-surface-variant" title="Eliminar">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                      <div className="flex items-center gap-3">
                        <Badge status={task.status} size="sm" />
                        <span className="text-xs text-on-surface-variant">{formatDate(task.createdAt)}</span>
                      </div>
                      <div className="flex items-center -space-x-2">
                        {['AD', 'MJ', 'CL'].map((initials) => (
                          <span key={initials} className="w-7 h-7 rounded-full bg-primary-container text-primary border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">
                            {initials}
                          </span>
                        ))}
                        <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold">
                          +3
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showTaskModal}
        onClose={() => { setShowTaskModal(false); resetTaskForm(); }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        description={editingTask ? 'Update task details and status.' : 'Add a task to this project.'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowTaskModal(false); resetTaskForm(); }}>
              Cancel
            </Button>
            <Button onClick={editingTask ? handleUpdateTask : handleCreateTask} loading={isSubmitting}>
              {editingTask ? 'Save Task' : 'Create Task'}
            </Button>
          </>
        }
      >
        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
          <Input
            label="Title"
            icon="task_alt"
            placeholder="Ej: Implementar login"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Description</label>
            <textarea
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline-variant text-on-surface resize-none"
              rows={3}
              placeholder="Describe los detalles de la tarea..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Status</label>
            <select
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteTaskModal}
        onClose={() => { setShowDeleteTaskModal(false); setDeletingTask(null); }}
        title="Eliminar tarea"
        maxWidth="max-w-[420px]"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowDeleteTaskModal(false); setDeletingTask(null); }}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteTask} loading={isSubmitting}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant">
          ¿Estás seguro de eliminar la tarea <strong className="text-on-surface">"{deletingTask?.title}"</strong>?
        </p>
      </Modal>

      <Modal
        isOpen={showEditProject}
        onClose={() => setShowEditProject(false)}
        title="Editar proyecto"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditProject(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProject} loading={isSubmitting}>
              Guardar cambios
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <Input
            label="Nombre del proyecto"
            icon="folder_open"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Descripción</label>
            <textarea
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline-variant text-on-surface resize-none"
              rows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
