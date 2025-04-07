import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./pages/edit/edit.component').then((m) => m.EditComponent),
  },
  {
    path: 'export',
    loadComponent: () =>
      import('./pages/export/export.component').then((m) => m.ExportComponent),
  },
  {
    path: 'import',
    loadComponent: () =>
      import('./pages/import/import.component').then((m) => m.ImportComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
