import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyService } from '../../../services/company.service';
import { AuthStoreService } from '../../../services/auth-store.service';
import { Subscription } from 'rxjs';

interface Company {
  uuid: string;
  name: string;
  industry?: string;
  customerSegment?: string;
  vatNumber?: string;
  legalAddress?: string;
  // aggiungi altri campi se vuoi
}

@Component({
  selector: 'app-my-companies',
  templateUrl: './my-companies.component.html',
  styleUrls: ['./my-companies.component.scss']
})
export class MyCompaniesComponent implements OnInit, OnDestroy {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  currentUserUuid?: string;

  searchTerm: string = '';
  filterIndustry: string = '';
  filterCustomerSegment: string = '';

  sortColumn: keyof Company = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  private subscription?: Subscription;

  industries: string[] = [];
  customerSegments: string[] = [];

  constructor(
    private companyService: CompanyService,
    private authStore: AuthStoreService
  ) { }

  ngOnInit() {
    this.subscription = this.authStore.user$.subscribe(user => {
      if (user?.uuid) {
        this.currentUserUuid = user.uuid;
        this.loadCompanies();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadCompanies() {
    if (!this.currentUserUuid) return;
    this.companyService.getCompaniesByUserUuid(this.currentUserUuid).subscribe(data => {
      this.companies = data;
      this.extractFilters();
      this.applyFiltersAndSort();
    });
  }

  extractFilters() {
    this.industries = Array.from(new Set(this.companies.map(c => c.industry).filter(Boolean))) as string[];
    this.customerSegments = Array.from(new Set(this.companies.map(c => c.customerSegment).filter(Boolean))) as string[];
  }

  applyFiltersAndSort() {
    let temp = this.companies.filter(c =>
    (!this.searchTerm ||
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (c.vatNumber && c.vatNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (c.legalAddress && c.legalAddress.toLowerCase().includes(this.searchTerm.toLowerCase()))
    )
    );

    if (this.filterIndustry) {
      temp = temp.filter(c => c.industry === this.filterIndustry);
    }

    if (this.filterCustomerSegment) {
      temp = temp.filter(c => c.customerSegment === this.filterCustomerSegment);
    }

    temp.sort((a, b) => {
      let valA = a[this.sortColumn] || '';
      let valB = b[this.sortColumn] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredCompanies = temp;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredCompanies.length / this.pageSize);
  }

  onSearchChange() {
    this.applyFiltersAndSort();
  }

  onFilterIndustryChange() {
    this.applyFiltersAndSort();
  }

  onFilterCustomerSegmentChange() {
    this.applyFiltersAndSort();
  }

  toggleSort(column: keyof Company) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  get paginatedCompanies(): Company[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCompanies.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
}
