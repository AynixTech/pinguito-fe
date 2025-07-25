import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';
import { User } from './user.service';


export interface AuthState {
    user: User | null;
    token: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthStoreService {
    private initialState: AuthState = {
        user: null,
        token: null,
    };

    private authSubject = new BehaviorSubject<AuthState>(this.initialState);
    auth$ = this.authSubject.asObservable();

    // AGGIUNGI QUESTA RIGA:
    user$ = this.auth$.pipe(map(state => state.user));

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.loadFromLocalStorage();
    }

    private loadFromLocalStorage() {
        if (!this.isBrowser) return;

        const userJson = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userJson && token) {
            this.authSubject.next({
                user: JSON.parse(userJson),
                token,
            });
        }
    }

    setAuth(user: any, token: string) {
        if (this.isBrowser) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        }

        this.authSubject.next({ user, token });
    }
    setUser(user: any | null) {
        if (this.isBrowser) {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        }
        this.authSubject.next({
            ...this.authSubject.value,
            user,
        });
    }

    logout() {
        if (this.isBrowser) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }

        this.authSubject.next({ user: null, token: null });
    }

    get currentUser() {
        return this.authSubject.value.user;
    }

    get currentToken() {
        return this.authSubject.value.token;
    }
}
