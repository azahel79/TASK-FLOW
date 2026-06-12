import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/types';
import { projectsService } from '@/services/projects.service';
import { useUIStore } from '@/stores/ui.store';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [openCollaboration, setOpenCollaboration] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});

  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await projectsService.getAll(1, 50);
      setProjects(response.data);

      const counts: Record<string, number> = {};
      for (const project of response.data) {
        counts[project.id] = project._count?.tasks ?? 0;
      }
      setTaskCounts(counts);
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudieron cargar los proyectos' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const openCreateProject = () => setShowCreateModal(true);
    window.addEventListener('taskflow:new-project', openCreateProject);
    return () => window.removeEventListener('taskflow:new-project', openCreateProject);
  }, []);

  const filteredProjects = projects.filter((project) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return `${project.name} ${project.description ?? ''}`.toLowerCase().includes(query);
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setOpenCollaboration(true);
    setSelectedProject(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await projectsService.create({ name, description });
      addToast({ type: 'success', title: '¡Proyecto creado!', message: `"${name}" se ha creado exitosamente` });
      setShowCreateModal(false);
      resetForm();
      loadProjects();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo crear el proyecto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setIsSubmitting(true);
    try {
      await projectsService.update(selectedProject.id, { name, description });
      addToast({ type: 'success', title: '¡Proyecto actualizado!' });
      setShowEditModal(false);
      resetForm();
      loadProjects();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo actualizar el proyecto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setIsSubmitting(true);
    try {
      await projectsService.delete(selectedProject.id);
      addToast({ type: 'success', title: 'Proyecto eliminado' });
      setShowDeleteModal(false);
      setSelectedProject(null);
      loadProjects();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'No se pudo eliminar el proyecto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setName(project.name);
    setDescription(project.description || '');
    setShowEditModal(true);
  };

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Projects</h1>
          <p className="text-on-surface-variant mt-1">
            {projects.length === 0
              ? 'Crea tu primer proyecto para comenzar'
              : `Tienes ${projects.length} proyecto${projects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <label className="relative sm:w-72">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
              search
            </span>
            <input
              className="w-full h-10 rounded-lg bg-surface-container-lowest border border-outline-variant pl-11 pr-4 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
              placeholder="Filtrar proyectos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
            />
          </label>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto"
            icon={<span className="material-symbols-outlined">add</span>}
          >
            New Project
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary animate-spin text-[28px]">progress_activity</span>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon="folder_off"
          title={projects.length === 0 ? 'Sin proyectos todavía' : 'Sin resultados'}
          description={
            projects.length === 0
              ? 'Crea tu primer proyecto para empezar a organizar tus tareas de manera eficiente.'
              : 'No encontramos proyectos con ese filtro.'
          }
          action={
            projects.length === 0
              ? { label: 'Create Your First Project', onClick: () => setShowCreateModal(true), icon: 'add' }
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover:shadow-md transition-all cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index, 5) * 0.08}s` }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-container text-primary px-2.5 py-1 text-xs font-medium">
                    <span className="material-symbols-outlined text-[14px]">category</span>
                    Workspace
                  </span>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(project); }}
                      className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openDeleteModal(project); }}
                      className="p-1.5 hover:bg-error-container hover:text-error rounded-lg transition-colors text-on-surface-variant"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container text-[22px]">folder_open</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-on-surface truncate">{project.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{formatDate(project.createdAt)}</p>
                  </div>
                </div>

                <p className="text-sm text-on-surface-variant mt-4 mb-4 line-clamp-2 min-h-10">
                  {project.description || 'Sin descripción todavía.'}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge status="PENDING" size="sm" />
                  <Badge status="IN_PROGRESS" size="sm" />
                  <Badge status="DONE" size="sm" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-outline-variant text-xs text-on-surface-variant">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">checklist</span>
                    {taskCounts[project.id] ?? 0} tareas
                  </span>
                  <span>Actualizado {formatDate(project.updatedAt)}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-on-surface-variant">
            <span>Showing 1 to {filteredProjects.length} of {projects.length} projects</span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={page === 1 ? 'w-9 h-9 rounded-lg bg-primary text-on-primary' : 'w-9 h-9 rounded-lg hover:bg-surface-container-high'}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title="Nuevo Proyecto"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowCreateModal(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} loading={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Proyecto'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nombre del Proyecto"
            icon="folder_open"
            placeholder="Ej: Rediseño Web 2024"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Descripción</label>
            <textarea
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline-variant text-on-surface resize-none"
              rows={3}
              placeholder="Describe brevemente los objetivos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
            <span className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">groups</span>
              <span>
                <span className="block text-sm font-medium text-on-surface">Colaboración abierta</span>
                <span className="block text-xs text-on-surface-variant">Permite invitar miembros del equipo al proyecto.</span>
              </span>
            </span>
            <input
              type="checkbox"
              checked={openCollaboration}
              onChange={(e) => setOpenCollaboration(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        title="Editar proyecto"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} loading={isSubmitting}>
              Guardar cambios
            </Button>
          </>
        }
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Nombre del Proyecto"
            icon="folder_open"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Descripción</label>
            <textarea
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline-variant text-on-surface resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelectedProject(null); }}
        title="Eliminar proyecto"
        description="Esta acción no se puede deshacer"
        maxWidth="max-w-[420px]"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setSelectedProject(null); }}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={isSubmitting}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant">
          ¿Estás seguro de eliminar el proyecto <strong className="text-on-surface">"{selectedProject?.name}"</strong>?
          Todas las tareas asociadas también serán eliminadas.
        </p>
      </Modal>
    </div>
  );
}
