import { Routes } from '@angular/router';
import {desktopOnlyGuard, mobileOnlyGuard} from "./guards/device-guard";

export const routes: Routes = [
  // ========== MOBILE (có tabs) ==========
  {
    path: 'tabs',
    canMatch: [mobileOnlyGuard],
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'search',
        loadComponent: () => import('./search/search.page').then(m => m.SearchPage)
      },
      {
        path: 'library',
        loadComponent: () => import('./library/library.page').then(m => m.LibraryPage)
      },
      {
        path: 'favorite',
        loadComponent:()=>import('./favorite/favorite.page').then(m=>m.FavoritePage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'category',
        loadComponent: () => import('./category/category.page').then( m => m.CategoryPage)
      },
      // default trong tabs
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

    ]
  },

  // ========== DESKTOP (không tabs, trực tiếp) ==========
  {
    path: 'home',
    canMatch: [desktopOnlyGuard],
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'search',
    canMatch: [desktopOnlyGuard],
    loadComponent: () => import('./search/search.page').then(m => m.SearchPage)
  },
  {
    path: 'library',
    canMatch: [desktopOnlyGuard],
    loadComponent: () => import('./library/library.page').then(m => m.LibraryPage)
  },
  {
    path: 'favorite',
    canMatch: [desktopOnlyGuard],
    loadComponent: () => import('./favorite/favorite.page').then(m => m.FavoritePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: 'category',
    canMatch: [desktopOnlyGuard],
    loadComponent: () => import('./category/category.page').then( m => m.CategoryPage)
  },


  // ========== 404 ==========
  {
    path: 'not-found',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // ========== DEFAULT ==========
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },

  // ========== FALLBACK ==========
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
