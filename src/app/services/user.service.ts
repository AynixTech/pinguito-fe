import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    uuid: string;
    email: string;
    name: string;
    surname: string;
    role: {
        id: number;
        name: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    // recupera utenti monitoraggio
    getMonitoringUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/monitoring`);
    }
    // Recupera l'utente per ID
    getUserByUuid(uuid: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${uuid}`);
    }

    // ✅ Aggiorna un utente
    updateUser(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data);
    }
}
