import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExperienceResponse } from './experience.service';

const LOCAL_STORAGE_KEY = 'experience_data';

@Injectable({
    providedIn: 'root'
})
export class ExperienceStateService {
    private xpSubject = new BehaviorSubject<ExperienceResponse | null>(this.loadFromLocalStorage());

    get experience$(): Observable<ExperienceResponse | null> {
        return this.xpSubject.asObservable();
    }

    setExperience(response: ExperienceResponse): void {
        this.xpSubject.next(response);
        this.saveToLocalStorage(response);
    }

    clearExperience(): void {
        this.xpSubject.next(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    private saveToLocalStorage(data: ExperienceResponse): void {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving experience to localStorage', e);
        }
    }

    private loadFromLocalStorage(): ExperienceResponse | null {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading experience from localStorage', e);
            return null;
        }
    }
}
