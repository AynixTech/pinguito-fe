import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { ProfileRoutingModule } from './profile-routing.module';



@NgModule({
    declarations: [
        MyProfileComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,              // 👈 NECESSARIO PER ngModel
        ReactiveFormsModule,
        ProfileRoutingModule,
    ],
    exports: [
        RouterModule
    ]
})
export class ProfileModule { }
