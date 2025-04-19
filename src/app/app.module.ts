import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomepageModule } from './pages/homepage/homepage.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';

import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';

import { ReactiveFormsModule } from '@angular/forms';

registerLocaleData(localeEs);

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        HomepageModule,

    ],

    bootstrap: [AppComponent],
})
export class AppModule { }
