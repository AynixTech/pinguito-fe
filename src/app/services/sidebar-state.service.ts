// sidebar-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarStateService {
    private sidebarOpen = new BehaviorSubject<boolean>(true);
    sidebarOpen$ = this.sidebarOpen.asObservable();

    toggleSidebar() {
        this.sidebarOpen.next(!this.sidebarOpen.value);
    }

    openSidebar() {
        this.sidebarOpen.next(true);
    }

    closeSidebar() {
        this.sidebarOpen.next(false);
    }

    isSidebarOpen(): boolean {
        return this.sidebarOpen.value;
    }
}
