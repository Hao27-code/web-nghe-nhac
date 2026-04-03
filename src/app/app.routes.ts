import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./search/search.page').then(m => m.SearchPage)
      }
    ]
  }
];


