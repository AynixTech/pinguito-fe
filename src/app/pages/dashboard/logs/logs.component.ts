import { Component, OnInit } from '@angular/core';
import { LogService } from '@services/log.service'; // aggiorna il path se necessario

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  paginatedLogs: any[] = [];

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.getAllLogs();
  }

  getAllLogs(): void {
    this.logService.getAllLogs().subscribe((res: any) => {
      this.logs = res;
      this.filteredLogs = [...this.logs];
      this.updatePagination();
    });
  }

  onSearchChange(): void {
    this.filterLogs();
  }

  filterLogs(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredLogs = this.logs.filter(log =>
      log.action?.toLowerCase().includes(term) ||
      log.details?.toLowerCase().includes(term) ||
      log.user?.name?.toLowerCase().includes(term) ||
      log.user?.surname?.toLowerCase().includes(term) ||
      log.user?.email?.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredLogs.sort((a, b) => {
      const aValue = a[column] ?? '';
      const bValue = b[column] ?? '';

      return this.sortDirection === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedLogs = this.filteredLogs.slice(start, start + this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
