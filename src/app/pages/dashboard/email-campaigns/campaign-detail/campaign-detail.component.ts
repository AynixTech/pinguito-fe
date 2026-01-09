import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailCampaignService, EmailCampaign } from '../../../../services/email-campaign.service';

interface EmailSendLog {
  uuid: string;
  email: string;
  contactName: string;
  status: 'sent' | 'failed' | 'opened' | 'clicked';
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  errorMessage?: string;
}

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit {
  campaign: EmailCampaign | null = null;
  emailLogs: EmailSendLog[] = [];
  loading = true;
  searchTerm = '';
  filteredLogs: EmailSendLog[] = [];
  statusFilter = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailCampaignService: EmailCampaignService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadCampaignDetails(uuid);
    }
  }

  loadCampaignDetails(uuid: string): void {
    this.loading = true;
    this.emailCampaignService.getCampaignByUuid(uuid).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        this.loadEmailLogs(uuid);
      },
      error: (err) => {
        console.error('Error loading campaign:', err);
        this.loading = false;
      }
    });
  }

  loadEmailLogs(campaignUuid: string): void {
    this.emailCampaignService.getCampaignLogs(campaignUuid).subscribe({
      next: (logs) => {
        this.emailLogs = logs;
        this.filteredLogs = logs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading email logs:', err);
        this.loading = false;
      }
    });
  }

  filterLogs(): void {
    this.filteredLogs = this.emailLogs.filter(log => {
      const matchesSearch = !this.searchTerm || 
        log.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.contactName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || log.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      sent: 'status-sent',
      failed: 'status-failed',
      opened: 'status-opened',
      clicked: 'status-clicked'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      sent: 'Inviata',
      failed: 'Fallita',
      opened: 'Aperta',
      clicked: 'Click'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      sent: 'fa-check-circle',
      failed: 'fa-times-circle',
      opened: 'fa-envelope-open',
      clicked: 'fa-mouse-pointer'
    };
    return icons[status] || 'fa-circle';
  }

  goBack(): void {
    this.router.navigate(['/dashboard/email-campaigns/list']);
  }

  getOpenRate(): number {
    if (!this.campaign?.sentCount || this.campaign.sentCount === 0) return 0;
    return Math.round(((this.campaign.openedCount || 0) / this.campaign.sentCount) * 100);
  }

  getClickRate(): number {
    if (!this.campaign?.sentCount || this.campaign.sentCount === 0) return 0;
    return Math.round(((this.campaign.clickedCount || 0) / this.campaign.sentCount) * 100);
  }

  getFailedCount(): number {
    if (!this.campaign) return 0;
    return (this.campaign.recipientCount || 0) - (this.campaign.sentCount || 0);
  }
}
