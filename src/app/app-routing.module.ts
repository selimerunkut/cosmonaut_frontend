import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuBarComponent } from './menu-bar/menu-bar.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: MenuBarComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./cosmonaut-dashboard/cosmonaut-dashboard.module').then(
            (m) => m.CosmonautDashboardModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
