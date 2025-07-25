import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';

const routes: Routes = [
    {
        path: '',
        component: ListCompaniesComponent // elenco delle companies
    },
    {
        path: 'edit/:uuid',
        component: EditCompanyComponent // modifica company esistente
    },
    {
        path: 'create',
        component: EditCompanyComponent // creazione nuova company
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }
