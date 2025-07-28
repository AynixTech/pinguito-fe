import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiService } from '../../../../services/ai.service';
import { Company } from '../../../../services/company.service';
import { Subscription } from 'rxjs';
import { CompanyStoreService } from '../../../../services/company-store.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {
  campaignForm!: FormGroup;
  loading = false;
  currentCompany: Company | null = null;
  private companySubscription?: Subscription;

  constructor(private fb: FormBuilder, private companyStoreService: CompanyStoreService, private aiService: AiService) { }
  Math = Math; // Per usare Math.max in template
  ngOnInit(): void {
    this.campaignForm = this.fb.group({
      companyName: [''],
      companyUuid: ['', Validators.required],
      name: ['', Validators.required],
      budget: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      status: ['planned'],
      aiContentPrompt: ['', Validators.required],
      aiGeneratedContent: [''],
      aiSummary: [''],
      aiKeywords: ['']
    });
    this.companySubscription = this.companyStoreService.company$.subscribe(companyStore => {
      this.currentCompany = companyStore.company || null;
      this.campaignForm.patchValue({
        companyName: this.currentCompany?.name || '',
        companyUuid: this.currentCompany?.uuid || ''
      });
    });
    this.campaignForm.get('status')?.disable();
  }

  generateAIContent(): void {
    const prompt = this.campaignForm.get('aiContentPrompt')?.value;
    if (!prompt?.trim()) return;

    this.loading = true;
    this.aiService.generateAiCampaignContent(prompt).subscribe({
      next: (res) => {
        this.campaignForm.patchValue({
          aiGeneratedContent: res.aiGeneratedContent,
          aiSummary: res.aiSummary,
          aiKeywords: res.aiKeywords
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore AI:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) return;
    const data = this.campaignForm.value;
    console.log('Campagna da salvare:', data);
    // Salva la campagna qui
  }
}
