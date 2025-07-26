import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CompaniesComponent } from './companies/companies.component';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from '../../guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: LandingComponent,
        pathMatch: 'full'
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('./companies/companies.module').then(m => m.CompaniesModule),

        canActivate: [AuthGuard],
        data: { roles: ['admin', 'monitoring'] }
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then(m => m.UsersModule),

        canActivate: [AuthGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'campaigns',
        loadChildren: () =>
          import('./campaigns/campaigns.module').then(m => m.CampaignsModule),
        canActivate: [AuthGuard],
        data: { roles: ['admin','monitoring'] }
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
