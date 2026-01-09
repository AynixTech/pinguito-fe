import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailCampaignService, EmailTemplate } from '../../../../services/email-campaign.service';
import { CompanyStoreService } from '../../../../services/company-store.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit {
  templates: EmailTemplate[] = [];
  filteredTemplates: EmailTemplate[] = [];
  searchTerm = '';
  showCreateForm = false;
  editingTemplate: EmailTemplate | null = null;
  isLoading = false;
  
  templateForm: FormGroup;
  companyUuid: string | null = null;
  companyName: string | null = null;
  previewHtml = '';

  constructor(
    private fb: FormBuilder,
    private emailCampaignService: EmailCampaignService,
    private companyStore: CompanyStoreService,
    private toastService: ToastService
  ) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      htmlContent: ['', Validators.required],
      variables: [[]]
    });
  }

  ngOnInit(): void {
    this.companyStore.companyData$.subscribe(company => {
      if (company) {
        this.companyUuid = company.uuid;
        this.companyName = company.name;
        this.loadTemplates();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadTemplates(): void {
    if (!this.companyUuid) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.emailCampaignService.getAllTemplates().subscribe({
      next: (templates) => {
        this.templates = templates
          .filter(t => t.companyUuid === this.companyUuid)
          .map(template => ({
            ...template,
            variables: this.parseVariables(template.variables)
          }));
        this.filteredTemplates = this.templates;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading templates:', err);
        this.isLoading = false;
      }
    });
  }

  private parseVariables(variables: any): string[] {
    if (Array.isArray(variables)) {
      return variables;
    }
    if (typeof variables === 'string') {
      try {
        const parsed = JSON.parse(variables);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  filterTemplates(): void {
    this.filteredTemplates = this.templates.filter(template =>
      template.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.editingTemplate = null;
    this.templateForm.reset();
    this.previewHtml = '';
  }

  openEditForm(template: EmailTemplate): void {
    this.showCreateForm = true;
    this.editingTemplate = template;
    this.templateForm.patchValue({
      name: template.name,
      subject: template.subject,
      htmlContent: template.htmlContent,
      variables: template.variables || []
    });
    this.previewHtml = template.htmlContent;
  }

  closeForm(): void {
    this.showCreateForm = false;
    this.editingTemplate = null;
    this.templateForm.reset();
    this.previewHtml = '';
  }

  updatePreview(): void {
    this.previewHtml = this.templateForm.get('htmlContent')?.value || '';
  }

  saveTemplate(): void {
    if (!this.companyUuid) {
      this.toastService.showToast('Seleziona una company prima di creare un template', 'warning');
      return;
    }

    if (!this.templateForm.valid) {
      this.toastService.showToast('Compila tutti i campi obbligatori', 'warning');
      return;
    }

    const templateData = {
      ...this.templateForm.value,
      companyUuid: this.companyUuid
    };

    if (this.editingTemplate) {
      // Update
      this.emailCampaignService.updateTemplate(this.editingTemplate.uuid!, templateData).subscribe({
        next: () => {
          this.loadTemplates();
          this.closeForm();
          this.toastService.showToast('Template aggiornato con successo!', 'success');
        },
        error: (err) => {
          console.error('Error updating template:', err);
          this.toastService.showToast('Errore nell\'aggiornamento del template', 'error');
        }
      });
    } else {
      // Create
      this.emailCampaignService.createTemplate(templateData).subscribe({
        next: () => {
          this.loadTemplates();
          this.closeForm();
          this.toastService.showToast('Template creato con successo!', 'success');
        },
        error: (err) => {
          console.error('Error creating template:', err);
          this.toastService.showToast('Errore nella creazione del template', 'error');
        }
      });
    }
  }

  deleteTemplate(uuid: string): void {
    if (!confirm('Sei sicuro di voler eliminare questo template?')) {
      return;
    }

    this.emailCampaignService.deleteTemplate(uuid).subscribe({
      next: () => {
        this.loadTemplates();
        this.toastService.showToast('Template eliminato con successo!', 'success');
      },
      error: (err) => {
        console.error('Error deleting template:', err);
        this.toastService.showToast('Errore nell\'eliminazione del template', 'error');
      }
    });
  }

  duplicateTemplate(template: EmailTemplate): void {
    this.templateForm.patchValue({
      name: `${template.name} (Copia)`,
      subject: template.subject,
      htmlContent: template.htmlContent,
      variables: template.variables || []
    });
    this.editingTemplate = null;
    this.showCreateForm = true;
    this.previewHtml = template.htmlContent;
  }
}
