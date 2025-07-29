import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface SocialMedia {
    uuid: string;
    companyUuid: string;
    metaShortToken?: string;
    metaAccessToken?: string;
    metaAppId?: string;
    metaAppSecret?: string;
    metaSyncResponse?: string;
    metaPagesResponse?: string;
    metaPageId?: string;
    metaPageAccessToken?: string; // New field to store the page access token
    metaPageName?: string; // Optional field to store the page name
}
@Injectable({
    providedIn: 'root'
})

export class SocialMediaService {
    private baseUrl = environment.apiUrl + '/social-media';

    constructor(private http: HttpClient) { }

    savePageData(data: any): Observable<any> {
        const url = `${this.baseUrl}/meta/save-page-data`;
        return this.http.post(url, data);
    }

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

    publishFacebookPost(uuid: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/facebook/${uuid}/publish`, {});
    }
}
