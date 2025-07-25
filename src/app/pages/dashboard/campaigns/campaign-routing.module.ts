import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCampaignsComponent } from './list-campaigns/list-campaigns.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';

const routes: Routes = [
    {
        path: '',
        component: ListCampaignsComponent // elenco delle campagne
    },
    {
        path: 'edit/:uuid',
        component: EditCampaignComponent // modifica campagna esistente
    },
    {
        path: 'create',
        component: CreateCampaignComponent // creazione nuova campagna
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaignRoutingModule { }
