import { Component, input, output } from '@angular/core';

export type CtaDockAction = 'email' | 'sms' | 'call' | 'top';

@Component({
  selector: 'bretta-cta-dock',
  template: `
    <div class="fixed right-6 bottom-6 z-[60] grid grid-cols-2 gap-3 md:hidden">
      <a
        [attr.href]="emailHref()"
        aria-label="Email Bretta"
        (click)="emitAction('email')"
        class="flex size-14 items-center justify-center rounded-full border border-white/15 bg-[#190d28]/90 text-white shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-[#221136]/95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5"
          aria-hidden="true"
        >
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </a>

      <a
        [attr.href]="smsHref()"
        aria-label="Text Bretta"
        (click)="emitAction('sms')"
        class="flex size-14 items-center justify-center rounded-full border border-white/15 bg-[#190d28]/90 text-white shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-[#221136]/95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </a>

      <a
        [attr.href]="callHref()"
        aria-label="Call Bretta"
        (click)="emitAction('call')"
        class="flex size-14 items-center justify-center rounded-full border border-white/15 bg-[#190d28]/90 text-white shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-[#221136]/95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92Z" />
        </svg>
      </a>

      <button
        type="button"
        aria-label="Back to top"
        (click)="emitAction('top')"
        class="flex size-14 items-center justify-center rounded-full border border-white/15 bg-[#190d28]/90 text-white shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-[#221136]/95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </div>
  `,
  styles: [],
})
export class CtaDock {
  readonly emailHref = input.required<string>();
  readonly smsHref = input.required<string>();
  readonly callHref = input.required<string>();

  readonly actionTriggered = output<CtaDockAction>();

  protected emitAction(action: CtaDockAction): void {
    this.actionTriggered.emit(action);
  }
}