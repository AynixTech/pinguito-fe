import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartCampaignComponent } from '../../components/chart-campaign/chart-campaign.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CompaniesComponent } from './companies/companies.component';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    ChartCampaignComponent,
    DashboardComponent,
    LandingComponent,
    PageNotFoundComponent,
    CompaniesComponent
  ],
  imports: [
    HighchartsChartModule,
    ReactiveFormsModule,
    CommonModule,
    DashboardRoutingModule
  ],
})
export class DashboardModule { }
