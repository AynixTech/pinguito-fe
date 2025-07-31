import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

import { ROUTES } from 'app/utils/constants';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
            return this.router.parseUrl(ROUTES.LOGIN);
        }

        const user = JSON.parse(userString);
        const userRole = user?.role?.name;


        const rolesAllowed = route.data['roles'] as Array<string>;
        if (!rolesAllowed || rolesAllowed.length === 0) {
            return true;
        }

        if (userRole && rolesAllowed.includes(userRole)) {
            return true;
        }

        return this.router.parseUrl(ROUTES.ACCESS_DENIED);
    }
    
}
