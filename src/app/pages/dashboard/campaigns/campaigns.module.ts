import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListCampaignsComponent } from './list-campaigns/list-campaigns.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { CampaignRoutingModule } from './campaign-routing.module';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { AiService } from '@services/ai.service';


@NgModule({
    declarations: [
        ListCampaignsComponent,
        EditCampaignComponent,
        CreateCampaignComponent
    ],
    imports: [
        CommonModule,
        FormsModule,              // 👈 NECESSARIO PER ngModel
        ReactiveFormsModule,
        CampaignRoutingModule,
    ],
    exports: [
        RouterModule
    ],
    providers: [AiService]

})
export class CampaignsModule { }
