import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Plan {
    id: number;
    name: string;
    monthlyEmailLimit: number;
    price: number;
    description?: string;
    maxUsers: number;
    supportLevel?: string;
    storageLimitMB?: number;
    socialMediaAccountsLimit?: number;
    googleAdsBudgetLimit?: number;
    googleAdsCampaignLimit?: number;
    features?: string;
    active: boolean;
    billingCycle: string;
    trialDays: number;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlanService {
    private baseUrl = environment.apiUrl + '/plans';

    constructor(private http: HttpClient) { }

    // Admin: recupera tutti i piani
    getAllPlans(): Observable<Plan[]> {
        return this.http.get<Plan[]>(`${this.baseUrl}/allPlans`);
    }

    // Admin: recupera un piano specifico
    getPlanById(id: number): Observable<Plan> {
        return this.http.get<Plan>(`${this.baseUrl}/${id}`);
    }

    // Admin: crea o aggiorna un piano
    savePlan(plan: Plan): Observable<Plan> {
        if (plan.id) {
            return this.http.put<Plan>(`${this.baseUrl}/${plan.id}`, plan);
        } else {
            return this.http.post<Plan>(`${this.baseUrl}/create`, plan);
        }
    }

    // Admin: elimina un piano
    deletePlan(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}/delete`);
    }
}
