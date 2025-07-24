import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  languages = [
    { code: 'en', label: 'English', translation: 'Inglese', flag: '🇬🇧' },
    { code: 'it', label: 'Italiano', translation: 'Italiano', flag: '🇮🇹' },
    { code: 'es', label: 'Español', translation: 'Spagnolo', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', translation: 'Francese', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', translation: 'Tedesco', flag: '🇩🇪' },
    { code: 'pt', label: 'Português', translation: 'Portoghese', flag: '🇵🇹' },
    { code: 'zh', label: '中文', translation: 'Cinese', flag: '🇨🇳' }
  ];

  selectedLang = 'it';
  isModalOpen = false;
  isBrowser: boolean;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('selectedLanguage');
      this.setLanguage(savedLang ?? 'it');
    } else {
      this.setLanguage('it');
    }
  }

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }

  setLanguage(lang: string): void {
    this.selectedLang = lang;
    if (this.isBrowser) {
      localStorage.setItem('selectedLanguage', lang);
    }
    this.translate.use(lang);
    console.log(`Language set to: ${lang}`);
    this.isModalOpen = false;
  }
}
