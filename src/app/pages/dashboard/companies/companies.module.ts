import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { CompanyRoutingModule } from './companies-routing.module';
import { CreateCompanyComponent } from './create-company/create-company.component';



@NgModule({
    declarations: [
        ListCompaniesComponent,
        CreateCompanyComponent,
        EditCompanyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,              // 👈 NECESSARIO PER ngModel
        ReactiveFormsModule,
        CompanyRoutingModule
    ],
    exports: [
        RouterModule
    ]
})
export class CompaniesModule { }
