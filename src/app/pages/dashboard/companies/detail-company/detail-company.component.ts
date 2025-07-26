import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, Company } from '../../../../services/company.service';
import { UserService, User } from '../../../../services/user.service';
import { PlanService, Plan } from '../../../../services/plan.service';
import { AuthStoreService } from '../../../../services/auth-store.service';

@Component({
  selector: 'app-detail-company',
  templateUrl: './detail-company.component.html',
  styleUrls: ['./detail-company.component.scss']
})
export class DetailCompanyComponent implements OnInit {
  companyForm!: FormGroup;
  companyUuid!: string;
  usersMonitoring: User[] = [];       // Tutti gli utenti disponibili per monitoring
  assignedUsers: User[] = [];         // Utenti già assegnati a questa azienda
  plans: Plan[] = [];
  isLoading = true;
  activeTab: 'info' | 'plan' | 'monitoring' | 'social-media' = 'info';  // default tab attivo
  readonlyMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private userService: UserService,
    private authStore: AuthStoreService,
    private planService: PlanService
  ) { }

  ngOnInit(): void {
    this.companyUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.authStore.user$.subscribe((user: any) => {
      this.readonlyMode = user.role?.name !== 'admin'; // Imposta readonly se il ruolo è diverso da admin
    });

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

    if (this.readonlyMode) {
      this.companyForm.disable();
    }

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
    if (this.readonlyMode) return; // Non permette di cambiare il piano in modalità readonly
    this.companyForm.patchValue({ planId });
  }

  // Funzione per spostare un utente da sinistra a destra (assegnarlo)
  assignUser(user: User) {
    if (this.readonlyMode) return; // Non permette di assegnare utenti in modalità readonly
    this.assignedUsers.push(user);
    this.usersMonitoring = this.usersMonitoring.filter(u => u.uuid !== user.uuid);
  }

  // Funzione per spostare un utente da destra a sinistra (rimuoverlo)
  removeUser(user: User) {
    if (this.readonlyMode) return; // Non permette di rimuovere utenti in modalità readonly
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
