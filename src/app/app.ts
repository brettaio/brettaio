import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { BackToTop } from './components/button/back-to-top/back-to-top';
import { AnalyticsService } from './core/analytics/analytics.service';

@Component({
  selector: 'bretta-root',
  imports: [RouterOutlet, Header, Footer, BackToTop],
  template: `
    <bretta-header />

    <main class="relative z-0 min-h-screen bg-black text-white">
      <router-outlet />
    </main>

    <bretta-footer />
    <bretta-back-to-top />
  `,
  styles: [],
})
export class App {
  private readonly analytics = inject(AnalyticsService);
}