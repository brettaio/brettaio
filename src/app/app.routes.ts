import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'restaurants/:slug',
    loadComponent: () =>
      import('./pages/restaurant/restaurant').then((m) => m.Restaurant),
  },
  {
    path: 'thank-you',
    loadComponent: () =>
      import('./pages/thank-you/thank-you').then((m) => m.ThankYou),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
