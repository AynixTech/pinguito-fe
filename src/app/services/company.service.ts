import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.service';

export interface Company {
    uuid: string;
    name: string;
    vatNumber?: string;
    legalAddress?: string;
    operationalAddress?: string;
    pecEmail?: string;
    industry?: string;
    numberOfEmployees?: number;
    annualRevenue?: number;
    marketingContactName?: string;
    marketingContactEmail?: string;
    marketingContactPhone?: string;
    websiteTraffic?: number;
    preferredCommunicationChannel?: string;
    customerSegment?: string;
    campaignBudget?: number;
    notes?: string;
    planId?: number;
    monitorUsers?: User[] | null; // id utente assegnato (opzionale)
    monitorUserUuids?: string[]; // UUID degli utenti assegnati al monitoraggio
}
@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private baseUrl = environment.apiUrl + '/companies';

    constructor(private http: HttpClient) { }

    //Monitoring: Recupera la lista delle companies associate all'utente
    getCompaniesByUserUuid(userUuid: string): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.baseUrl}/${userUuid}/my-companies`);
    }

    //Admin: canella una company
    deleteCompany(companyUuid: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${companyUuid}/delete`);
    }
    //Admin recupera la lista di tutte le companies
    getAllCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.baseUrl}/all`);
    }
    getCompanyByUuid(uuid: string): Observable<Company> {
        return this.http.get<Company>(`${this.baseUrl}/${uuid}/getCompany`);
    }

    createCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(`${this.baseUrl}/createCompany`, company);
    }

    updateCompany(company: Company): Observable<Company> {
        return this.http.put<Company>(`${this.baseUrl}/${company.uuid}/updateCompany`, company);
    }

}
