import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'work',
    loadComponent: () => import('./pages/work/work').then((m) => m.Work),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: '**',
    redirectTo: '',
  },
];