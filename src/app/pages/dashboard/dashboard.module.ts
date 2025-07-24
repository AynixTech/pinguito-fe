import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartCampaignComponent } from '../../components/chart-campaign/chart-campaign.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [

    ChartCampaignComponent,
    DashboardComponent],
  imports: [HighchartsChartModule, ReactiveFormsModule, CommonModule, DashboardRoutingModule],
})
export class DashboardModule { }
