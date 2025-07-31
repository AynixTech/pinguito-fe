import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { CreateCompanyComponent } from './create-company/create-company.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list-companies',
                component: ListCompaniesComponent // elenco delle companies
            },
            {
                path: 'create-company',
                component: CreateCompanyComponent
            },
            {
                path: 'edit-company/:uuid',
                component: EditCompanyComponent // modifica company esistente
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }
