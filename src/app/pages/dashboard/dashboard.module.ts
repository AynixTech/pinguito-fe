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
import { CompaniesModule } from './companies/companies.module';
import { ExperienceBarComponent } from '../../components/experience-bar/experience-bar.component';

@NgModule({
  declarations: [
    ChartCampaignComponent,
    ExperienceBarComponent,
    DashboardComponent,
    LandingComponent,
    PageNotFoundComponent,
  ],
  imports: [
    HighchartsChartModule,
    FormsModule,              // 👈 NECESSARIO PER ngModel
    ReactiveFormsModule,
    DashboardRoutingModule,
    CompaniesModule,
    CommonModule,
  ],
})
export class DashboardModule { }
