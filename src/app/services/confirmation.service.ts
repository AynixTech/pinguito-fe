import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ConfirmationDialogOptions } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    private dialogEvents = new Subject<{
        options: ConfirmationDialogOptions;
        response: Subject<boolean>;
    }>();

    onDialog(): Observable<{
        options: ConfirmationDialogOptions;
        response: Subject<boolean>;
    }> {
        return this.dialogEvents.asObservable();
    }

    open(options: ConfirmationDialogOptions): Observable<boolean> {
        const response = new Subject<boolean>();
        this.dialogEvents.next({ options, response });
        return response.asObservable();
    }
}
