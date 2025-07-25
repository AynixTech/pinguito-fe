import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CampaignService, Campaign } from '../../../services/campaign.service';
import { AuthStoreService } from '../../../services/auth-store.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyStoreService } from '../../../services/company-store.service';
import { Company } from '../../../services/company.service';

@Component({
  selector: 'app-my-campaigns',
  templateUrl: './my-campaigns.component.html',
  styleUrls: ['./my-campaigns.component.scss']
})
export class MyCampaignsComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];

  currentUserUuid?: string;
  searchTerm = '';
  filterStatus = '';
  statuses: string[] = ['planned', 'active', 'inactive', 'completed', 'cancelled'];

  sortColumn: keyof Campaign = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  expandedCampaigns = new Set<string>();

  private subscription?: Subscription;
  currentCompany: Company | null = null;

  constructor(
    private campaignService: CampaignService,
    private authStore: AuthStoreService,
    private toast: ToastrService,
    private companyStoreService: CompanyStoreService
  ) { }

  ngOnInit() {
    this.subscription = this.authStore.user$.subscribe(user => {
      if (user?.uuid) {
        this.currentUserUuid = user.uuid;
        this.loadCampaigns(); // Prima chiamata
      }
    });

    this.companyStoreService.company$.subscribe(companyStore => {
      this.currentCompany = companyStore.company || null;
      this.loadCampaigns(); // Ricarica campagne al cambio azienda
    });
  }
  

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadCampaigns() {
    if (!this.currentUserUuid) return;

    const companyUuid = this.currentCompany?.uuid;

    this.campaignService
      .getCampaignsByUserUuid(this.currentUserUuid, companyUuid)
      .subscribe(data => {
        this.campaigns = data;
        this.applyFiltersAndSort();
      });
  }
  
  applyFiltersAndSort() {
    let temp = this.campaigns.filter(c =>
    (!this.searchTerm ||
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    )
    );

    if (this.filterStatus) {
      temp = temp.filter(c => c.status === this.filterStatus);
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

    this.filteredCampaigns = temp;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredCampaigns.length / this.pageSize);
  }

  onSearchChange() {
    this.applyFiltersAndSort();
  }

  onFilterStatusChange() {
    this.applyFiltersAndSort();
  }

  toggleSort(column: keyof Campaign) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  get paginatedCampaigns(): Campaign[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCampaigns.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  toggleExpanded(uuid: string): void {
    if (this.expandedCampaigns.has(uuid)) {
      this.expandedCampaigns.delete(uuid);
    } else {
      this.expandedCampaigns.add(uuid);
    }
  }

  isExpanded(uuid: string): boolean {
    return this.expandedCampaigns.has(uuid);
  }

  editCampaign(campaign: Campaign) {
    console.log('Modifica:', campaign);
    // this.router.navigate(['/campaigns/edit', campaign.uuid]);
  }

  viewDetails(campaign: Campaign) {
    console.log('Dettagli:', campaign);
    // this.router.navigate(['/campaigns/details', campaign.uuid]);
  }

  deleteCampaign(campaign: Campaign) {
    this.campaignService.deleteCampaign(campaign.uuid).subscribe({
      next: () => {
        this.loadCampaigns();
        this.toast.success('Campagna eliminata con successo', 'Successo');
      },
      error: () => {
        this.toast.error('Errore durante l\'eliminazione della campagna', 'Errore');
      }
    });
  }
}
