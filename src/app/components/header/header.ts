import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bretta-header',
  imports: [RouterLink],
  template: `
    <header class="fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav
        aria-label="Global"
        class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <!--
          BRAND / HOME LINK

          Keep the header simple for now:
          - no extra route links
          - no mobile drawer
          - just the bretta.io mark routing back to "/"
        -->
        <a routerLink="/" class="-m-1.5 p-1.5">
          <span class="sr-only">bretta.io</span>

          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-semibold text-gray-900"
            >
              B
            </div>

            <span class="text-sm font-semibold tracking-tight text-white">
              bretta.io
            </span>
          </div>
        </a>
      </nav>
    </header>
  `,
  styles: [],
})
export class Header {}