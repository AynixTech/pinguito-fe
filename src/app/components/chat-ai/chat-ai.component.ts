import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthStoreService } from '@services/auth-store.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface NavigationSuggestion {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.scss']
})
export class ChatAiComponent implements OnInit, OnDestroy {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  userName = '';
  userRole = '';
  isTyping = false;
  private destroy$ = new Subject<void>();

  // Knowledge base per diversi ruoli
  private navigationMap = new Map<string, NavigationSuggestion[]>([
    ['admin', [
      { label: 'Gestione Utenti', route: '/dashboard/users/list-users', icon: 'fa-users' },
      { label: 'Gestione Aziende', route: '/dashboard/companies/list-companies', icon: 'fa-building' },
      { label: 'Tutte le Campagne', route: '/dashboard/campaigns/list-campaigns', icon: 'fa-bullhorn' },
      { label: 'Email Campaigns', route: '/dashboard/email-campaigns/list', icon: 'fa-envelope' },
      { label: 'Contatti', route: '/dashboard/contacts/list-contacts', icon: 'fa-address-book' },
      { label: 'Logs di Sistema', route: '/dashboard/logs', icon: 'fa-list-alt' },
      { label: 'Profilo', route: '/dashboard/profile/my-profile', icon: 'fa-user-circle' }
    ]],
    ['monitoring', [
      { label: 'Dashboard', route: '/dashboard', icon: 'fa-chart-line' },
      { label: 'Campagne Assegnate', route: '/dashboard/campaigns/list-campaigns', icon: 'fa-bullhorn' },
      { label: 'Email Campaigns', route: '/dashboard/email-campaigns/list', icon: 'fa-envelope' },
      { label: 'Contatti', route: '/dashboard/contacts/list-contacts', icon: 'fa-address-book' },
      { label: 'Profilo', route: '/dashboard/profile/my-profile', icon: 'fa-user-circle' }
    ]],
    ['user', [
      { label: 'Dashboard', route: '/dashboard', icon: 'fa-chart-line' },
      { label: 'Le Mie Campagne', route: '/dashboard/campaigns/list-campaigns', icon: 'fa-bullhorn' },
      { label: 'Email Marketing', route: '/dashboard/email-campaigns/list', icon: 'fa-envelope' },
      { label: 'Profilo', route: '/dashboard/profile/my-profile', icon: 'fa-user-circle' }
    ]]
  ]);

  // Keywords per il routing intelligente
  private keywordRouting = {
    'campagna|campagne|campaign': '/dashboard/campaigns/list-campaigns',
    'email|mail|posta': '/dashboard/email-campaigns/list',
    'contatto|contatti|contact': '/dashboard/contacts/list-contacts',
    'utente|utenti|user': '/dashboard/users/list-users',
    'azienda|aziende|company|companies': '/dashboard/companies/list-companies',
    'profilo|profile|account': '/dashboard/profile/my-profile',
    'log|logs|registro': '/dashboard/logs',
    'dashboard|home|principale': '/dashboard',
    'social|facebook|instagram|tiktok': '/dashboard/campaigns/list-campaigns'
  };

