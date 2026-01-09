import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEmailCampaignsComponent } from './list-email-campaigns/list-email-campaigns.component';
import { CreateEmailCampaignComponent } from './create-email-campaign/create-email-campaign.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';

const routes: Routes = [
  { path: 'list', component: ListEmailCampaignsComponent },
  { path: 'create', component: CreateEmailCampaignComponent },
  { path: 'templates', component: EmailTemplatesComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailCampaignsRoutingModule { }
