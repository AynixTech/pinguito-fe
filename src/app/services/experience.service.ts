import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExperienceResponse {
    xpGained: number;
    newLevel: number;
    totalXp: number;
    message?: string;
    levelUp?: boolean;
    nextLevelXp: number;
}

@Injectable({
    providedIn: 'root'
})
export class ExperienceService {
    private baseUrl = environment.apiUrl + '/experience';

    constructor(private http: HttpClient) { }

    /**
     * Aggiunge esperienza all'utente in base all'azione.
     * @param userUuid UUID dell'utente a cui assegnare esperienza
     * @param action Tipo di azione (es: "create_campaign", "publish_post")
     */
    giveExperience(userUuid: string, action: string): Observable<ExperienceResponse> {
        return this.http.post<ExperienceResponse>(`${this.baseUrl}/give`, {
            userUuid,
            action
        });
    }
    getExperienceByUserUuid(userUuid: string): Observable<ExperienceResponse> {
        return this.http.get<ExperienceResponse>(`${this.baseUrl}/${userUuid}/get`);
    }
}
