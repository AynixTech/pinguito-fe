import { Component, HostListener, OnInit } from "@angular/core";
import { AuthStoreService, User } from "../../../../services/auth-store.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss']
})
export class HeaderLayoutComponent implements OnInit {
  currentUser!: User | null;
  userName = '';
  userFullName = '';
  userEmail = '';

  isDropdownOpen = false;

  constructor(private authStore: AuthStoreService, private router: Router) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe((user: any) => {
      this.currentUser = user;
      this.userName = this.currentUser?.name || '';
      this.userFullName = this.currentUser?.name + " " + this.currentUser?.surname || '';
      this.userEmail = this.currentUser?.email || '';
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleSidebar() {
    // Implement sidebar toggle logic here
    console.log('Sidebar toggled');
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    this.authStore.logout(); // Assumendo che logout sia definito nel servizio
    this.router.navigate(['/login']);

  }
}
