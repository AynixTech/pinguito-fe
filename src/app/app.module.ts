import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';

import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';

import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { LoaderComponent } from './components/loader/loader.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

registerLocaleData(localeEs);

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        LoaderComponent,
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        ToastrModule,
        ToastrModule.forRoot({
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            timeOut: 3000,
        }),
        HttpClientModule,  // <-- aggiunto HttpClientModule
        AppRoutingModule,

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
