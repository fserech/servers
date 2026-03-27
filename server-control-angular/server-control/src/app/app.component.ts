import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from './services/toast.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  toast: Toast | null = null;
  private sub!: Subscription;

  constructor(private toastService: ToastService, public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.init();
    this.sub = this.toastService.toast$.subscribe(t => this.toast = t);
  }
  ngOnDestroy() { this.sub?.unsubscribe(); }
}
