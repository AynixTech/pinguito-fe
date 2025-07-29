import { Component, OnDestroy, OnInit } from '@angular/core';
import { Campaign, CampaignService } from '../../../../services/campaign.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CompanyStoreService } from '../../../../services/company-store.service';
import { Company } from '../../../../services/company.service';
import { Subscription } from 'rxjs';
import { SocialMediaService } from '../../../../services/social-media.service';
import { AuthStoreService } from '../../../../services/auth-store.service';
import { User } from '../../../../services/user.service';
import { ExperienceService } from '../../../../services/experience.service';
import { ExperienceStateService } from '../../../../services/experience-state.service';

@Component({
  selector: 'app-list-campaigns',
  templateUrl: './list-campaigns.component.html',
  styleUrls: ['./list-campaigns.component.scss']
})
export class ListCampaignsComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];

  searchTerm: string = '';
  filterStatus: string = '';

  sortColumn: keyof Campaign = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  statuses: string[] = ['active', 'planned', 'inactive', 'completed', 'cancelled'];

  expandedCampaigns = new Set<string>();

  currentCompany: Company | null = null;
  currentUser: User | null = null;
  private companySubscription?: Subscription;


  constructor(
    private campaignService: CampaignService,
    private companyStoreService: CompanyStoreService,
    private socialMediaService: SocialMediaService,
    private experienceService: ExperienceService,
    private experienceStateService: ExperienceStateService,
    private authStore: AuthStoreService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe((user: any) => {
      this.currentUser = user;
    });

    this.companySubscription = this.companyStoreService.company$.subscribe(companyStore => {
      this.currentCompany = companyStore.company || null;
      this.loadCampaigns();
    });
  }
  ngOnDestroy(): void {
    this.companySubscription?.unsubscribe();
  }

  loadCampaigns() {
    const companyUuid = this.currentCompany?.uuid;

    this.campaignService.getAllCampaigns(companyUuid).subscribe({
      next: (data: Campaign[]) => {
        this.campaigns = data;
        this.applyFiltersAndSort();
      },
      error: () => {
        this.toast.error('Errore durante il caricamento delle campagne', 'Errore');
      }
    });
  }

  applyFiltersAndSort() {
    let temp = this.campaigns.filter(c =>
      !this.searchTerm ||
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );

    if (this.filterStatus) {
      temp = temp.filter(c => c.status === this.filterStatus);
    }

    temp.sort((a, b) => {
      let valA = a[this.sortColumn] || '';
      let valB = b[this.sortColumn] || '';
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();
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

  publishFacebookPost(post: any) {
    // Logica per pubblicare il post
    console.log('Pubblicazione post:', post);
    // Qui puoi chiamare un servizio per pubblicare il post
    this.toast.success('Post pubblicato con successo', 'Successo');
    this.socialMediaService.publishFacebookPost(post.uuid).subscribe({
      next: () => {
        this.toast.success('Post pubblicato con successo', 'Successo');
        this.callGiveExperience('publish_post');
      },
      error: () => {
        this.toast.error('Errore durante la pubblicazione del post', 'Errore');
      }
    });
  }

  callGiveExperience(action: string): void {
    if (this.currentUser) {
      this.experienceService.giveExperience(this.currentUser?.uuid, action).subscribe({
        next: (res) => {
          this.experienceStateService.setExperience(res);
        },
        error: (err) => {
          this.toast.error('Errore durante l\'aggiunta dell\'esperienza:', 'Errore');
        }
      });
    }
  }

  editCampaign(campaign: Campaign) {
    this.router.navigate(['/dashboard/campaigns/edit', campaign.uuid]);
  }

  viewDetails(campaign: Campaign) {
    this.router.navigate(['/dashboard/campaigns/view', campaign.uuid]);
  }

  deleteCampaign(uuid: string) {
    this.campaignService.deleteCampaign(uuid).subscribe({
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
