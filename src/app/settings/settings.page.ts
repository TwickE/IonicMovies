import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonListHeader, IonList, IonItem, IonToggle } from '@ionic/angular/standalone';
import { Theme } from '../services/theme';
import { take } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonToggle, IonItem, IonList, IonListHeader, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  paletteToggle = false;
  deviceThemeToggle = false;
  private themeService = inject(Theme);

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.paletteToggle = isDark;
    });
    this.deviceThemeToggle = this.themeService.getUseDeviceThemeValue();
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
}
