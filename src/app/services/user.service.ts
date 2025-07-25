import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    uuid: string;
    email: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
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

    // Recupera tutti gli utenti
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/allUsers`);
    }

    //Elimina un utente per UUID
    deleteUser(uuid: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${uuid}`);
    }

    // recupera utenti monitoraggio
    getMonitoringUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/monitoring`);
    }
    // Recupera l'utente per ID
    getUserByUuid(uuid: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${uuid}/getUser`);
    }
    // Aggiorna password
    updatePassword(uuid: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${uuid}/updatePassword`, data);
    }

    // ✅ Aggiorna un utente
    updateUser(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}/updateUser`, data);
    }
}
