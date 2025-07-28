import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from '../../../../services/campaign.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {
  campaignForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService
  ) { }

  ngOnInit(): void {
    this.campaignForm = this.fb.group({
      companyUuid: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      startDate: [''],
      endDate: [''],
      budget: [null],
      status: ['planned']
    });
  }

  onSubmit(): void {
    if (this.campaignForm.valid) {
      const formData = this.campaignForm.value;

      this.campaignService.createCampaign(formData).subscribe({
        next: (res) => {
          alert('Campagna creata con successo!');
          this.campaignForm.reset({
            status: 'planned' // reimposta valore di default
          });
        },
        error: (err) => {
          console.error('Errore durante la creazione:', err);
          alert('Errore durante la creazione della campagna.');
        }
      });
    }
  }
}
