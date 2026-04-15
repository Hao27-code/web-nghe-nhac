import { Routes } from '@angular/router';

export const routes: Routes = [
  // ========== MOBILE (có tabs) ==========
  {
    path: 'tabs',
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
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // ========== DESKTOP (không tabs, trực tiếp) ==========
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
    loadComponent: () => import('./favorite/favorite.page').then(m => m.FavoritePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: 'category',
    loadComponent: () => import('./category/category.page').then( m => m.CategoryPage)
  },

  // ========== MẶC ĐỊNH ==========
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // Fallback
  {
    path: '**',
    redirectTo: '/tabs/home'
  },
  {
    path: 'song-item',
    loadComponent: () => import('./components/song-item/song-item.page').then(m => m.SongItemPage)
  },
  {
    path: 'song-list',
    loadComponent: () => import('./components/song-list/song-list.page').then(m => m.SongListPage)
  },

];
