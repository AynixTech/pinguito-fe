import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company, CompanyService } from '@services/company.service';
import { Plan, PlanService } from '@services/plan.service';
import { User, UserService } from '@services/user.service';
import { SocialMedia } from '@services/social-media.service';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {
  companyForm!: FormGroup;
  activeTab: string = 'info';
  isLoading = false;


  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      vatNumber: [''],
      legalAddress: [''],
      pecEmail: ['', Validators.email],
      industry: [''],
      numberOfEmployees: [''],
      marketingContactName: [''],
      marketingContactEmail: ['', Validators.email],
      marketingContactPhone: [''],
      notes: [''],
      planId: [null],
      // social media fields example (adjust as needed)
      metaAppId: [''],
      metaAppSecret: [''],
      metaShortToken: [''],
      metaAccessToken: [''],
      metaPageId: [''],
      metaPageAccessToken: ['']
    });
  }


  modifyCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const newCompany: Company = {
      ...this.companyForm.value,
    };

    this.companyService.createCompany(newCompany).subscribe({
      next: company => {
        this.isLoading = false;
        alert('Company creata con successo!');
        this.companyForm.reset();
        this.activeTab = 'info';
      },
      error: err => {
        this.isLoading = false;
        alert('Errore durante la creazione della company');
        console.error(err);
      }
    });
  }
}
