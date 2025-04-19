import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import * as ComponentsList from '../components/index';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderLayoutComponent } from './layout/components/header-layout/header-layout.component';
import { FooterLayoutComponent } from './layout/components/footer-layout/footer-layout.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    ...ComponentsList.genericComponentsList, LayoutComponent, SidebarComponent, HeaderLayoutComponent, FooterLayoutComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [LayoutComponent],
})
export class SharedModule { }