  constructor(
    private authStoreService: AuthStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authStoreService.auth$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state && state.user) {
        this.userName = state.user.name || 'Utente';
        this.userRole = state.user.role?.name?.toLowerCase() || 'user';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.addWelcomeMessage();
    }
  }

  private addWelcomeMessage(): void {
    const greetings = [
      `Ciao ${this.userName}! 👋 Come posso aiutarti oggi?`,
      `Benvenuto ${this.userName}! Sono qui per guidarti nella piattaforma.`,
      `Ciao ${this.userName}! Hai bisogno di trovare qualcosa?`
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    this.messages.push({
      text: randomGreeting,
      isUser: false,
      timestamp: new Date(),
      suggestions: this.getQuickSuggestions()
    });
  }

  private getQuickSuggestions(): string[] {
    const suggestions: { [key: string]: string[] } = {
      'admin': [
        'Gestisci utenti',
        'Visualizza campagne',
        'Controlla logs',
        'Gestisci aziende'
      ],
      'monitoring': [
        'Visualizza dashboard',
        'Gestisci campagne',
        'Visualizza contatti',
        'Email marketing'
      ],
      'user': [
        'Crea campagna',
        'Invia email',
        'Visualizza statistiche',
        'Modifica profilo'
      ]
    };

    return suggestions[this.userRole] || suggestions['user'];
  }

  sendMessage(): void {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput) return;

    // Aggiungi messaggio utente
    this.messages.push({
      text: trimmedInput,
      isUser: true,
      timestamp: new Date()
    });

    this.userInput = '';
    this.isTyping = true;

    // Simula typing delay
    setTimeout(() => {
      this.processUserMessage(trimmedInput);
      this.isTyping = false;
      this.scrollToBottom();
    }, 800);
  }

  private processUserMessage(message: string): void {
    const lowerMessage = message.toLowerCase();
    let response = '';
    let route: string | null = null;
    let suggestions: string[] = [];

    // Saluti
    if (lowerMessage.match(/ciao|buongiorno|buonasera|salve|hey/i)) {
      response = `Ciao ${this.userName}! Come posso esserti utile?`;
      suggestions = this.getQuickSuggestions();
    }
    // Aiuto generale
    else if (lowerMessage.match(/aiuto|help|cosa puoi fare/i)) {
      response = this.getHelpMessage();
      suggestions = this.getQuickSuggestions();
    }
    // Cerca route basato su keywords
    else {
      const foundRoute = this.findRouteByKeywords(lowerMessage);
      if (foundRoute) {
        route = foundRoute;
        response = this.getNavigationResponse(foundRoute);
      } else {
        response = this.getSmartResponse(lowerMessage);
        suggestions = this.getQuickSuggestions();
      }
    }

    this.messages.push({
      text: response,
      isUser: false,
      timestamp: new Date(),
      suggestions: suggestions
    });

    if (route) {
      setTimeout(() => {
        this.navigateTo(route!);
      }, 1500);
    }
  }

  private findRouteByKeywords(message: string): string | null {
    for (const [keywords, route] of Object.entries(this.keywordRouting)) {
      const regex = new RegExp(keywords, 'i');
      if (regex.test(message)) {
        return route;
      }
    }
    return null;
  }

  private getNavigationResponse(route: string): string {
    const responses: { [key: string]: string } = {
      '/dashboard/campaigns/list-campaigns': 'Ti porto alla sezione campagne! 🚀',
      '/dashboard/email-campaigns/list': 'Apro la sezione email marketing! 📧',
      '/dashboard/contacts/list-contacts': 'Ti mostro i contatti! 📇',
      '/dashboard/users/list-users': 'Accedo alla gestione utenti! 👥',
      '/dashboard/companies/list-companies': 'Ti porto alle aziende! 🏢',
      '/dashboard/profile/my-profile': 'Apro il tuo profilo! 👤',
      '/dashboard/logs': 'Visualizzo i logs di sistema! 📋',
      '/dashboard': 'Ti riporto alla dashboard principale! 📊'
    };

    return responses[route] || 'Ti porto lì! ✨';
  }

  private getSmartResponse(message: string): string {
    if (message.match(/crea|nuov|aggiungi/i)) {
      if (message.match(/campagna/i)) {
        return 'Per creare una nuova campagna, vai su Campagne e clicca su "Crea Campagna". Vuoi che ti porti lì?';
      }
      if (message.match(/email/i)) {
        return 'Per inviare una nuova email, visita la sezione Email Campaigns!';
      }
    }

    if (message.match(/statistiche|dati|report|analytics/i)) {
      return 'Le statistiche sono disponibili nella Dashboard principale! Ti porto lì?';
    }

    if (message.match(/permessi|accesso|autorizzazione/i)) {
      return `Come utente con ruolo "${this.userRole}", hai accesso a: ${this.getAvailableSections()}`;
    }

    return `Non sono sicuro di aver capito. Ecco alcune cose che posso fare per te:
    
• Guidarti alle diverse sezioni
• Spiegare le funzionalità
• Mostrarti dove fare determinate azioni

Prova a chiedermi qualcosa di più specifico! 😊`;
  }

  private getHelpMessage(): string {
    return `Sono il tuo assistente virtuale! Posso aiutarti a:

✨ Navigare nella piattaforma
📍 Trovare sezioni specifiche
💡 Capire dove fare determinate azioni
🔍 Rispondere a domande sulla piattaforma

Come utente **${this.userRole}**, hai accesso a:
${this.getAvailableSections()}

Chiedimi qualsiasi cosa! 🚀`;
  }

  private getAvailableSections(): string {
    const sections = this.navigationMap.get(this.userRole) || [];
    return sections.map(s => `• ${s.label}`).join('\n');
  }

  useSuggestion(suggestion: string): void {
    this.userInput = suggestion;
    this.sendMessage();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    setTimeout(() => {
      this.isOpen = false;
    }, 500);
  }

  clearChat(): void {
    this.messages = [];
    this.addWelcomeMessage();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatBody = document.querySelector('.chat-messages');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 100);
  }
}
