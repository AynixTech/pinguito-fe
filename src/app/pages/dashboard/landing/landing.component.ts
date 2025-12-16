import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  userName = 'George';

  stats = [
    { label: 'Contatti Totali', value: '80,000', icon: 'fa-users', color: 'rgb(36 75 237)', colorInner: '#4263EB' },
    { label: 'Città Coperte', value: '150+', icon: 'fa-map-marker-alt', color: '#F76707', colorInner: 'rgb(243 128 52)' },
    {
      label: 'Email Inviate', value: '5,200', icon: 'fa-paper-plane', color: '#7950F2', colorInner: 'rgb(131 102 219)'
    },
    { label: 'Email Cliccate', value: '3,200', icon: 'fa-envelope-open', color: '#4CAF50', colorInner: 'rgb(109 187 113)' }

  ];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  openRateData = [250, 300, 290, 310, 290, 330, 310, 330, 320, 340, 360, 310];
  ctrData = [200, 250, 230, 240, 220, 250, 240, 260, 250, 270, 280, 260];
  bounceRateData = [300, 350, 270, 310, 280, 340, 300, 320, 310, 330, 350, 300];


  campaigns = [
    { email: "Scopri le nostre offerte", title: 'Promo Pasqua', city: 'Milano', date: '15/04/2025 14:30', status: 'Inviata', emailsSent: 57200, emailsOpened: 31 },
    { email: "Sconto 20% su tutti i prodotti", title: 'Promo Estate', city: 'Roma', date: '10/04/2025 09:00', status: 'Inviata', emailsSent: 7200, emailsOpened: 42 },
    { email: "Ultimi giorni per il Black Friday", title: 'Black Friday', city: 'Napoli', date: '05/04/2025 12:15', status: 'Inviata', emailsSent: 6800, emailsOpened: 37 },
    { email: "Nuovi arrivi in negozio", title: 'Promo Primavera', city: 'Torino', date: '01/04/2025 10:45', status: 'Inviata', emailsSent: 7900, emailsOpened: 46 },
    { email: "Sconto 50% su tutti i prodotti", title: 'Promo Inverno', city: 'Firenze', date: '20/04/2025 16:30', status: 'Inviata', emailsSent: 8800, emailsOpened: 53 },
    { email: "Ultimi giorni per il Black Friday", title: 'Black Friday', city: 'Napoli', date: '05/04/2025 13:00', status: 'Inviata', emailsSent: 6300, emailsOpened: 34 },
    { email: "Nuovi arrivi in negozio", title: 'Promo Primavera', city: 'Torino', date: '01/04/2025 11:00', status: 'Inviata', emailsSent: 8100, emailsOpened: 47 },
    { email: "Sconto 50% su tutti i prodotti", title: 'Promo Inverno', city: 'Firenze', date: '20/04/2025 17:45', status: 'Inviata', emailsSent: 9000, emailsOpened: 54 }
  ];
}
