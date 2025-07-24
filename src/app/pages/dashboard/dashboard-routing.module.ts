  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { DashboardComponent } from './dashboard.component';
  import { CompaniesComponent } from './companies/companies.component';
  import { LandingComponent } from './landing/landing.component';
  import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

  const routes: Routes = [
    {
      path: '',
      component: DashboardComponent,
      children: [
        {
          path: '',
          component: LandingComponent,
        },
        {
          path: 'dashboard',
          redirectTo: '',
          pathMatch: 'full',
        },
        {
          path: 'companies',
          component: CompaniesComponent, // Replace with actual analytics component
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
