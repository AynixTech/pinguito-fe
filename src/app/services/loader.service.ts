import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
    private _isLoading = new BehaviorSubject<boolean>(false);
    isLoading$ = this._isLoading.asObservable();

    private timeoutSub?: Subscription;
    private startTime: number = 0;
    private readonly minVisibleDuration = 500; // 500 ms

    startLoader(maxDurationMs: number = 10000): void {
        this.startTime = Date.now();
        this._isLoading.next(true);

        // Chiusura forzata dopo maxDurationMs
        this.timeoutSub?.unsubscribe();
        this.timeoutSub = timer(maxDurationMs).subscribe(() => {
            this._isLoading.next(false);
        });
    }

    stopLoader(): void {
        const elapsed = Date.now() - this.startTime;

        if (elapsed < this.minVisibleDuration) {
            const delay = this.minVisibleDuration - elapsed;
            // Attendi il tempo mancante per raggiungere almeno 1s
            timer(delay).subscribe(() => {
                this._isLoading.next(false);
            });
        } else {
            this._isLoading.next(false);
        }

        this.timeoutSub?.unsubscribe();
    }
}
