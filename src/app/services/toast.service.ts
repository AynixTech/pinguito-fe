// toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastMessage {
    text: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    private toastSubject = new Subject<ToastMessage>();
    toastState$ = this.toastSubject.asObservable();

    showToast(message: string, type: ToastType = 'success') {
        this.toastSubject.next({ text: message, type });
    }
}
