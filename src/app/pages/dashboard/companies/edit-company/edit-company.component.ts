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
  usersMonitoring: User[] = [];       // Tutti gli utenti disponibili per monitoring
  assignedUsers: User[] = [];         // Utenti già assegnati a questa azienda
  plans: Plan[] = [];
  isLoading = true;
  activeTab: 'info' | 'plan' | 'monitoring' | 'social-media' = 'info';  // default tab attivo

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
      annualRevenue: 0,
      marketingContactName: [''],
      marketingContactEmail: ['', Validators.email],
      marketingContactPhone: [''],
      websiteTraffic: [''],
      preferredCommunicationChannel: [''],
      customerSegment: [''],
      campaignBudget: 0,
      notes: [''],
      planId: [''],
    });

    this.loadPlans();
    this.loadUsersMonitoring();

    if (this.companyUuid) {
      this.loadCompany(this.companyUuid);
    } else {
      this.isLoading = false;
    }
  }

  loadCompany(uuid: string) {
    this.companyService.getCompanyByUuid(uuid).subscribe(company => {
      this.companyForm.patchValue(company);

      // Carico gli utenti già assegnati (monitorUsers) dall'azienda
      if (company.monitorUsers) {
        this.assignedUsers = company.monitorUsers;
        // Rimuovo gli utenti assegnati da quelli disponibili
        this.usersMonitoring = this.usersMonitoring.filter(u =>
          !this.assignedUsers.some(assigned => assigned.uuid === u.uuid)
        );
      }

      this.isLoading = false;
    });
  }

  loadUsersMonitoring() {
    this.userService.getMonitoringUsers().subscribe({
      next: users => {
        this.usersMonitoring = users;

        // Se azienda già caricata e ha utenti assegnati, rimuoviamo quelli assegnati
        if (this.assignedUsers.length > 0) {
          this.usersMonitoring = this.usersMonitoring.filter(u =>
            !this.assignedUsers.some(assigned => assigned.uuid === u.uuid)
          );
        }
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

  // Funzione per spostare un utente da sinistra a destra (assegnarlo)
  assignUser(user: User) {
    this.assignedUsers.push(user);
    this.usersMonitoring = this.usersMonitoring.filter(u => u.uuid !== user.uuid);
  }

  // Funzione per spostare un utente da destra a sinistra (rimuoverlo)
  removeUser(user: User) {
    this.usersMonitoring.push(user);
    this.assignedUsers = this.assignedUsers.filter(u => u.uuid !== user.uuid);
  }

  modifyCompany() {
    if (this.companyForm.invalid) return;

    const company: Company = this.companyForm.value;
    company.uuid = this.companyUuid;

    // Aggiungo gli utenti monitoring assegnati nel payload (dipende da come il backend gestisce la relazione)
    company.monitorUserUuids = this.assignedUsers.map(u => u.uuid);
    this.companyService.updateCompany(company).subscribe(() => {
      this.router.navigate(['/companies']);
    });
  }
}
