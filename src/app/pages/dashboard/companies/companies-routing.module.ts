import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { DetailCompanyComponent } from './detail-company/detail-company.component';

const routes: Routes = [
    {
        path: '',
        component: ListCompaniesComponent // elenco delle companies
    },
    {
        path: 'detail/:uuid',
        component: DetailCompanyComponent // modifica company esistente
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }
