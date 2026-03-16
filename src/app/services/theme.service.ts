import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = new BehaviorSubject<Theme>(
    (localStorage.getItem('sc-theme') as Theme) || 'dark'
  );
  theme$ = this._theme.asObservable();

  get current(): Theme { return this._theme.getValue(); }
  get isDark(): boolean { return this._theme.getValue() === 'dark'; }

  toggle(): void {
    const next: Theme = this.isDark ? 'light' : 'dark';
    this._theme.next(next);
    localStorage.setItem('sc-theme', next);
    this.applyToDocument(next);
  }

  init(): void { this.applyToDocument(this.current); }

  private applyToDocument(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
