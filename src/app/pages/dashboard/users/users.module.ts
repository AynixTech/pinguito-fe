import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserRoutingModule } from './users-routing.module';



@NgModule({
    declarations: [
        ListUsersComponent,
        EditUserComponent
    ],
    imports: [
        CommonModule,
        FormsModule,              // 👈 NECESSARIO PER ngModel
        ReactiveFormsModule,
        UserRoutingModule,
    ],
    exports: [
        RouterModule
    ]
})
export class UsersModule { }
