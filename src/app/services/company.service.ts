import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Recupera la lista delle companies assegnate a un user tramite userUuid
    getCompaniesByUserUuid(userUuid: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users/${userUuid}/companies`);
    }
}
