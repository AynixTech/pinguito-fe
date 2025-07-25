import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, Company } from '../../../../services/company.service';
import { UserService, User } from '../../../../services/user.service';
import { PlanService, Plan } from '../../../../services/plan.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {
  companyForm!: FormGroup;
  companyUuid!: string;
  users: User[] = [];
  plans: Plan[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private userService: UserService,
    private planService: PlanService
  ) { }

  ngOnInit(): void {
    this.companyUuid = this.route.snapshot.paramMap.get('uuid') || '';

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      vatNumber: [''],
      legalAddress: [''],
      operationalAddress: [''],
      pecEmail: ['', Validators.email],
      industry: [''],
      numberOfEmployees: [''],
      annualRevenue: [''],
      marketingContactName: [''],
      marketingContactEmail: ['', Validators.email],
      marketingContactPhone: [''],
      websiteTraffic: [''],
      preferredCommunicationChannel: [''],
      customerSegment: [''],
      campaignBudget: [''],
      notes: [''],
      planId: [''],
    });

    this.loadUsers();
    this.loadPlans();

    if (this.companyUuid) {
      this.loadCompany(this.companyUuid);
    } else {
      this.isLoading = false;
    }
  }

  loadCompany(uuid: string) {
    this.companyService.getCompanyByUuid(uuid).subscribe(company => {
      console.log('Company data:', company);
      this.companyForm.patchValue(company);
      this.isLoading = false;
    });
  }

  loadUsers() {
    this.userService.getMonitoringUsers().subscribe({
      next: users => {
        console.log('Users loaded:', users);
        this.users = users;
      },
      error: err => {
        console.error('Error loading users:', err);
      }
    });
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe(plans => {
      this.plans = plans;
    });
  }

  selectPlan(planId: number) {
    this.companyForm.patchValue({ planId });
  }
  

  save() {
    if (this.companyForm.invalid) return;

    const company: Company = this.companyForm.value;
    company.uuid = this.companyUuid;

    this.companyService.saveCompany(company).subscribe(() => {
      alert('Azienda salvata con successo!');
      this.router.navigate(['/companies']);
    });
  }
}
