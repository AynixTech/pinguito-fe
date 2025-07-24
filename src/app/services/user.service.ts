import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    // ✅ Recupera l'utente per ID
    getUserByUuid(uuid: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${uuid}`);
    }

    // ✅ Aggiorna un utente
    updateUser(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data);
    }
}
