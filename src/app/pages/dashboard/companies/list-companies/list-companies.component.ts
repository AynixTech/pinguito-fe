import { Component, OnInit } from '@angular/core';
import { Company, CompanyService } from '../../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Plan, PlanService } from '../../../../services/plan.service';
import { AuthStoreService } from '../../../../services/auth-store.service';
import { ConfirmationService } from '../../../../services/confirmation.service';


@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrl: './list-companies.component.scss'
})
export class ListCompaniesComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];

  searchTerm: string = '';
  filterIndustry: string = '';
  filterCustomerSegment: string = '';

  sortColumn: keyof Company = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  industries: string[] = [];
  customerSegments: string[] = [];

  isAdmin: boolean = false;

  constructor(
    private companyService: CompanyService,
    private authStore: AuthStoreService,
    private confirmationDialogService: ConfirmationService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe((user: any) => {
      this.isAdmin = user?.role?.name === 'admin'; // Imposta isAdmin se il ruolo è admin
    });
    
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe({
      next: data => {
        this.companies = data;
        this.extractFilters();
        this.applyFiltersAndSort();
      },
      error: () => {
        this.toast.error('Errore durante il caricamento delle aziende', 'Errore');
      }
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

  detailCompany(company: Company) {
    if(!company || !company.uuid) {
      this.toast.error('Azienda non valida', 'Errore');
      return;
    }
    this.router.navigate(['/companies/detail-company', company.uuid]);
  }


  deleteCompany(company: Company) {
    this.confirmationDialogService.open({
      title: 'Eliminare ' + company.name + '?',
      message: 'Vuoi davvero eliminarlo?',
      confirmText: 'Sì',
      type: 'warning',
      cancelText: 'Annulla'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.companyService.deleteCompany(company.uuid).subscribe({
          next: () => {
            this.loadCompanies();
            this.toast.success('Azienda eliminata con successo', 'Successo');
          },
          error: () => {
            this.toast.error('Errore durante l\'eliminazione dell\'azienda', 'Errore');
          }
        });
      }
    });
  }
}