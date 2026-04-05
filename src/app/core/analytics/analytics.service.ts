import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: [command: string, ...params: unknown[]]) => void;
  }
}

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  trackPageView(path: string): void {
    if (!isPlatformBrowser(this.platformId) || !window.gtag) {
      return;
    }

    const pageLocation = `${window.location.origin}${path}`;
    const pageTitle = this.title.getTitle() || this.document.title || 'bretta.io';

    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: path,
    });
  }

  trackCallClick(location: string): void {
    this.trackEvent('select_content', {
      content_type: 'cta',
      content_id: 'call-now',
      cta_label: 'Call now',
      cta_location: location,
      contact_method: 'phone',
    });
  }

  trackEmailClick(location: string): void {
    this.trackEvent('select_content', {
      content_type: 'cta',
      content_id: 'email-now',
      cta_label: 'Email now',
      cta_location: location,
      contact_method: 'email',
    });
  }

  trackLeadGenerated(source = 'project-inquiry'): void {
    this.trackEvent('generate_lead', {
      form_name: source,
    });
  }

  trackEvent(name: string, params: AnalyticsParams = {}): void {
    if (!isPlatformBrowser(this.platformId) || !window.gtag) {
      return;
    }

    window.gtag('event', name, params);
  }
}