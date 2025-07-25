import { Component, HostListener, OnInit } from "@angular/core";
import { AuthStoreService } from "../../../../services/auth-store.service";
import { Router } from "@angular/router";
import { User } from "../../../../services/user.service";
import { CompanyStoreService } from "../../../../services/company-store.service";
import { Company, CompanyService } from "../../../../services/company.service";

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
  userCompanies: Company[] = [];
  currentUserUuid: string | null = null;
  companies: Company[] = [];

  constructor(private authStore: AuthStoreService, private companyService: CompanyService, private companyStore: CompanyStoreService, private router: Router) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe((user: any) => {
      this.currentUser = user;
      this.currentUserUuid = user.uuid;
      this.userName = this.currentUser?.name || '';
      this.userFullName = this.currentUser?.name + " " + this.currentUser?.surname || '';
      this.userEmail = this.currentUser?.email || '';
      console.log('Current User:', this.currentUser);
      this.loadCompanies();
    });

    this.companyStore.company$.subscribe(storeState => {
      this.currentCompany = storeState.company || null;
    });
  }
  

  loadCompanies() {
    if (!this.currentUserUuid) return;
    this.companyService.getCompaniesByUserUuid(this.currentUserUuid).subscribe(data => {
      this.companies = data;

      // Sincronizza currentCompany con la lista, se esiste nello store
      const storedCompany = this.companyStore.currentCompany;

      if (storedCompany) {
        const matched = this.companies.find(c => c.uuid === storedCompany.uuid);
        if (matched) {
          this.currentCompany = matched; // imposta il riferimento corretto
        }
      }
    });
  }
  
  trackByCompanyUuid(index: number, company: Company): string {
    return company.uuid;
  }
  


  onCompanyChange() {
    if (this.currentCompany) {
      this.companyStore.setCompany(this.currentCompany);
      console.log('Company changed to:', this.currentCompany);
    } else {
      // Caso "Tutte" selezionato
      this.companyStore.clearCompany();  // o altra logica per "tutte"
      console.log('Company changed to: tutte');
    }
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
    this.authStore.clearUser(); 
    this.companyStore.clearCompany();
    this.router.navigate(['/login']);
  }
}
