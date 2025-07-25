import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';
import { Company } from './company.service';

// Sostituisci con la tua interfaccia Company

export interface CompanyState {
    company: Company | null;
}

@Injectable({
    providedIn: 'root'
})
export class CompanyStoreService {
    private initialState: CompanyState = {
        company: null,
    };

    private companySubject = new BehaviorSubject<CompanyState>(this.initialState);
    company$ = this.companySubject.asObservable();

    // Stream solo della company
    companyData$ = this.company$.pipe(map(state => state.company));

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.loadFromLocalStorage();
    }

    private loadFromLocalStorage() {
        if (!this.isBrowser) return;

        const companyJson = localStorage.getItem('company');

        if (companyJson) {
            this.companySubject.next({
                company: JSON.parse(companyJson),
            });
        }
    }

    setCompany(company: Company,) {
        if (this.isBrowser) {
            localStorage.setItem('company', JSON.stringify(company));
        }

        this.companySubject.next({ company });
    }

    setCompanyData(company: Company | null) {
        if (this.isBrowser) {
            if (company) {
                localStorage.setItem('company', JSON.stringify(company));
            } else {
                localStorage.removeItem('company');
            }
        }
        this.companySubject.next({
            ...this.companySubject.value,
            company,
        });
    }

    clearCompany() {
        if (this.isBrowser) {
            localStorage.removeItem('company');
        } 
        this.companySubject.next({ company: null });
    }

    get currentCompany() {
        return this.companySubject.value.company;

    }
}