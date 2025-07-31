import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartCampaignComponent } from '../../components/chart-campaign/chart-campaign.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CompaniesModule } from './companies/companies.module';
import { ExperienceBarComponent } from '../../components/experience-bar/experience-bar.component';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { LogsComponent } from './logs/logs.component';

@NgModule({
  declarations: [
    ChartCampaignComponent,
    ExperienceBarComponent,
    ConfirmationDialogComponent,
    LeaderboardComponent,
    DashboardComponent,
    LandingComponent,
    LogsComponent,
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
