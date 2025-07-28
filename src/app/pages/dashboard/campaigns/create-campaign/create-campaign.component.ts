import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiService } from '../../../../services/ai.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {
  campaignForm!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private aiService: AiService) { }
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
  }

  generateAIContent(): void {
    const prompt = this.campaignForm.get('aiContentPrompt')?.value;
    if (!prompt?.trim()) return;

    this.loading = true;
    this.aiService.generateAiCampaignContent(prompt).subscribe({
      next: (res) => {
        this.campaignForm.patchValue({
          aiGeneratedContent: res.aiGeneratedContent,
          aiSummary:res.aiSummary,
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

  private generateSummary(text: string): string {
    const sentences = text.split('.').filter(s => s.trim());
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  }

  private extractKeywords(text: string): string {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);
    const uniqueWords = Array.from(new Set(words));
    return uniqueWords.slice(0, 5).join(', ');
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) return;
    const data = this.campaignForm.value;
    console.log('Campagna da salvare:', data);
    // Salva la campagna qui
  }
}
