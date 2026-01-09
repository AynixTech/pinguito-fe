import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailCampaignService, EmailCampaign } from '../../../../services/email-campaign.service';
import { CompanyStoreService } from '../../../../services/company-store.service';

@Component({
  selector: 'app-list-email-campaigns',
  templateUrl: './list-email-campaigns.component.html',
  styleUrls: ['./list-email-campaigns.component.scss']
})
export class ListEmailCampaignsComponent implements OnInit {
  campaigns: EmailCampaign[] = [];
  filteredCampaigns: EmailCampaign[] = [];
  searchTerm = '';
  statusFilter = '';
  companyUuid: string | null = null;

  constructor(
    private emailCampaignService: EmailCampaignService,
    private router: Router,
    private companyStore: CompanyStoreService
  ) {}

  ngOnInit(): void {
    this.companyStore.companyData$.subscribe(company => {
      if (company) {
        this.companyUuid = company.uuid;
        this.loadCampaigns();
      }
    });
  }

  loadCampaigns(): void {
    if (!this.companyUuid) return;

    this.emailCampaignService.getAllCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns.filter(c => c.companyUuid === this.companyUuid);
        this.filteredCampaigns = this.campaigns;
      },
      error: (err) => console.error('Error loading campaigns:', err)
    });
  }

  filterCampaigns(): void {
    this.filteredCampaigns = this.campaigns.filter(campaign => {
      const matchesSearch = !this.searchTerm || 
        campaign.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || campaign.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  deleteCampaign(uuid: string): void {
    if (!confirm('Sei sicuro di voler eliminare questa campagna?')) {
      return;
    }

    this.emailCampaignService.deleteCampaign(uuid).subscribe({
      next: () => {
        this.loadCampaigns();
      },
      error: (err) => console.error('Error deleting campaign:', err)
    });
  }

  sendCampaign(uuid: string): void {
    if (!confirm('Sei sicuro di voler inviare questa campagna?')) {
      return;
    }

    this.emailCampaignService.sendCampaign(uuid).subscribe({
      next: () => {
        alert('Campagna inviata con successo!');
        this.loadCampaigns();
      },
      error: (err) => {
        console.error('Error sending campaign:', err);
        alert('Errore nell\'invio della campagna');
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      draft: 'status-draft',
      scheduled: 'status-scheduled',
      sending: 'status-sending',
      sent: 'status-sent',
      failed: 'status-failed'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      draft: 'Bozza',
      scheduled: 'Programmata',
      sending: 'In invio',
      sent: 'Inviata',
      failed: 'Fallita'
    };
    return labels[status] || status;
  }
}
