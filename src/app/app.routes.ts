import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./history-page/history-page.component').then(
        (m) => m.HistoryPageComponent
      ),
  },
];
