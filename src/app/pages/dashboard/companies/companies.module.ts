import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';

const routes: Routes = [
    { path: '', component: ListCompaniesComponent },            // Lista companies
    { path: 'edit/:id', component: EditCompanyComponent },      // Modifica company con id
    { path: 'create', component: EditCompanyComponent },        // Creazione nuova company (optional)
];

@NgModule({
    declarations: [
        ListCompaniesComponent,
        EditCompanyComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes)  // Usa forChild perché modulo figlio
    ],
    exports: [
        RouterModule
    ]
})
export class CompaniesModule { }
