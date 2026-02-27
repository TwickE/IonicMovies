import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonListHeader, IonList, IonItem, IonToggle, IonRadioGroup, IonRadio } from '@ionic/angular/standalone';
import { Theme } from '../services/theme';
import { take } from 'rxjs';
import { TranslatePipe, TranslateDirective } from "@ngx-translate/core";
import { Language } from '../services/language';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonRadio, IonRadioGroup, IonToggle, IonItem, IonList, IonListHeader, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslatePipe, TranslateDirective]
})
export class SettingsPage implements OnInit {
  paletteToggle = false;
  deviceThemeToggle = false;
  currentLanguage: 'en' | 'pt' = 'en';
  private themeService = inject(Theme);
  private languageService = inject(Language);

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.paletteToggle = isDark;
    });
    this.deviceThemeToggle = this.themeService.getUseDeviceThemeValue();
    this.currentLanguage = this.languageService.getCurrentLanguage() as 'en' | 'pt';
  }

  toggleChange(event: CustomEvent) {
    if (this.deviceThemeToggle) return;

    const isDark = !!event.detail.checked;
    this.themeService.setTheme(isDark);
  }

  toggleDeviceTheme(event: CustomEvent) {
    const useDevice = !!event.detail.checked;
    this.themeService.setUseDeviceTheme(useDevice);

    if (useDevice) {
      this.themeService.darkMode$.pipe(take(1)).subscribe(v => this.paletteToggle = v);
    }
  }

  changeLanguage(event: CustomEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if(value !== 'en' && value !== 'pt') {
      return
    } else {
      this.languageService.setLanguage(value);
    }
  }
}
