import { Component, HostListener, OnInit } from "@angular/core";
import { AuthStoreService } from "../../../../services/auth-store.service";
import { Router } from "@angular/router";
import { User } from "../../../../services/user.service";
import { CompanyStoreService } from "../../../../services/company-store.service";
import { Company } from "../../../../services/company.service";

@Component({
  selector: 'app-header',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss']
})
export class HeaderLayoutComponent implements OnInit {
  currentUser!: User | null;
  currentCompany!: Company | null;
  userName = '';
  userFullName = '';
  userEmail = '';

  isDropdownOpen = false;

  constructor(private authStore: AuthStoreService, private companyStore: CompanyStoreService, private router: Router) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe((user: any) => {
      this.currentUser = user;
      this.userName = this.currentUser?.name || '';
      this.userFullName = this.currentUser?.name + " " + this.currentUser?.surname || '';
      this.userEmail = this.currentUser?.email || '';
    });
    this.companyStore.company$.subscribe(companyStore => {
      this.currentCompany = companyStore.company || null;
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleSidebar() {
    // Implement sidebar toggle logic here
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
