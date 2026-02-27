import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class Language {
  public readonly LANGUAGE_KEY = 'languagePreference';
  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['pt', 'en']);
    this.translate.setFallbackLang('en');
    this.initializeLanguage();
  }

  initializeLanguage() {
    const storedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
    if(storedLanguage === 'en') {
      this.translate.use('en');
    } else if( storedLanguage === 'pt') {
      this.translate.use('pt');
    } else {
      this.setLanguage('en');
    }
  }

  public setLanguage(language: 'en' | 'pt') {
    if(language === 'en') {
      localStorage.setItem(this.LANGUAGE_KEY, 'en');
      this.translate.use('en');
    } else if(language === 'pt') {
      localStorage.setItem(this.LANGUAGE_KEY, 'pt');
      this.translate.use('pt');
    }
  }

  public getCurrentLanguage() {
    return localStorage.getItem(this.LANGUAGE_KEY)!;
  }
}
