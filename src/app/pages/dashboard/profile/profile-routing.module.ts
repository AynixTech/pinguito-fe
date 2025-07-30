import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';

const routes: Routes = [
    {
        path: 'my-profile',
        component: MyProfileComponent // elenco delle companies
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
