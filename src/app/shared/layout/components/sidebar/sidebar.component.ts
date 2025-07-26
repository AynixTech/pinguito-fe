import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthStoreService } from '../../../../services/auth-store.service';
import { User } from '../../../../services/user.service';

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

  constructor(private authStore: AuthStoreService, public router: Router) { }

  ngOnInit(): void {
    this.authStore.user$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.roleId = this.currentUser?.role?.id || 0;
      this.setMenuItemsByRole(this.roleId);

      this.setExpandedItemBasedOnRoute(this.router.url);
    });
    // Aggiorna expandedItem ad ogni navigazione
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setExpandedItemBasedOnRoute(event.urlAfterRedirects);
    });

  }

  setExpandedItemBasedOnRoute(currentPath: string) {
    // Cerca menu con children che ha un child attivo
    const expanded = this.menuItems.find(item =>
      item.children && item.children.some((child: any) => this.router.isActive(child.path, true))
    );

    this.expandedItem = expanded ? expanded.label : null;
  }

  toggleItem(label: string): void {
    this.expandedItem = this.expandedItem === label ? null : label;
  }

  isExpanded(label: string): boolean {
    return this.expandedItem === label;
  }

  isChildActive(item: any): boolean {
    if (!item.children) return false;
    return item.children.some((child: any) => this.router.isActive(child.path, true));
  }
  setMenuItemsByRole(roleId: number): void {
    switch (roleId) {
      case 1: // Admin
        this.menuItems = [
          { path: '/', label: 'Dashboard', icon: 'fa fa-home' },
          {
            label: 'Gestione',
            icon: 'fa fa-users',
            children: [
              { path: '/users', label: 'Utenti' },
              { path: '/companies', label: 'Aziende', icon: 'fa fa-building' },
            ]
          },
          {
            label: 'Campagne',
            icon: 'fa fa-envelope',
            children: [
              { path: '/campaigns', label: 'Tutte le campagne' },
              { path: '/campaigns/create', label: 'Crea campagna' }
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
          { path: '/', label: 'Dashboard', icon: 'fa fa-home' },
          { path: '/my-companies', label: 'Le mie Aziende', icon: 'fa fa-building' },
          {
            label: 'Campagne',
            icon: 'fa fa-envelope',
            children: [
              { path: '/campaigns', label: 'Tutte le campagne' },
              { path: '/create', label: 'Crea campagna' }
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
          { path: '/', label: 'Dashboard', icon: 'fa fa-home' },
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
