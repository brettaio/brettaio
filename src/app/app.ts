import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { AnalyticsService } from './core/analytics/analytics.service';

@Component({
  selector: 'bretta-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <bretta-header />

    <main class="relative z-0 min-h-screen bg-black text-white">
      <router-outlet />
    </main>

    <bretta-footer />
  `,
  styles: [],
})
export class App {
  private readonly analytics = inject(AnalyticsService);
}