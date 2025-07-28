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
  channels: string[] = [];

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
      channels: [[]] ,
      status: ['planned'],
      aiContentPrompt: ['', Validators.required],
      aiGeneratedContentEmail: [''],
      aiGeneratedContentFacebook: [''],
      aiGeneratedContentInstagram: [''],
      aiSummaryEmail: [''],
      aiSummaryFacebook: [''],
      aiSummaryInstagram: [''],
      aiKeywordsEmail: [''],
      aiKeywordsFacebook: [''],
      aiKeywordsInstagram: ['']
    });
    this.companySubscription = this.companyStoreService.company$.subscribe(companyStore => {
      this.currentCompany = companyStore.company || null;
      this.campaignForm.patchValue({
        companyName: this.currentCompany?.name || '',
        companyUuid: this.currentCompany?.uuid || ''
      });
    });
    this.channels = this.campaignForm.get('channels')?.value || [];

    this.campaignForm.get('status')?.disable();
  }
  onChannelChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.channels.includes(checkbox.value)) {
        this.channels.push(checkbox.value);
      }
    } else {
      this.channels = this.channels.filter(c => c !== checkbox.value);
    }
    this.campaignForm.patchValue({ channels: this.channels });
  }

  generateAIContent(): void {
    const prompt = this.campaignForm.get('aiContentPrompt')?.value;
    if (!prompt?.trim()) return;

    this.loading = true;
    let channels = this.campaignForm.get('channels')?.value.join(', ') || '';
    this.aiService.generateAiCampaignContent(prompt, channels).subscribe({
      next: (res) => {
        this.campaignForm.patchValue({
          aiGeneratedContentEmail: res.aiGeneratedContentEmail ?? null,
          aiGeneratedContentFacebook: res.aiGeneratedContentFacebook ?? null,
          aiGeneratedContentInstagram: res.aiGeneratedContentInstagram ?? null,
          aiSummaryEmail: res.aiSummaryEmail ?? null,
          aiSummaryFacebook: res.aiSummaryFacebook ?? null,
          aiSummaryInstagram: res.aiSummaryInstagram ?? null,
          aiKeywordsEmail: res.aiKeywordsEmail ?? null,
          aiKeywordsFacebook: res.aiKeywordsFacebook ?? null,
          aiKeywordsInstagram: res.aiKeywordsInstagram ?? null
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
