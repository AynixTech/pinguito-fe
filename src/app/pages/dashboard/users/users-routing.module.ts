import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
    {
        path: 'list-users',
        component: ListUsersComponent // elenco delle companies
    },
    {
        path: 'create-user',
        component: CreateUserComponent // creazione nuova company
    },
    {
        path: 'edit/:uuid',
        component: EditUserComponent // modifica company esistente
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
