import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Theme } from './services/theme';
import { Language } from './services/language';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private themeService = inject(Theme);
  private languageService = inject(Language);

  constructor() {
    this.themeService.initializeTheme();
    this.languageService.initializeLanguage();
  }
}
