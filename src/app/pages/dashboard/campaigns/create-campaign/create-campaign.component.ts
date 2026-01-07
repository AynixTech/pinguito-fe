import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AiService } from '@services/ai.service';
import { Company } from '@services/company.service';
import { Subscription } from 'rxjs';
import { CompanyStoreService } from '@services/company-store.service';
import { CampaignService, CreateCampaignRequest } from '@services/campaign.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '@services/loader.service';
import { ExperienceService } from '@services/experience.service';
import { AuthStoreService } from '@services/auth-store.service';
import { User } from '@services/user.service';
import { ExperienceStateService } from '@services/experience-state.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit, OnDestroy {
  campaignForm!: FormGroup;
  loading = false;
  currentCompany: Company | null = null;
  channels: string[] = [];
  currentUser: User | null = null;

  private companySubscription?: Subscription;
  private formChangesSubscription?: Subscription;

  private localStorageKey = 'createCampaignFormData';

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private loader: LoaderService,
    private experienceService: ExperienceService,
    private experienceStateService: ExperienceStateService,
    private companyStoreService: CompanyStoreService,
    private authStore: AuthStoreService,
    private toast: ToastrService,
    private aiService: AiService
  ) { }

  Math = Math; // Per usare Math.max in template

  ngOnInit(): void {
    this.authStore.user$.subscribe((user: any) => {
      this.currentUser = user;
    });

    this.campaignForm = this.fb.group({
      companyName: [''],
      companyUuid: ['', Validators.required],
      name: ['', Validators.required],
      budget: ['', Validators.required],
      description: [''],
      targetAudience: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      channels: [[], Validators.required],
      status: ['planned', Validators.required],
      aiContentPrompt: ['', Validators.required],
      generateAiImages: [false],
      numberPosts: [2, [Validators.required, Validators.min(1)]], // Numero di post per giorno
      facebookPosts: this.fb.array([]),
      instagramPosts: this.fb.array([]),
      tiktokVideos: this.fb.array([]),
    }, {
      validators: [this.startBeforeEndValidator] // 👈 Aggiunto qui

    });

    // Carica dati da localStorage se presenti
    const savedForm = localStorage.getItem(this.localStorageKey);
    if (savedForm) {
      const savedData = JSON.parse(savedForm);

      // Carichiamo i post Facebook singolarmente perché sono FormArray di FormGroup
      if (savedData.facebookPosts && Array.isArray(savedData.facebookPosts)) {
        const fbPosts = this.fb.array(savedData.facebookPosts.map((post: any) => this.createFacebookPost(post)));
        this.campaignForm.setControl('facebookPosts', fbPosts);
      }

      // Carichiamo gli altri campi
      this.campaignForm.patchValue({
        ...savedData,
        facebookPosts: undefined // perché già settato sopra
      });
      this.channels = savedData.channels || [];
    }

    this.companySubscription = this.companyStoreService.company$.subscribe(companyStore => {
      this.currentCompany = companyStore.company || null;
      this.campaignForm.patchValue({
        companyName: this.currentCompany?.name || '',
        companyUuid: this.currentCompany?.uuid || ''
      });
    });

    this.channels = this.campaignForm.get('channels')?.value || [];
    this.campaignForm.get('status')?.disable();

    // Salva in locale ogni volta che il form cambia
    this.formChangesSubscription = this.campaignForm.valueChanges.subscribe(value => {
      // Per salvare, dobbiamo serializzare i FormArray correttamente (già è JSON serializzabile)
      localStorage.setItem(this.localStorageKey, JSON.stringify(value));
    });
  }

  startBeforeEndValidator(form: FormGroup) {
    const start = form.get('startDate')?.value;
    const end = form.get('endDate')?.value;

    if (start && end && new Date(end) <= new Date(start)) {
      return { endBeforeStart: true };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.companySubscription?.unsubscribe();
    this.formChangesSubscription?.unsubscribe();
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

  get facebookPosts(): FormArray {
    return this.campaignForm.get('facebookPosts') as FormArray;
  }

  createFacebookPost(post: any = {}): FormGroup {
    return this.fb.group({
      aiGeneratedContent: [post.aiGeneratedContent || ''],
      aiSummary: [post.aiSummary || ''],
      aiKeywords: [post.aiKeywords || ''],
      scheduledDate: [post.scheduledDate ? new Date(post.scheduledDate).toISOString().substring(0, 16) : '']
    });
  }

  setPostsInForm(response: any): void {
    const facebookPosts = response.facebookPosts || [];

    const fbFormArray = this.fb.array(
      facebookPosts.map((post: any) => this.createFacebookPost(post))
    );

    this.campaignForm.setControl('facebookPosts', fbFormArray);
  }

  addFacebookPost() {
    this.facebookPosts.push(this.createFacebookPost());
  }

  removeFacebookPost(index: number) {
    this.facebookPosts.removeAt(index);
  }

  generateAIContent(): void {
    const prompt = this.campaignForm.get('aiContentPrompt')?.value;
    if (!prompt?.trim()) return;

    const startDate = this.campaignForm.get('startDate')?.value;
    const endDate = this.campaignForm.get('endDate')?.value;

    let days = 1;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }

    this.loading = true;
    this.loader.startLoader(60000); // 60 secondi di timeout per le chiamate AI
    let channels = this.campaignForm.get('channels')?.value || [];
    let postPerDays = this.campaignForm.get('numberPosts')?.value || 0;

    this.aiService.generateAiCampaignContent(prompt, channels, postPerDays, startDate, endDate).subscribe({
      next: (res) => {
        this.setPostsInForm(res);
        this.loader.stopLoader();
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore AI:', err);
        this.loader.stopLoader();
        this.loading = false;
      }
    });
  }
  callGiveExperience(action: string): void {
    if (this.currentUser) {
      this.experienceService.giveExperience(this.currentUser?.uuid, action).subscribe({
        next: (res) => {
          console.log('Esperienza aggiunta con successo');
          this.experienceStateService.setExperience(res);
        },
        error: (err) => {
          console.error('Errore durante l\'aggiunta dell\'esperienza:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) return;

    const data = this.campaignForm.value;
    console.log('Campagna da salvare:', data);

    const saveData: CreateCampaignRequest = {
      companyUuid: data.companyUuid,
      name: data.name,
      description: data.description,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      budget: data.budget,
      status: data.status,
      channels: JSON.stringify(data.channels),
      facebookPosts: data.facebookPosts,
      instagramPosts: data.instagramPosts,
    };

    this.campaignService.createCampaign(saveData).subscribe({
      next: (campaign) => {
        console.log('Campagna creata con successo:', campaign);
        this.toast.success('Campagna creata con successo', 'Successo');
        this.campaignForm.reset();
        this.channels = [];
        //Add experience to user
        this.callGiveExperience('create_campaign');
        localStorage.removeItem(this.localStorageKey); // pulisco i dati salvati
      },
      error: (err) => {
        console.error('Errore durante la creazione della campagna:', err);
        this.toast.error('Errore durante la creazione della campagna', 'Errore');
      }
    });
  }
}
