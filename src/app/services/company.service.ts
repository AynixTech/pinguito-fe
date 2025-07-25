import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private baseUrl = environment.apiUrl + '/companies';

    constructor(private http: HttpClient) { }

    //Monitoring: Recupera la lista delle companies associate all'utente
    getCompaniesByUserUuid(userUuid: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${userUuid}/my-companies`);
    }

    //Admin: canella una company
    deleteCompany(companyUuid: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${companyUuid}/delete`);
    }
    //Admin recupera la lista di tutte le companies
    getAllCompanies(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/all`);
    }
}
