import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  features = [
    {
      icon: '📊',
      title: 'Analisi Avanzate',
      description: 'Dashboard intuitive con metriche in tempo reale per monitorare le performance delle tue campagne.'
    },
    {
      icon: '🎯',
      title: 'Targeting Preciso',
      description: 'Raggiungi il pubblico giusto al momento giusto con strumenti di segmentazione avanzati.'
    },
    {
      icon: '🤖',
      title: 'Automazione AI',
      description: 'Ottimizza le tue campagne con algoritmi di intelligenza artificiale e machine learning.'
    },
    {
      icon: '📱',
      title: 'Multi-Piattaforma',
      description: 'Gestisci campagne su Facebook, Instagram, TikTok e altre piattaforme da un\'unica dashboard.'
    },
    {
      icon: '💰',
      title: 'ROI Ottimizzato',
      description: 'Massimizza il ritorno sull\'investimento con strumenti di budget management intelligenti.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Collabora con il tuo team in tempo reale con permessi e ruoli personalizzati.'
    }
  ];

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
