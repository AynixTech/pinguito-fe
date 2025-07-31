import { Component, OnInit } from '@angular/core';
import { User, UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmationService } from '@services/confirmation.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  searchTerm: string = '';
  filterRole: string = '';

  sortColumn: keyof User = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  pageSize = 50;
  currentPage = 1;
  totalPages = 1;

  roles: string[] = [];

  constructor(
    private userService: UserService,
    private confirmationDialogService: ConfirmationService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.users = data;
        this.extractFilters();
        this.applyFiltersAndSort();
      },
      error: () => {
        this.toast.error('Errore durante il caricamento degli utenti', 'Errore');
      }
    });
  }

  extractFilters() {
    // Estraggo i nomi dei ruoli dai ruoli oggetto
    this.roles = Array.from(new Set(this.users.map(u => u.role?.name).filter(Boolean)));
  }

  applyFiltersAndSort() {
    let temp = this.users.filter(u =>
      !this.searchTerm ||
      u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (u.role && u.role.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );

    if (this.filterRole) {
      temp = temp.filter(u => u.role?.name === this.filterRole);
    }

    temp.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Gestione per 'role' perché non è stringa semplice
      if (this.sortColumn === 'role') {
        valA = a.role?.name || '';
        valB = b.role?.name || '';
      }

      // Provide default values if undefined
      if (typeof valA === 'undefined' || valA === null) valA = '';
      if (typeof valB === 'undefined' || valB === null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredUsers = temp;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  onSearchChange() {
    this.applyFiltersAndSort();
  }

  onFilterRoleChange() {
    this.applyFiltersAndSort();
  }

  toggleSort(column: keyof User) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  editUser(user: User) {
    this.router.navigate(['/dashboard/users/edit', user.uuid]);
  }

  viewUser(user: User) {
    this.router.navigate(['/dashboard/users/view', user.uuid]);
  }

  deleteUser(user: User) {
    this.confirmationDialogService.open({
      title: 'Eliminare ' + user.name + ' ' + user.surname + '?',
      message: 'Vuoi davvero eliminarlo?',
      confirmText: 'Sì',
      type: 'warning',
      cancelText: 'Annulla'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user.uuid).subscribe({
          next: () => {
            this.toast.success('Utente eliminato con successo', 'Successo');
            this.loadUsers();
          },
          error: () => {
            this.toast.error('Errore durante l\'eliminazione dell\'utente', 'Errore');
          }
        });
      }
    });
  }
}
