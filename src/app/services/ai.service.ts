import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private baseUrl = environment.apiUrl + '/ai';

    constructor(private http: HttpClient) { }

    generateAiCampaignContent(prompt: string): Observable<{ aiGeneratedContent: string, aiSummary: string, aiKeywords: string }> {
        if (!prompt?.trim()) {
            throw new Error('Prompt cannot be empty');
        }
        return this.http.post<{ aiGeneratedContent: string, aiSummary: string, aiKeywords: string }>(
            `${this.baseUrl}/generate-ai-campaign`,
            { prompt }
        );
    }

    // Opzionale: se vuoi anche generare immagine
    generateImage(prompt: string): Observable<{ imageUrl: string }> {
        return this.http.post<{ imageUrl: string }>(
            `${this.baseUrl}/generate-image`,
            { prompt }
        );
    }
}
