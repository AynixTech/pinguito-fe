import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Company } from './company.service';


export interface FacebookPost {
    uuid: string;
    postId?: string;
    campaignUuid: string;
    message?: string;
    mediaUrl?: string;
    scheduledAt?: Date;
    publishedAt?: Date;
    status?: 'planned' | 'published' | 'cancelled' | 'archived' | 'scheduled';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InstagramPost {
    uuid: string;
    postId?: string;
    campaignUuid: string;
    caption?: string;
    mediaUrl?: string;
    scheduledAt?: Date;
    publishedAt?: Date;
    status?: 'planned' | 'published' | 'cancelled' | 'archived' | 'scheduled';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TikTokVideo {
    uuid: string;
    videoId?: string;
    campaignUuid: string;
    description?: string;
    videoUrl?: string;
    scheduledAt?: Date;
    publishedAt?: Date;
    status?: 'planned' | 'published' | 'cancelled' | 'archived' | 'scheduled';
    createdAt?: Date;
    updatedAt?: Date;
}


export interface Campaign {
    uuid?: string;
    companyUuid: string;
    name: string;
    description?: string;
    startDate?: Date | null;  // <-- aggiungi null qui
    endDate?: Date | null;
    channels?: string;
    budget?: number;
    status?: 'active' | 'planned' | 'inactive' | 'completed' | 'cancelled';
    company?: Company;
    instagramPosts?: InstagramPost[];
    facebookPosts?: FacebookPost[];
    tiktokVideos?: TikTokVideo[];
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CreateCampaignRequest extends Campaign {
    aiGeneratedContentEmail?: string;
    aiGeneratedContentFacebook?: string;
    aiGeneratedContentInstagram?: string;
    aiSummaryEmail?: string;
    aiSummaryFacebook?: string;
    aiSummaryInstagram?: string;
    aiKeywordsEmail?: string;
    aiKeywordsFacebook?: string;
    aiKeywordsInstagram?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CampaignService {
    private baseUrl = environment.apiUrl + '/campaigns';

    constructor(private http: HttpClient) { }

    // Recupera tutte le campagne (admin)
    getAllCampaigns(companyUuid?: string): Observable<Campaign[]> {
        let url = `${this.baseUrl}/allCampaigns`;
        if (companyUuid) {
            url += `?companyUuid=${companyUuid}`;
        }
        return this.http.get<Campaign[]>(url);
    }


    // Recupera una campagna specifica
    getCampaignByUuid(uuid: string): Observable<Campaign> {
        return this.http.get<Campaign>(`${this.baseUrl}/${uuid}/getCampaign`);
    }

    // Crea una nuova campagna
    createCampaign(campaign: CreateCampaignRequest): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/createCampaign`, campaign);
    }

    // Aggiorna una campagna esistente
    updateCampaign(campaign: Campaign): Observable<Campaign> {
        return this.http.put<Campaign>(`${this.baseUrl}/${campaign.uuid}/updateCampaign`, campaign);
    }

    // Elimina una campagna
    deleteCampaign(campaignUuid: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${campaignUuid}/delete`);
    }

    // (Opzionale) Recupera campagne di una company specifica
    getCampaignsByCompanyUuid(companyUuid: string): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(`${this.baseUrl}/company/${companyUuid}`);
    }

    // Recupera campagne associate a un utente, opzionalmente filtrate per companyUuid
    getCampaignsByUserUuid(userUuid: string, companyUuid?: string): Observable<Campaign[]> {
        let url = `${this.baseUrl}/by-user/${userUuid}`;
        if (companyUuid) {
            url += `?companyUuid=${companyUuid}`;
        }
        return this.http.get<Campaign[]>(url);
    }



}
