import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocialMediaCredentialsService {
    private baseUrl = environment.apiUrl + '/social-media';

    constructor(private http: HttpClient) { }

    syncMetaToken(data: any): Observable<any> {
        const url = `${this.baseUrl}/meta/sync-meta-token`;
        return this.http.post(url, data);
    }

    syncPlatform(platform: 'meta' | 'tiktok', data: any): Observable<any> {
        const url = `${this.baseUrl}/${platform}/check-sync`;
        return this.http.post(url, data);
    }

    getSocialMediaCredentialsByCompanyUuid(companyUuid: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/credentials/${companyUuid}`);
    }
}
