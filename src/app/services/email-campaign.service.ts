import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmailTemplate {
  uuid?: string;
  companyUuid?: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmailCampaign {
  uuid?: string;
  companyUuid?: string;
  name: string;
  subject: string;
  templateUuid?: string;
  htmlContent?: string;
  recipientCount?: number;
  sentCount?: number;
  openedCount?: number;
  clickedCount?: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  filters?: {
    subscribed?: boolean;
    tags?: string[];
    city?: string;
    country?: string;
    interests?: string;
  };
  selectedContactUuids?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EmailCampaignService {
  private apiUrl = `${environment.apiUrl}/email-campaigns`;
  private templatesUrl = `${environment.apiUrl}/email-templates`;

  constructor(private http: HttpClient) {}

  // Email Campaigns
  getAllCampaigns(): Observable<EmailCampaign[]> {
    return this.http.get<EmailCampaign[]>(this.apiUrl);
  }

  getCampaignByUuid(uuid: string): Observable<EmailCampaign> {
    return this.http.get<EmailCampaign>(`${this.apiUrl}/${uuid}`);
  }

  createCampaign(campaign: EmailCampaign): Observable<EmailCampaign> {
    return this.http.post<EmailCampaign>(this.apiUrl, campaign);
  }

  updateCampaign(uuid: string, campaign: Partial<EmailCampaign>): Observable<EmailCampaign> {
    return this.http.put<EmailCampaign>(`${this.apiUrl}/${uuid}`, campaign);
  }

  deleteCampaign(uuid: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${uuid}`);
  }

  sendCampaign(uuid: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${uuid}/send`, {});
  }

  testCampaign(uuid: string, testEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${uuid}/test`, { testEmail });
  }

  getCampaignLogs(uuid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${uuid}/logs`);
  }

  // Email Templates
  getAllTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(this.templatesUrl);
  }

  getTemplateByUuid(uuid: string): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`${this.templatesUrl}/${uuid}`);
  }

  createTemplate(template: EmailTemplate): Observable<EmailTemplate> {
    return this.http.post<EmailTemplate>(this.templatesUrl, template);
  }

  updateTemplate(uuid: string, template: Partial<EmailTemplate>): Observable<EmailTemplate> {
    return this.http.put<EmailTemplate>(`${this.templatesUrl}/${uuid}`, template);
  }

  deleteTemplate(uuid: string): Observable<any> {
    return this.http.delete(`${this.templatesUrl}/${uuid}`);
  }

  previewTemplate(templateUuid: string, variables: any): Observable<{ preview: string }> {
    return this.http.post<{ preview: string }>(`${this.templatesUrl}/${templateUuid}/preview`, { variables });
  }
}
