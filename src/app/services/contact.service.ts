import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Contact {
  uuid?: string;
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  city: string;
  country: string;
  address?: string;
  zipCode?: string;
  company?: string;
  jobTitle?: string;
  dateOfBirth?: string;
  gender?: string;
  interests?: string;
  notes?: string;
  subscribed: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = environment.apiUrl + '/contacts';

  constructor(private http: HttpClient) { }

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  getContactByUuid(uuid: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${uuid}`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  updateContact(uuid: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${uuid}`, contact);
  }

  deleteContact(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }

  importContacts(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/import`, formData);
  }

  exportContacts(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export`, { responseType: 'blob' });
  }
}
