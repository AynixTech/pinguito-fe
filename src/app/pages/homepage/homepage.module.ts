import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartCampaignComponent } from '../../components/chart-campaign/chart-campaign.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [

    ChartCampaignComponent,
    HomepageComponent],
  imports: [HighchartsChartModule, ReactiveFormsModule, CommonModule, HomepageRoutingModule],
})
export class HomepageModule { }
