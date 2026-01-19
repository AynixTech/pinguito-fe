import { Component, OnInit } from '@angular/core';
import { CompanyStoreService } from '@services/company-store.service';
import { Company } from '@services/company.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  userName = 'George';
  activeTab: 'emails' | 'socials' = 'socials';
  company: Company | null = null;

  // Filtros para emails
  selectedCity: string = '';
  selectedStatus: string = '';
  availableCities: string[] = [];
  availableStatuses: string[] = ['Inviata', 'Programmata', 'Bozza'];

  // Filtros para socials
  selectedPlatform: string = '';
  selectedSocialStatus: string = '';
  availablePlatforms: string[] = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn'];
  availableSocialStatuses: string[] = ['Pubblicata', 'Programmata', 'Bozza'];

  emailStats: Array<{label: string; value: string; icon: string; color: string; colorInner: string; trend?: string}> = [
    { label: 'Contatti Totali', value: '80,000', icon: 'fa-users', color: '#3B82F6', colorInner: '#60A5FA' },
    { label: 'Città Coperte', value: '150+', icon: 'fa-map-marker-alt', color: '#F59E0B', colorInner: '#FBBF24' },
    { label: 'Email Inviate', value: '5,200', icon: 'fa-paper-plane', color: '#8B5CF6', colorInner: '#A78BFA' },
    { label: 'Email Cliccate', value: '3,200', icon: 'fa-envelope-open', color: '#10B981', colorInner: '#34D399' },
    { label: 'Campagne Email Attive', value: '12', icon: 'fa-chart-line', color: '#EF4444', colorInner: '#F87171' }
  ];

  socialStats: Array<{label: string; value: string; icon: string; color: string; colorInner: string; trend?: string}> = [
    { label: 'Visualizzazioni Totali', value: '245K', icon: 'fa-eye', color: '#3B82F6', colorInner: '#60A5FA' },
    { label: 'Interazioni Post', value: '18.5K', icon: 'fa-heart', color: '#EC4899', colorInner: '#F472B6' },
    { label: 'Followers Facebook', value: '+2.5K', icon: 'fa-users', color: '#1877F2', colorInner: '#4B9FF8', trend: 'up' },
    { label: 'Followers Instagram', value: '+3.1K', icon: 'fa-camera', color: '#E4405F', colorInner: '#F56A86', trend: 'up' },
    { label: 'Followers TikTok', value: '+1.8K', icon: 'fa-music', color: '#000000', colorInner: '#333333', trend: 'up' },
    { label: 'Campagne Social Attive', value: '8', icon: 'fa-bullhorn', color: '#10B981', colorInner: '#34D399' }
  ];

  // Dati demografici Meta
  audienceData = {
    age: [
      { range: '18-24', percentage: 25 },
      { range: '25-34', percentage: 35 },
      { range: '35-44', percentage: 22 },
      { range: '45-54', percentage: 12 },
      { range: '55+', percentage: 6 }
    ],
    countries: [
      { name: 'Italia', percentage: 65 },
      { name: 'Spagna', percentage: 15 },
      { name: 'Francia', percentage: 10 },
      { name: 'Altri', percentage: 10 }
    ],
    gender: [
      { type: 'Donne', percentage: 58 },
      { type: 'Uomini', percentage: 40 },
      { type: 'Altro', percentage: 2 }
    ]
  };

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  openRateData = [250, 300, 290, 310, 290, 330, 310, 330, 320, 340, 360, 310];
  ctrData = [200, 250, 230, 240, 220, 250, 240, 260, 250, 270, 280, 260];
  bounceRateData = [300, 350, 270, 310, 280, 340, 300, 320, 310, 330, 350, 300];

  allCampaigns = [
    { email: "Scopri le nostre offerte", title: 'Promo Pasqua', city: 'Milano', date: '15/04/2025 14:30', status: 'Inviata', emailsSent: 57200, emailsOpened: 31, emailsClicked: 12, emailsNotDelivered: 2 },
    { email: "Sconto 20% su tutti i prodotti", title: 'Promo Estate', city: 'Roma', date: '10/04/2025 09:00', status: 'Inviata', emailsSent: 7200, emailsOpened: 42, emailsClicked: 18, emailsNotDelivered: 1 },
    { email: "Ultimi giorni per il Black Friday", title: 'Black Friday', city: 'Napoli', date: '05/04/2025 12:15', status: 'Programmata', emailsSent: 6800, emailsOpened: 37, emailsClicked: 15, emailsNotDelivered: 3 },
    { email: "Nuovi arrivi in negozio", title: 'Promo Primavera', city: 'Torino', date: '01/04/2025 10:45', status: 'Inviata', emailsSent: 7900, emailsOpened: 46, emailsClicked: 22, emailsNotDelivered: 1 },
    { email: "Sconto 50% su tutti i prodotti", title: 'Promo Inverno', city: 'Firenze', date: '20/04/2025 16:30', status: 'Bozza', emailsSent: 8800, emailsOpened: 53, emailsClicked: 28, emailsNotDelivered: 2 },
    { email: "Ultimi giorni per il Black Friday", title: 'Black Friday', city: 'Napoli', date: '05/04/2025 13:00', status: 'Inviata', emailsSent: 6300, emailsOpened: 34, emailsClicked: 14, emailsNotDelivered: 4 },
    { email: "Nuovi arrivi in negozio", title: 'Promo Primavera', city: 'Torino', date: '01/04/2025 11:00', status: 'Programmata', emailsSent: 8100, emailsOpened: 47, emailsClicked: 20, emailsNotDelivered: 2 },
    { email: "Sconto 50% su tutti i prodotti", title: 'Promo Inverno', city: 'Firenze', date: '20/04/2025 17:45', status: 'Inviata', emailsSent: 9000, emailsOpened: 54, emailsClicked: 30, emailsNotDelivered: 1 }
  ];

  campaigns = [...this.allCampaigns];

  allSocialCampaigns = [
    { content: "Nuova collezione primavera 2026", title: 'Lancio Prodotto', platform: 'Instagram', date: '18/01/2026 10:00', status: 'Pubblicata', impressions: 45200, likes: 3420, comments: 287, shares: 156, engagement: 8.5 },
    { content: "Black Friday - Sconti fino al 70%", title: 'Promo Black Friday', platform: 'Facebook', date: '17/01/2026 14:30', status: 'Pubblicata', impressions: 78900, likes: 5670, comments: 421, shares: 892, engagement: 9.2 },
    { content: "Tutorial makeup trend 2026", title: 'Tutorial Video', platform: 'TikTok', date: '16/01/2026 18:00', status: 'Pubblicata', impressions: 125000, likes: 12400, comments: 1560, shares: 2340, engagement: 12.8 },
    { content: "Evento networking Milano", title: 'Evento Business', platform: 'LinkedIn', date: '15/01/2026 09:00', status: 'Pubblicata', impressions: 34200, likes: 1890, comments: 234, shares: 445, engagement: 7.5 },
    { content: "Testimonianza cliente soddisfatto", title: 'Social Proof', platform: 'Instagram', date: '20/01/2026 12:00', status: 'Programmata', impressions: 0, likes: 0, comments: 0, shares: 0, engagement: 0 },
    { content: "Ricetta della settimana", title: 'Food Content', platform: 'Facebook', date: '14/01/2026 16:45', status: 'Pubblicata', impressions: 52300, likes: 4120, comments: 356, shares: 678, engagement: 9.8 },
    { content: "Behind the scenes produzione", title: 'BTS Video', platform: 'TikTok', date: '22/01/2026 15:00', status: 'Programmata', impressions: 0, likes: 0, comments: 0, shares: 0, engagement: 0 },
    { content: "Case study successo cliente", title: 'Case Study', platform: 'LinkedIn', date: '13/01/2026 11:30', status: 'Pubblicata', impressions: 28700, likes: 1560, comments: 189, shares: 321, engagement: 7.2 },
    { content: "Concorso a premi estate 2026", title: 'Giveaway', platform: 'Instagram', date: '25/01/2026 10:00', status: 'Bozza', impressions: 0, likes: 0, comments: 0, shares: 0, engagement: 0 }
  ];

  socialCampaigns = [...this.allSocialCampaigns];

  constructor(private companyStoreService: CompanyStoreService) {}

  ngOnInit(): void {
    this.companyStoreService.companyData$.subscribe(company => {
      this.company = company;
    });

    // Extract unique cities
    this.availableCities = [...new Set(this.allCampaigns.map(c => c.city))];

    // Restore saved tab from localStorage
    const savedTab = localStorage.getItem('dashboardActiveTab');
    if (savedTab === 'emails' || savedTab === 'socials') {
      this.activeTab = savedTab;
    }
  }

  switchTab(tab: 'emails' | 'socials'): void {
    this.activeTab = tab;
    localStorage.setItem('dashboardActiveTab', tab);
  }

  filterCampaigns(): void {
    this.campaigns = this.allCampaigns.filter(campaign => {
      const cityMatch = !this.selectedCity || campaign.city === this.selectedCity;
      const statusMatch = !this.selectedStatus || campaign.status === this.selectedStatus;
      return cityMatch && statusMatch;
    });
  }

  filterSocialCampaigns(): void {
    this.socialCampaigns = this.allSocialCampaigns.filter(campaign => {
      const platformMatch = !this.selectedPlatform || campaign.platform === this.selectedPlatform;
      const statusMatch = !this.selectedSocialStatus || campaign.status === this.selectedSocialStatus;
      return platformMatch && statusMatch;
    });
  }

  get stats() {
    return this.activeTab === 'emails' ? this.emailStats : this.socialStats;
  }
}
