import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomepageComponent],
  imports: [ReactiveFormsModule, CommonModule, HomepageRoutingModule],
})
export class HomepageModule { }
