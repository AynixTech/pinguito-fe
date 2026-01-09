import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { DataDeletionComponent } from './pages/data-deletion/data-deletion.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: LandingComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
    },
    {
        path: 'data-deletion',
        component: DataDeletionComponent,
    },
    {
        path: 'terms-of-service',
        component: TermsOfServiceComponent,
    },
    {
        path: 'dashboard',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
