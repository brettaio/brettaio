import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type NavItem = {
  label: string;
  href: string;
};

@Component({
  selector: 'bretta-header',
  imports: [RouterLink],
  template: `
    <header class="absolute inset-x-0 top-0 z-50 bg-transparent">
      <nav
        aria-label="Global"
        class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div class="flex items-center gap-x-12">
          <a routerLink="/work" class="-m-1.5 p-1.5">
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

          <div class="hidden lg:flex lg:gap-x-12">
            @for (item of navItems; track item.href) {
              <a
                [routerLink]="item.href"
                class="text-sm/6 font-semibold text-white transition hover:text-gray-300"
              >
                {{ item.label }}
              </a>
            }
          </div>
        </div>

        <div class="flex lg:hidden">
          <button
            type="button"
            (click)="openMobileMenu()"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 transition hover:text-white"
            aria-label="Open main menu"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-controls="mobile-menu"
          >
            <span class="sr-only">Open main menu</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
              class="size-6"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="hidden lg:flex">
          <a
            routerLink="/contact"
            class="text-sm/6 font-semibold text-white transition hover:text-gray-300"
          >
            Let’s talk <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>

      @if (mobileMenuOpen()) {
        <div
          id="mobile-menu"
          class="fixed inset-0 z-50 lg:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            (click)="closeMobileMenu()"
          ></div>

          <div
            class="absolute inset-y-0 right-0 w-full overflow-y-auto bg-gray-950/95 p-6 backdrop-blur-xl sm:max-w-sm sm:ring-1 sm:ring-white/10"
            (click)="$event.stopPropagation()"
          >
            <div class="flex items-center justify-between">
              <a
                routerLink="/work"
                class="-m-1.5 p-1.5"
                (click)="closeMobileMenu()"
              >
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

              <button
                type="button"
                (click)="closeMobileMenu()"
                class="-m-2.5 rounded-md p-2.5 text-gray-300 transition hover:text-white"
                aria-label="Close menu"
              >
                <span class="sr-only">Close menu</span>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  aria-hidden="true"
                  class="size-6"
                >
                  <path
                    d="M6 18 18 6M6 6l12 12"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div class="mt-6 flow-root">
              <div class="-my-6 divide-y divide-white/10">
                <div class="space-y-2 py-6">
                  @for (item of navItems; track item.href) {
                    <a
                      [routerLink]="item.href"
                      (click)="closeMobileMenu()"
                      class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white transition hover:bg-white/5"
                    >
                      {{ item.label }}
                    </a>
                  }
                </div>

                <div class="py-6">
                  <a
                    routerLink="/contact"
                    (click)="closeMobileMenu()"
                    class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white transition hover:bg-white/5"
                  >
                    Let’s talk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [],
})
export class Header {
  protected readonly mobileMenuOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  protected openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}