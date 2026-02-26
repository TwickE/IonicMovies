import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  public readonly PREF_KEY = 'themePreference';
  public readonly DEVICE_THEME_KEY = 'useDeviceTheme';

  private prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // note: we don't create the subject inline any more, we call a helper
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public darkMode$ = this.darkModeSubject.asObservable();

  private useDeviceTheme = this.getUseDeviceTheme();

  constructor() {
    this.initializeTheme();           // apply the class once
    this.setupDeviceThemeListener();  // keep following the system if requested
  }

  /** called from ctor */
  private getInitialTheme(): boolean {
    if (this.getUseDeviceTheme()) {
      // device‑theme toggle is on → always follow the system preference
      return this.prefersDark.matches;
    }
    // otherwise fall back to whatever the user explicitly chose (or system default)
    const stored = localStorage.getItem(this.PREF_KEY);
    if (stored === 'dark') {
      return true;
    } else if (stored === 'light') {
      return false;
    }
    return this.prefersDark.matches;
  }

  private getUseDeviceTheme(): boolean {
    return localStorage.getItem(this.DEVICE_THEME_KEY) === 'true';
  }

  private setupDeviceThemeListener() {
    this.prefersDark.addEventListener('change', (m) => {
      if (this.useDeviceTheme) {
        this.darkModeSubject.next(m.matches);
        document.documentElement.classList.toggle('ion-palette-dark', m.matches);
      }
    });
  }

  initializeTheme() {
    const isDark = this.darkModeSubject.value;
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  setTheme(isDark: boolean) {
    localStorage.setItem(this.PREF_KEY, isDark ? 'dark' : 'light');
    this.darkModeSubject.next(isDark);
    // turning off device‑theme when user picks manually
    this.useDeviceTheme = false;
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  setUseDeviceTheme(useDevice: boolean) {
    this.useDeviceTheme = useDevice;
    localStorage.setItem(this.DEVICE_THEME_KEY, useDevice ? 'true' : 'false');

    if (useDevice) {                            // switch immediately
      const isDark = this.prefersDark.matches;
      this.darkModeSubject.next(isDark);
      document.documentElement.classList.toggle('ion-palette-dark', isDark);
    }
  }

  getUseDeviceThemeValue(): boolean {
    return this.useDeviceTheme;
  }
}