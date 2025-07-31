import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Log {
    id?: number;
    userUuid: string;
    action: string;
    details?: string;
    timestamp?: string;
    user?: {
        uuid: string;
        name: string;
        surname: string;
        email: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private baseUrl = environment.apiUrl + '/logs';

    constructor(private http: HttpClient) { }

    /** Recupera tutti i log (admin) */
    getAllLogs(): Observable<Log[]> {
        return this.http.get<Log[]>(`${this.baseUrl}/getAllLogs`);
    }

    /** Registra un'azione utente */
    createLogAction(log: { userUuid: string; action: string; details?: string }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/createLogAction`, log);
    }
}
