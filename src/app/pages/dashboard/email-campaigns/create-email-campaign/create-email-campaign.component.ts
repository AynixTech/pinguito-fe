import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailCampaignService, EmailTemplate } from '../../../../services/email-campaign.service';
import { ContactService } from '../../../../services/contact.service';

@Component({
  selector: 'app-create-email-campaign',
  templateUrl: './create-email-campaign.component.html',
  styleUrls: ['./create-email-campaign.component.scss']
})
export class CreateEmailCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  currentStep = 1;
  templates: EmailTemplate[] = [];
  contacts: any[] = [];
  filteredContacts: any[] = [];
  selectedContacts: any[] = [];
  
  // Filters
  filterForm: FormGroup;
  availableTags: string[] = [];
  availableCities: string[] = [];
  availableCountries: string[] = [];

  previewHtml = '';
  loading = false;
  recipientCount = 0;

  constructor(
    private fb: FormBuilder,
    private emailCampaignService: EmailCampaignService,
    private contactService: ContactService,
    private router: Router
  ) {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      templateUuid: [''],
      htmlContent: [''],
      useTemplate: [true],
    });

    this.filterForm = this.fb.group({
      subscribed: [true],
      tags: [[]],
      city: [''],
      country: [''],
      interests: ['']
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
    this.loadContacts();
  }

  loadTemplates(): void {
    this.emailCampaignService.getAllTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
      },
      error: (err) => console.error('Error loading templates:', err)
    });
  }

  loadContacts(): void {
    this.contactService.getAllContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.filteredContacts = contacts;
        this.extractFilterOptions();
        this.applyFilters();
      },
      error: (err) => console.error('Error loading contacts:', err)
    });
  }

  extractFilterOptions(): void {
    const tagsSet = new Set<string>();
    const citiesSet = new Set<string>();
    const countriesSet = new Set<string>();

    this.contacts.forEach(contact => {
      if (contact.tags && Array.isArray(contact.tags)) {
        contact.tags.forEach((tag: string) => tagsSet.add(tag));
      }
      if (contact.city) citiesSet.add(contact.city);
      if (contact.country) countriesSet.add(contact.country);
    });

    this.availableTags = Array.from(tagsSet).sort();
    this.availableCities = Array.from(citiesSet).sort();
    this.availableCountries = Array.from(countriesSet).sort();
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredContacts = this.contacts.filter(contact => {
      // Subscribed filter
      if (filters.subscribed !== null && contact.subscribed !== filters.subscribed) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!contact.tags || !filters.tags.some((tag: string) => contact.tags.includes(tag))) {
          return false;
        }
      }

      // City filter
      if (filters.city && contact.city !== filters.city) {
        return false;
      }

      // Country filter
      if (filters.country && contact.country !== filters.country) {
        return false;
      }

      // Interests filter
      if (filters.interests && contact.interests) {
        if (!contact.interests.toLowerCase().includes(filters.interests.toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    this.updateRecipientCount();
  }

  toggleContactSelection(contact: any): void {
    const index = this.selectedContacts.findIndex(c => c.uuid === contact.uuid);
    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    } else {
      this.selectedContacts.push(contact);
    }
    this.updateRecipientCount();
  }

  isContactSelected(contact: any): boolean {
    return this.selectedContacts.some(c => c.uuid === contact.uuid);
  }

  selectAllFiltered(): void {
    this.selectedContacts = [...this.filteredContacts];
    this.updateRecipientCount();
  }

  deselectAll(): void {
    this.selectedContacts = [];
    this.updateRecipientCount();
  }

  updateRecipientCount(): void {
    this.recipientCount = this.selectedContacts.length;
  }

  onTemplateChange(): void {
    const templateUuid = this.campaignForm.get('templateUuid')?.value;
    if (templateUuid) {
      const template = this.templates.find(t => t.uuid === templateUuid);
      if (template) {
        this.campaignForm.patchValue({
          subject: template.subject,
          htmlContent: template.htmlContent
        });
        this.previewHtml = template.htmlContent;
      }
    }
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.campaignForm.valid) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.selectedContacts.length > 0) {
      this.currentStep = 3;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  saveDraft(): void {
    const campaign = {
      ...this.campaignForm.value,
      status: 'draft' as const,
      selectedContactUuids: this.selectedContacts.map(c => c.uuid),
      filters: this.filterForm.value,
      recipientCount: this.recipientCount
    };

    this.loading = true;
    this.emailCampaignService.createCampaign(campaign).subscribe({
      next: () => {
        this.loading = false;
        alert('Campagna salvata come bozza!');
        this.router.navigate(['/dashboard/email-campaigns/list']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error saving campaign:', err);
        alert('Errore nel salvataggio della campagna');
      }
    });
  }

  sendCampaign(): void {
    if (!confirm(`Sei sicuro di voler inviare questa campagna a ${this.recipientCount} contatti?`)) {
      return;
    }

    const campaign = {
      ...this.campaignForm.value,
      status: 'sending' as const,
      selectedContactUuids: this.selectedContacts.map(c => c.uuid),
      filters: this.filterForm.value,
      recipientCount: this.recipientCount
    };

    this.loading = true;
    this.emailCampaignService.createCampaign(campaign).subscribe({
      next: (created) => {
        this.emailCampaignService.sendCampaign(created.uuid!).subscribe({
          next: () => {
            this.loading = false;
            alert('Campagna inviata con successo!');
            this.router.navigate(['/dashboard/email-campaigns/list']);
          },
          error: (err) => {
            this.loading = false;
            console.error('Error sending campaign:', err);
            alert('Errore nell\'invio della campagna');
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error creating campaign:', err);
        alert('Errore nella creazione della campagna');
      }
    });
  }
}
