import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService, Company } from '@services/company.service';
import { UserService, User } from '@services/user.service';
import { PlanService, Plan } from '@services/plan.service';
import { AuthStoreService } from '@services/auth-store.service';
import { SocialMediaService } from '@services/social-media.service';
import { ToastrService } from 'ngx-toastr';
import { ROUTES } from 'app/utils/constants';
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

interface MetaSyncResponse {
  access_token: string;
  [key: string]: any;
}

interface MetaSyncError {
  message: string;
  [key: string]: any;
}

declare namespace fb {
  interface AuthResponse {
    accessToken: string;
    expiresIn: number;
    reauthorize_required_in: number;
    signedRequest: string;
    userID: string;
  }

  interface StatusResponse {
    status: 'connected' | 'not_authorized' | 'unknown';
    authResponse: AuthResponse;
  }
}
@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {
  companyForm!: FormGroup;
  companyUuid = '';
  usersMonitoring: User[] = [];
  assignedUsers: User[] = [];
  plans: Plan[] = [];
  isLoading = true;
  readonlyMode = false;
  activeTab: 'info' | 'plan' | 'monitoring' | 'social-media' = 'info';

  opened: Record<string, boolean> = {
    meta: false,
    tiktok: false,
  };

  syncStatus: Record<string, 'idle' | 'loading' | 'success' | 'error'> = {
    meta: 'idle',
    tiktok: 'idle',
  };
  metaSyncResponseParsed: any = '';
  metaTokenData: any;
  metaPageData: any;
  expiresAtDate: string = '';
  dataAccessExpiresAtDate: string = '';

  fbSdkLoaded = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private toast: ToastrService,
    private SocialMediaService: SocialMediaService,
    private userService: UserService,
    private authStore: AuthStoreService,
    private planService: PlanService
  ) { }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.companyUuid = uuid;

    }

    this.authStore.user$.subscribe((user: any) => {
      this.readonlyMode = user?.role?.name !== 'admin';
      if (this.readonlyMode) {
        this.companyForm?.disable();
      }
      else {
        this.companyForm?.enable();
      }
    });

    this.initForm();
    this.loadPlans();
    this.loadUsersMonitoring();

    if (this.companyUuid) {
      this.loadCompany(this.companyUuid);
      this.loadSocialMediaCredentials(this.companyUuid);
    } else {
      this.isLoading = false;
    }
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      vatNumber: [''],
      legalAddress: [''],
      operationalAddress: [''],
      pecEmail: ['', Validators.email],
      industry: [''],
      numberOfEmployees: [''],
      annualRevenue: [0],
      marketingContactName: [''],
      marketingContactEmail: ['', Validators.email],
      marketingContactPhone: [''],
      websiteTraffic: [''],
      preferredCommunicationChannel: [''],
      customerSegment: [''],
      campaignBudget: [0],
      notes: [''],
      planId: [''],
      tiktokLink: [''],
      tiktokBusinessId: [''],
      tiktokAccessToken: [''],
      metaAppId: [''],
      metaAppSecret: [''],
      metaAccessToken: [''],
      metaShortToken: [''],
      metaSyncResponse: [''],
      metaPageId: [null],
      metaPageAccessToken: [''],
    });
  }

  // 1. Carica SDK di Facebook una sola volta
  async loginWithFacebook() {
    const appId = this.companyForm.get('metaAppId')?.value;
    const appSecret = this.companyForm.get('metaAppSecret')?.value;
    const companyId = this.companyUuid || this.route.snapshot.paramMap.get('uuid');

    if (!appId || !appSecret || !companyId) {
      alert('Compila tutti i campi del form.');
      return;
    }

    // Carica l'SDK solo se non già caricato
    if (!this.fbSdkLoaded) {
      await this.loadFacebookSDK(appId);
    }

    // Login con Facebook
    window.FB.login((response: fb.StatusResponse) => {
      if (response.status === 'connected') {
        const shortToken = response.authResponse.accessToken;
        console.log('Short Token:', shortToken);
        this.syncFacebookToken({ shortToken, companyUuid: this.companyUuid, appId: appId, appSecret: appSecret });
      } else {
        alert('Login Facebook annullato o fallito.');
      }
    }, {
      scope: 'pages_show_list,pages_manage_posts,pages_read_engagement,pages_manage_metadata'
    });
  }
  syncFacebookToken(data: { shortToken: string, companyUuid: string, appId: string, appSecret: string }) {

    this.SocialMediaService.syncMetaToken(data).subscribe({
      next: (response: any) => {
        console.log('Sincronizzazione Meta riuscita:', response);
        this.companyForm.patchValue({
          metaShortToken: response.metaShortToken,
        });
        // this.loadSocialMediaCredentials(companyUuid);
      },
      error: (error: MetaSyncError) => {
        console.error('Errore sincronizzazione Meta:', error);
        alert('Errore durante la sincronizzazione con Facebook.');
      }
    });
  }

  loadFacebookSDK(appId: string): Promise<void> {
    return new Promise(resolve => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: 'v19.0'
        });
        this.fbSdkLoaded = true;
        resolve();
      };

      const existingScript = document.getElementById('facebook-jssdk');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        document.body.appendChild(script);
      } else {
        resolve(); // già caricato
      }
    });
  }


  loadCompany(uuid: string): void {
    this.companyService.getCompanyByUuid(uuid).subscribe({
      next: (company: Company) => {
        this.companyForm.patchValue(company);

        if (company.monitorUsers) {
          this.assignedUsers = company.monitorUsers;
          this.usersMonitoring = this.usersMonitoring.filter(u =>
            !this.assignedUsers.some(assigned => assigned.uuid === u.uuid)
          );
        }

        this.isLoading = false;
      },
      error: err => {
        console.error('Errore nel caricamento azienda:', err);
        this.isLoading = false;
      }
    });
  }

  loadSocialMediaCredentials(uuid: string): void {
    this.SocialMediaService.getSocialMediaCredentialsByCompanyUuid(uuid).subscribe({
      next: (credentials) => {
        console.log('Credenziali social media:', credentials);
        if (credentials) {
          this.metaTokenData = JSON.parse(credentials.metaSyncResponse || '{}');
          this.metaPageData = JSON.parse(credentials.metaPagesResponse || '{}');
          if (this.metaTokenData) {
            this.expiresAtDate = this.formatDate(this.metaTokenData.expires_at);
            this.dataAccessExpiresAtDate = this.formatDate(this.metaTokenData.data_access_expires_at);
          }

          this.companyForm.patchValue({
            metaAppId: credentials.metaAppId,
            metaAppSecret: credentials.metaAppSecret,
            metaShortToken: credentials.metaShortToken,
            metaAccessToken: credentials.metaAccessToken,
            metaPageId: credentials.metaPageId,
            metaPageAccessToken: credentials.metaPageAccessToken,
          });
        }
      },
      error: (err) => {
        console.error('Errore nel caricamento social media:', err);
      }
    });
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  isExpired(unixTimestamp: number): boolean {
    return new Date(unixTimestamp * 1000) < new Date();
  }
  getTimeLeft(unixTimestamp: number): string {
    const expirationDate = new Date(unixTimestamp * 1000);
    const now = new Date();
    let diff = expirationDate.getTime() - now.getTime();

    if (diff <= 0) {
      return '0 giorni, 0 ore, 0 minuti';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));

    return `${days} giorni, ${hours} ore, ${minutes} minuti`;
  }

  loadUsersMonitoring(): void {
    this.userService.getMonitoringUsers().subscribe({
      next: (users: User[]) => {
        this.usersMonitoring = users;

        if (this.assignedUsers.length > 0) {
          this.usersMonitoring = this.usersMonitoring.filter(u =>
            !this.assignedUsers.some(assigned => assigned.uuid === u.uuid)
          );
        }
      },
      error: err => {
        console.error('Errore nel caricamento utenti:', err);
      }
    });
  }

  loadPlans(): void {
    this.planService.getAllPlans().subscribe({
      next: (plans: Plan[]) => {
        this.plans = plans;
      },
      error: err => {
        console.error('Errore nel caricamento piani:', err);
      }
    });
  }

  onPageSelect(): void {
    const selectedIndex = this.companyForm.get('metaPageId')?.value;
    if (selectedIndex !== undefined) {
      console.log('Index selezionato:', selectedIndex);
      console.log('metaPageData:', this.metaPageData);
    }
    console.log('Pagina selezionata:', selectedIndex);

    const selectedPage = this.metaPageData.find((page: any) => page.id === selectedIndex);

    const payload = {
      pageId: selectedPage.id,
      accessToken: selectedPage.access_token,
    };

    console.log('Dati da salvare:', payload);

    this.SocialMediaService.savePageData({
      companyUuid: this.companyUuid,
      pageId: selectedPage.id,
      accessToken: selectedPage.access_token,
    }).subscribe({
      next: (response) => {
        console.log('Pagina salvata con successo:', response);
        this.toast.success('Pagina salvata con successo', 'Successo');
      },
      error: (error) => {
        console.error('Errore durante il salvataggio:', error);
        this.toast.error('Errore durante il salvataggio della pagina', 'Errore');
      }
    });
  }


  selectPlan(planId: number): void {
    if (this.readonlyMode) return;
    this.companyForm.patchValue({ planId });
  }

  assignUser(user: User): void {
    if (this.readonlyMode) return;
    this.assignedUsers.push(user);
    this.usersMonitoring = this.usersMonitoring.filter(u => u.uuid !== user.uuid);
  }

  removeUser(user: User): void {
    if (this.readonlyMode) return;
    this.usersMonitoring.push(user);
    this.assignedUsers = this.assignedUsers.filter(u => u.uuid !== user.uuid);
  }

  toggleAccordion(section: keyof typeof this.opened): void {
    this.opened[section] = !this.opened[section];
  }


  getStatusText(status: string): string {
    switch (status) {
      case 'loading':
        return 'Sincronizzazione...';
      case 'success':
        return '✓ Successo';
      case 'error':
        return '✗ Errore';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    return {
      loading: 'text-blue',
      success: 'text-green',
      error: 'text-red'
    }[status] || '';
  }

  modifyCompany(): void {
    if (this.companyForm.invalid) return;

    const company: Company = {
      ...this.companyForm.value,
      uuid: this.companyUuid,
      monitorUserUuids: this.assignedUsers.map(u => u.uuid)
    };

    this.companyService.updateCompany(company).subscribe({
      next: () => {
        this.router.navigate([ROUTES.COMPANY.LIST]);
        this.toast.success('Azienda aggiornata con successo', 'Successo');
      },
      error: err => {
        console.error('Errore durante aggiornamento:', err);
        this.toast.error('Errore durante l\'aggiornamento dell\'azienda', 'Errore');
      }
    });
  }
}
