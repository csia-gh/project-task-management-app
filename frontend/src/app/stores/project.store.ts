import { Injectable, signal, computed } from '@angular/core';
import { Project, ProjectDetailModel } from '../models/project.model';
import { TaskItem } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectStore {
  private readonly _projects = signal<Project[]>([]);
  private readonly _selectedProject = signal<ProjectDetailModel | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly selectedProject = this._selectedProject.asReadonly();

  readonly projectCount = computed(() => this._projects().length);
  readonly selectedProjectTasks = computed(() => this._selectedProject()?.taskItems || []);

  // PROJECT LIST MUTATIONS
  setProjects(projects: Project[]) {
    this._projects.set(projects);
  }

  addProject(project: Project) {
    this._projects.update((current) => [...current, project]);
  }

  updateProjectInList(projectId: string, updates: Partial<Project>) {
    this._projects.update((current) =>
      current.map((p) => (p.id === projectId ? { ...p, ...updates } : p))
    );
  }

  removeProject(projectId: string) {
    this._projects.update((current) => current.filter((p) => p.id !== projectId));

    if (this._selectedProject()?.id === projectId) {
      this._selectedProject.set(null);
    }
  }

  // SELECTED PROJECT MUTATIONS
  setSelectedProject(project: ProjectDetailModel | null) {
    this._selectedProject.set(project);

    if (project) {
      this.updateProjectInList(project.id, {
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
      });
    }
  }

  updateSelectedProject(updates: Partial<ProjectDetailModel>) {
    this._selectedProject.update((current) => (current ? { ...current, ...updates } : null));

    const current = this._selectedProject();
    if (current) {
      this.updateProjectInList(current.id, updates);
    }
  }

  clearSelectedProject() {
    this._selectedProject.set(null);
  }

  // TASK MUTATIONS (selected project page)
  setSelectedProjectTasks(tasks: TaskItem[]) {
    this._selectedProject.update((current) =>
      current
        ? {
            ...current,
            taskItems: tasks,
          }
        : null
    );
  }

  addTaskToSelectedProjectTasks(task: any) {
    this._selectedProject.update((p) => (p ? { ...p, taskItems: [...p.taskItems, task] } : null));
  }

  removeTaskFromSelected(taskId: string) {
    this._selectedProject.update((p) =>
      p ? { ...p, taskItems: p.taskItems.filter((t) => t.id !== taskId) } : null
    );
  }

  updateTaskInSelected(taskId: string, updatedTask: any) {
    this._selectedProject.update((p) =>
      p
        ? {
            ...p,
            taskItems: p.taskItems.map((t) => (t.id === taskId ? updatedTask : t)),
          }
        : null
    );
  }

  reset() {
    this._projects.set([]);
    this._selectedProject.set(null);
  }
}
