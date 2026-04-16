import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { CtaDock, CtaDockAction } from './components/cta-dock/cta-dock';
import { BackToTop } from './components/button/back-to-top/back-to-top';
import { AnalyticsService } from './core/analytics/analytics.service';

@Component({
  selector: 'bretta-root',
  imports: [RouterOutlet, Header, Footer, CtaDock, BackToTop],
  template: `
    @if (showBrettaChrome()) {
      <bretta-header />
    }

    <main class="relative z-0 min-h-screen bg-black text-white">
      <router-outlet />
    </main>

    @if (showBrettaChrome()) {
      <div class="md:hidden">
        <bretta-cta-dock
          [emailHref]="dockEmailHref"
          [smsHref]="dockSmsHref"
          [callHref]="dockCallHref"
          (actionTriggered)="handleDockAction($event)"
        />
      </div>

      <div class="hidden md:block">
        <bretta-back-to-top />
      </div>

      <bretta-footer />
    }
  `,
  styles: [],
})
export class App {
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);
  private readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly dockEmailHref = this.buildEmailHref();
  protected readonly dockSmsHref = this.buildSmsHref();
  protected readonly dockCallHref = 'tel:+15195214260';
  protected readonly showBrettaChrome = computed(
    () => !this.currentPath().startsWith('/restaurants/'),
  );

  protected handleDockAction(action: CtaDockAction): void {
    switch (action) {
      case 'email':
        this.analytics.trackEmailClick('cta-dock');
        return;

      case 'sms':
        this.trackSmsClick();
        return;

      case 'call':
        this.analytics.trackCallClick('cta-dock');
        return;

      case 'top':
        this.scrollToTop();
        return;
    }
  }

  private scrollToTop(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  private buildEmailHref(): string {
    const subject = encodeURIComponent('Project inquiry — bretta.io');
    const body = encodeURIComponent(
      [
        'Hi bretta.io,',
        '',
        "I'm reaching out about improving our digital presence and commercial performance.",
        '',
        'Company:',
        'Website:',
        'Main problem:',
        'Desired outcome:',
        'Timeline:',
        '',
        'Best,',
      ].join('\n')
    );

    return `mailto:etc@bretta.io?subject=${subject}&body=${body}`;
  }

  private buildSmsHref(): string {
    const body = encodeURIComponent(
      'Hi Bretta, would love to chat shop about my online presence'
    );

    return `sms:+15195214260?&body=${body}`;
  }

  private trackSmsClick(): void {
    const smsAwareAnalytics = this.analytics as AnalyticsService & {
      trackTextClick?: (source: string) => void;
    };

    smsAwareAnalytics.trackTextClick?.('cta-dock');
  }
}
