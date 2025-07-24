import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartCampaignComponent } from '../../components/chart-campaign/chart-campaign.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CompaniesComponent } from './companies/companies.component';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MyCompaniesComponent } from './my-companies/my-companies.component';

@NgModule({
  declarations: [
    ChartCampaignComponent,
    DashboardComponent,
    LandingComponent,
    PageNotFoundComponent,
    CompaniesComponent,
    MyCompaniesComponent
  ],
  imports: [
    HighchartsChartModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DashboardRoutingModule
  ],
})
export class DashboardModule { }
