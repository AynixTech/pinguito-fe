import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  expandedItem: string | null = null;

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fa fa-home' },
    {
      label: 'Campaigns',
      icon: 'fa fa-bullhorn',
      children: [
        { path: '/campaigns/all', label: 'All Campaigns' },
        { path: '/campaigns/create', label: 'Create Campaign' }
      ]
    },
    {
      label: 'Templates',
      icon: 'fa fa-file',
      children: [
        { path: '/templates/all', label: 'All Templates' },
        { path: '/templates/create', label: 'Create Template' }
      ]
    },
    { path: '/reports', label: 'Reports', icon: 'fa fa-chart-line' },
    { path: '/customers', label: 'Customers', icon: 'fa fa-users' }
  ];

  ngOnInit(): void { }

  toggleItem(label: string): void {
    this.expandedItem = this.expandedItem === label ? null : label;
  }

  isExpanded(label: string): boolean {
    return this.expandedItem === label;
  }
}
