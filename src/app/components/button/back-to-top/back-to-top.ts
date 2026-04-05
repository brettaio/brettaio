import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'bretta-back-to-top',
  imports: [MatIconModule],
  template: `
    @if (isVisible()) {
      <button
        type="button"
        (click)="scrollToTop()"
        aria-label="Back to top"
        class="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#1b0b2d]/90 text-white shadow-2xl shadow-black/30 backdrop-blur-md transition hover:bg-[#2a1240] hover:border-white/20 active:scale-95 sm:bottom-6 sm:right-6"
      >
        <mat-icon aria-hidden="true" svgIcon="arrow-upward"></mat-icon>
      </button>
    }
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTop {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly scrollY = signal(0);
  protected readonly isVisible = computed(() => this.scrollY() > 480);

  constructor() {
    this.registerIcons();

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const onScroll = (): void => {
        this.scrollY.set(window.scrollY || 0);
      };

      onScroll();

      window.addEventListener('scroll', onScroll, { passive: true });

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
      });
    });
  }

  protected scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  private registerIcons(): void {
    this.iconRegistry.addSvgIconLiteral(
      'arrow-upward',
      this.sanitizer.bypassSecurityTrustHtml(`
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 19V5M5 12l7-7 7 7"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      `)
    );
  }
}