import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

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
export class App {}