import { Routes } from '@angular/router';
import { ProjectList } from './pages/project-list/project-list';
import { ProjectDetail } from './pages/project-detail/project-detail';

export const routes: Routes = [
  { path: '', title: 'Projects', component: ProjectList },
  { path: 'projects/:id', title: 'Project Details', component: ProjectDetail },
  {
    path: '**',
    redirectTo: '',
  },
];
