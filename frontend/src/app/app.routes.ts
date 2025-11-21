import { Routes } from '@angular/router';
import { ProjectList } from './pages/project-list/project-list';
import { ProjectDetail } from './pages/project-detail/project-detail';

export const routes: Routes = [
  { path: '', title: 'Projects | Project & Task Manager', component: ProjectList },
  {
    path: 'projects/:id',
    title: 'Project Details | Project & Task Manager',
    component: ProjectDetail,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
