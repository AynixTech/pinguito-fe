import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact, ContactService } from '@services/contact.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss']
})
export class ListContactsComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchTerm: string = '';
  isLoading = true;
  selectedContacts: Set<string> = new Set();

  constructor(
    private contactService: ContactService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactService.getAllContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.filteredContacts = contacts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore caricamento contatti:', error);
        this.toast.error('Errore durante il caricamento dei contatti', 'Errore');
        this.isLoading = false;
      }
    });
  }

  filterContacts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(term) ||
      contact.lastName.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.city?.toLowerCase().includes(term) ||
      contact.company?.toLowerCase().includes(term)
    );
  }

  createContact(): void {
    this.router.navigate(['/dashboard/contacts/create-contact']);
  }

  editContact(uuid: string): void {
    this.router.navigate([`/dashboard/contacts/edit-contact/${uuid}`]);
  }

  deleteContact(uuid: string): void {
    if (confirm('Sei sicuro di voler eliminare questo contatto?')) {
      this.contactService.deleteContact(uuid).subscribe({
        next: () => {
          this.toast.success('Contatto eliminato con successo', 'Successo');
          this.loadContacts();
        },
        error: (error) => {
          console.error('Errore eliminazione contatto:', error);
          this.toast.error('Errore durante l\'eliminazione del contatto', 'Errore');
        }
      });
    }
  }

  toggleSelection(uuid: string): void {
    if (this.selectedContacts.has(uuid)) {
      this.selectedContacts.delete(uuid);
    } else {
      this.selectedContacts.add(uuid);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedContacts.size === this.filteredContacts.length) {
      this.selectedContacts.clear();
    } else {
      this.filteredContacts.forEach(contact => {
        if (contact.uuid) this.selectedContacts.add(contact.uuid);
      });
    }
  }

  exportContacts(): void {
    this.contactService.exportContacts().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contatti_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success('Contatti esportati con successo', 'Successo');
      },
      error: (error) => {
        console.error('Errore export contatti:', error);
        this.toast.error('Errore durante l\'esportazione', 'Errore');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.contactService.importContacts(file).subscribe({
        next: (result) => {
          this.toast.success(`${result.imported} contatti importati con successo`, 'Successo');
          this.loadContacts();
        },
        error: (error) => {
          console.error('Errore import contatti:', error);
          this.toast.error('Errore durante l\'importazione', 'Errore');
        }
      });
    }
  }
}
