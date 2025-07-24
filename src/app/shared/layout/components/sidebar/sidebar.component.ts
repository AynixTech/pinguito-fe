import { Component, OnInit } from '@angular/core';
import { AuthStoreService, User } from '../../../../services/auth-store.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  expandedItem: string | null = null;
  roleId: number = 0;
  menuItems: any[] = [];
  currentUser!: User | null;
  constructor(private authStore: AuthStoreService) {
    // Assuming you have a way to get the current user from AuthStoreService

  }
  ngOnInit(): void {
    // Recupera il ruolo dal localStorage (o AuthService)
    this.authStore.user$.subscribe((user: any) => {
      this.currentUser = user;
      this.roleId = this.currentUser?.role?.id || 0;
      this.setMenuItemsByRole(this.roleId);
      console.log('Current User:', this.currentUser);
      console.log('Role ID:', this.roleId);

    });

  }

  toggleItem(label: string): void {
    this.expandedItem = this.expandedItem === label ? null : label;
  }

  isExpanded(label: string): boolean {
    return this.expandedItem === label;
  }

  setMenuItemsByRole(roleId: number): void {
    switch (roleId) {
      case 1: // Admin
        this.menuItems = [
          { path: '/dashboard', label: 'Dashboard', icon: 'fa fa-home' },
          { path: '/companies', label: 'Aziende', icon: 'fa fa-building' },
          {
            label: 'Utenti',
            icon: 'fa fa-users',
            children: [
              { path: '/users/monitoring', label: 'Monitoraggio' },
              { path: '/users/clients', label: 'Clienti Azienda' }
            ]
          },
          {
            label: 'Campagne Email',
            icon: 'fa fa-envelope',
            children: [
              { path: '/campaigns/email/all', label: 'Tutte le campagne' },
              { path: '/campaigns/email/create', label: 'Crea campagna' }
            ]
          },
          {
            label: 'Campagne Social',
            icon: 'fa fa-bullhorn',
            children: [
              { path: '/campaigns/social/fb-ig', label: 'Facebook / Instagram' },
              { path: '/campaigns/social/tiktok', label: 'TikTok' },
              { path: '/campaigns/social/create', label: 'Crea campagna social' }
            ]
          },
          {
            label: 'Templates',
            icon: 'fa fa-file',
            children: [
              { path: '/templates/email', label: 'Email Templates' },
              { path: '/templates/social', label: 'Social Templates' }
            ]
          },
          {
            label: 'Report',
            icon: 'fa fa-chart-line',
            children: [
              { path: '/reports/email', label: 'Email' },
              { path: '/reports/social', label: 'Social' },
              { path: '/reports/export', label: 'Export' }
            ]
          },
          {
            label: 'Monitoraggi',
            icon: 'fa fa-eye',
            children: [
              { path: '/monitoring/assign', label: 'Assegna monitoraggi' }
            ]
          },
          {
            label: 'Impostazioni',
            icon: 'fa fa-cog',
            children: [
              { path: '/settings/plans', label: 'Piani e abbonamenti' },
              { path: '/settings/api', label: 'API & integrazioni' },
              { path: '/settings/logs', label: 'Log attività' }
            ]
          },
          { path: '/profile', label: 'Profilo & Sicurezza', icon: 'fa fa-lock' },
          { path: '/support', label: 'Supporto', icon: 'fa fa-life-ring' }
        ];
        break;

      case 3: // Monitoraggio
        this.menuItems = [
          { path: '/dashboard', label: 'Dashboard', icon: 'fa fa-home' },
          { path: '/my-companies', label: 'Le mie Aziende', icon: 'fa fa-building' },
          {
            label: 'Campagne Email',
            icon: 'fa fa-envelope',
            children: [
              { path: '/campaigns/email/assigned', label: 'Aziende assegnate' }
            ]
          },
          {
            label: 'Campagne Social',
            icon: 'fa fa-bullhorn',
            children: [
              { path: '/campaigns/social/fb-ig', label: 'Facebook / Instagram' },
              { path: '/campaigns/social/tiktok', label: 'TikTok' }
            ]
          },
          {
            label: 'Report',
            icon: 'fa fa-chart-line',
            children: [
              { path: '/reports/email', label: 'Email' },
              { path: '/reports/social', label: 'Social' },
              { path: '/reports/export', label: 'Esporta' }
            ]
          },
          { path: '/notes', label: 'Note e osservazioni', icon: 'fa fa-book' },
          { path: '/profile', label: 'Profilo & Sicurezza', icon: 'fa fa-lock' },
          { path: '/support', label: 'Supporto', icon: 'fa fa-life-ring' }
        ];
        break;

      case 2: // Azienda
        this.menuItems = [
          { path: '/dashboard', label: 'Dashboard', icon: 'fa fa-home' },
          {
            label: 'Campagne Email',
            icon: 'fa fa-envelope',
            children: [
              { path: '/campaigns/email/my', label: 'Le mie campagne' }
            ]
          },
          {
            label: 'Campagne Social',
            icon: 'fa fa-bullhorn',
            children: [
              { path: '/campaigns/social/fb-ig', label: 'Facebook / Instagram' },
              { path: '/campaigns/social/tiktok', label: 'TikTok' }
            ]
          },
          {
            label: 'Report',
            icon: 'fa fa-chart-line',
            children: [
              { path: '/reports/progress', label: 'Andamento campagne' },
              { path: '/reports/download', label: 'Scarica report' }
            ]
          },
          {
            label: 'Pagamenti & Piano',
            icon: 'fa fa-credit-card',
            children: [
              { path: '/billing/invoices', label: 'Fatture' },
              { path: '/billing/plans', label: 'Piani attivi' }
            ]
          },
          { path: '/campaigns/request', label: 'Richiedi una campagna', icon: 'fa fa-plus-circle' },
          { path: '/profile', label: 'Profilo & Sicurezza', icon: 'fa fa-lock' },
          { path: '/support', label: 'Supporto', icon: 'fa fa-life-ring' }
        ];
        break;

      default:
        this.menuItems = [];
    }
  }
}
