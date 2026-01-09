import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListContactsComponent } from './list-contacts/list-contacts.component';
import { CreateContactComponent } from './create-contact/create-contact.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';

const routes: Routes = [
  {
    path: 'list-contacts',
    component: ListContactsComponent
  },
  {
    path: 'create-contact',
    component: CreateContactComponent
  },
  {
    path: 'edit-contact/:uuid',
    component: EditContactComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
