import { Component, OnInit, OnDestroy } from '@angular/core';
import { Company, CompanyService } from '../../../services/company.service';
import { AuthStoreService } from '../../../services/auth-store.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Plan, PlanService } from '../../../services/plan.service';



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

  plans: Plan[] = [];

  constructor(
    private companyService: CompanyService,
    private authStore: AuthStoreService,
    private planService: PlanService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.subscription = this.authStore.user$.subscribe(user => {
      if (user?.uuid) {
        this.currentUserUuid = user.uuid;
        this.loadCompanies();
        this.loadPlans();
      }
    });
  }

  getPlanById(planId: number): Plan | undefined {
      return this.plans.find(plan => plan.id === planId);
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

  loadPlans() {
    this.planService.getAllPlans().subscribe(plans => {
      this.plans = plans;
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

  editCompany(company: Company) {
    // Logica per modificare l'azienda (ad esempio, navigare a una pagina di modifica)
    console.log('Modifica:', company);
    // Esempio: this.router.navigate(['/companies/edit', company.uuid]);
  }

  viewDetails(company: Company) {
    // Logica per mostrare i dettagli dell'azienda (ad esempio, aprire un modal o navigare)
    console.log('Vedi dettagli:', company);
    // Esempio: this.router.navigate(['/companies/details', company.uuid]);
  }

  deleteCompany(company: Company) {
    // Logica per eliminare l'azienda (puoi confermare con un alert prima)
    console.log('Elimina:', company);
    // Esempio:
    this.companyService.deleteCompany(company.uuid).subscribe({
      next: () => {
        this.loadCompanies();
        // Mostra un toast di successo
        // Sostituisci con il tuo servizio di toast, ad esempio ToastrService
        // this.toastr.success('Azienda eliminata con successo');
        this.toast.success('Azienda eliminata con successo', 'Successo');
      },
      error: () => {
        // Mostra un toast di errore
        // this.toastr.error('Errore durante l\'eliminazione dell\'azienda');
        this.toast.error('Errore durante l\'eliminazione dell\'azienda', 'Errore');
      }
    });

  }
}
