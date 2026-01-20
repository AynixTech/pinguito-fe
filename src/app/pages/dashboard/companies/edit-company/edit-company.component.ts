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
import { environment } from '../../../../../environments/environment';
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
  activeTab: 'info' | 'plan' | 'brand' | 'monitoring' | 'social-media' = 'info';
  
  // Esponi environment al template
  environment = environment;

  opened: Record<string, boolean> = {
    meta: true,
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
      // Brand fields
      brandLogo: [''],
      brandPrimaryFont: [''],
      brandSecondaryFont: [''],
      brandPrimaryColor: ['#667eea'],
      brandSecondaryColor: ['#764ba2'],
      brandAccentColor: ['#10b981'],
      brandMission: [''],
      brandVision: [''],
      brandEthics: [''],
    });
  }

  // 1. Carica SDK di Facebook una sola volta
  async loginWithFacebook() {
    const companyId = this.companyUuid || this.route.snapshot.paramMap.get('uuid');

    if (!companyId) {
      this.toast.error('Seleziona un\'azienda prima di procedere', 'Errore');
      return;
    }

    this.syncStatus['meta'] = 'loading';
    const appId = environment.metaAppId; // App ID pubblico da environment

    // Carica l'SDK solo se non già caricato
    if (!this.fbSdkLoaded) {
      await this.loadFacebookSDK(appId);
    }

    // Login con Facebook
    window.FB.login((response: fb.StatusResponse) => {
      if (response.status === 'connected') {
        const accessToken = response.authResponse.accessToken;
        console.log('=== FACEBOOK LOGIN SUCCESSO ===');
        console.log('User Access Token:', accessToken);
        console.log('Company UUID:', companyId);
        console.log('Auth Response:', response.authResponse);
        
        this.syncFacebookToken({ accessToken, companyUuid: companyId });
      } else {
        console.warn('Login Facebook fallito. Status:', response.status);
        this.toast.warning('Login Facebook annullato o fallito', 'Attenzione');
        this.syncStatus['meta'] = 'error';
      }
    }, {
      scope: 'public_profile',
      auth_type: 'rerequest' // Forza a richiedere di nuovo i permessi se precedentemente negati
    });
  }
  syncFacebookToken(data: { accessToken: string, companyUuid: string }) {
    console.log('=== INVIO AL BACKEND ===');
    console.log('Payload:', data);
    
    this.SocialMediaService.syncMetaToken(data).subscribe({
      next: (response: any) => {
        console.log('=== RISPOSTA COMPLETA DAL BACKEND ===');
        console.log('Response completa:', response);
        console.log('Type of response:', typeof response);
        console.log('Response keys:', Object.keys(response));
        
        // Parsa le pagine dalla risposta
        if (response.metaPagesResponse) {
          console.log('metaPagesResponse trovato:', response.metaPagesResponse);
          console.log('Type of metaPagesResponse:', typeof response.metaPagesResponse);
          
          // Verifica se è già un array o una stringa JSON
          this.metaPageData = typeof response.metaPagesResponse === 'string' 
            ? JSON.parse(response.metaPagesResponse) 
            : response.metaPagesResponse;
          
          console.log('Pagine Facebook parsate:', this.metaPageData);
          console.log('Numero di pagine:', Array.isArray(this.metaPageData) ? this.metaPageData.length : 'Non è un array');
          
          // Se metaPageData è un oggetto con una proprietà 'data', usa quella
          if (this.metaPageData && this.metaPageData.data && Array.isArray(this.metaPageData.data)) {
            this.metaPageData = this.metaPageData.data;
            console.log('Estratto array da .data:', this.metaPageData);
          }
        } else {
          console.warn('metaPagesResponse NON trovato nella risposta');
        }
        
        // Parsa anche il metaSyncResponse per avere i dettagli del token
        if (response.metaSyncResponse) {
          console.log('metaSyncResponse trovato:', response.metaSyncResponse);
          console.log('Type of metaSyncResponse:', typeof response.metaSyncResponse);
          
          this.metaTokenData = typeof response.metaSyncResponse === 'string'
            ? JSON.parse(response.metaSyncResponse)
            : response.metaSyncResponse;
          
          console.log('metaTokenData parsato:', this.metaTokenData);
          
          if (this.metaTokenData) {
            this.expiresAtDate = this.formatDate(this.metaTokenData.expires_at);
            this.dataAccessExpiresAtDate = this.formatDate(this.metaTokenData.data_access_expires_at);
            console.log('Date formattate - expires_at:', this.expiresAtDate, 'data_access_expires_at:', this.dataAccessExpiresAtDate);
          }
        } else {
          console.warn('metaSyncResponse NON trovato nella risposta');
        }
        
        this.companyForm.patchValue({
          metaShortToken: response.metaShortToken || data.accessToken,
          metaAccessToken: response.metaAccessToken,
        });
        
        console.log('Form aggiornato con - shortToken:', response.metaShortToken || data.accessToken, 'accessToken:', response.metaAccessToken);
        
        this.syncStatus['meta'] = 'success';
        
        if (this.metaPageData && Array.isArray(this.metaPageData) && this.metaPageData.length > 0) {
          this.toast.success(`${this.metaPageData.length} pagine Facebook caricate! Seleziona una pagina.`, 'Successo');
        } else {
          this.toast.warning('Nessuna pagina Facebook trovata. Verifica i permessi.', 'Attenzione');
        }
      },
      error: (error: MetaSyncError) => {
        console.error('Errore sincronizzazione Meta:', error);
        this.toast.error('Errore durante la sincronizzazione con Facebook', 'Errore');
        this.syncStatus['meta'] = 'error';
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

  // Metodo per testare direttamente le pagine da Facebook SDK
  testFacebookPages(): void {
    if (!this.fbSdkLoaded) {
      this.toast.error('SDK Facebook non caricato. Clicca prima su "Collega Facebook"', 'Errore');
      return;
    }

    window.FB.api('/me/accounts', (response: any) => {
      console.log('=== TEST DIRETTO PAGINE FACEBOOK ===');
      console.log('Response completa:', response);
      
      if (response && !response.error) {
        console.log('Numero di pagine trovate:', response.data?.length || 0);
        console.log('Pagine:', response.data);
        
        if (response.data && response.data.length > 0) {
          this.toast.success(`${response.data.length} pagine trovate!`, 'Successo');
        } else {
          this.toast.warning('Nessuna pagina trovata. Verifica di essere admin di almeno una pagina Facebook.', 'Attenzione');
        }
      } else {
        console.error('Errore:', response.error);
        this.toast.error('Errore nel recupero delle pagine: ' + (response.error?.message || 'Sconosciuto'), 'Errore');
      }
    });
  }

  // Metodo per estendere il token e caricare le pagine manualmente
  extendTokenAndGetPages(): void {
    const shortToken = this.companyForm.get('metaAccessToken')?.value;
    
    if (!shortToken) {
      this.toast.error('Inserisci prima il token da Graph API Explorer', 'Errore');
      return;
    }
    
    const companyId = this.companyUuid || this.route.snapshot.paramMap.get('uuid');
    if (!companyId) {
      this.toast.error('Seleziona un\'azienda prima di procedere', 'Errore');
      return;
    }
    
    this.syncStatus['meta'] = 'loading';
    this.toast.info('Estensione token in corso...', 'Info');
    
    this.syncFacebookToken({ accessToken: shortToken, companyUuid: companyId });
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
    console.log('Toggling section:', section);
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

  // Brand methods
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.toast.error('Il file è troppo grande. Dimensione massima: 2MB', 'Errore');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toast.error('Il file deve essere un\'immagine', 'Errore');
        return;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64String = e.target?.result as string;
        this.companyForm.patchValue({ brandLogo: base64String });
        this.toast.success('Logo caricato con successo', 'Successo');
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.companyForm.patchValue({ brandLogo: '' });
    this.toast.info('Logo rimosso', 'Info');
  }
}
