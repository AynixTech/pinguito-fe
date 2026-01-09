import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailCampaignsRoutingModule } from './email-campaigns-routing.module';
import { ListEmailCampaignsComponent } from './list-email-campaigns/list-email-campaigns.component';
import { CreateEmailCampaignComponent } from './create-email-campaign/create-email-campaign.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';

@NgModule({
  declarations: [
    ListEmailCampaignsComponent,
    CreateEmailCampaignComponent,
    EmailTemplatesComponent,
    CampaignDetailComponent
  ],
  imports: [
    CommonModule,
    EmailCampaignsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EmailCampaignsModule { }
