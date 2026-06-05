import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AnalyticsService } from '../../core/analytics/analytics.service';

type ContactResponse = {
  ok: boolean;
  error?: string;
};

type ConversationOption = {
  value: string;
  label: string;
  copy: string;
};

@Component({
  selector: 'bretta-lead-form',
  template: `
    <section id="project-inquiry-panel" class="bg-[#14081f] px-6 py-24 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <div
          class="rounded-3xl border border-white/10 bg-[#1b0b2d]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 lg:p-10"
        >
          <div class="max-w-3xl">
            <p class="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
              Start a conversation
            </p>

            <h2 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Building systems where people belong.
            </h2>

            <p class="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              I work at the intersection of belonging, leadership, community
              design, and technology — helping people and organizations build
              systems people want to stay inside.
            </p>
          </div>

          <div class="mt-10 grid gap-4 md:grid-cols-2">
            @for (option of conversationOptions; track option.value) {
              <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 class="text-base font-semibold text-white">
                  {{ option.label }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-white/60">
                  {{ option.copy }}
                </p>
              </div>
            }
          </div>

          <form
            id="belonging-systems-form"
            name="belonging-systems-conversation"
            (submit)="onSubmit($event)"
            class="mt-10 border-t border-white/10 pt-10"
          >
            <input type="hidden" name="formName" value="belonging-systems-conversation" />

            <p class="hidden">
              <label>
                Do not fill this out if you're human:
                <input name="bot-field" tabindex="-1" autocomplete="off" />
              </label>
            </p>

            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div>
                <label for="name" class="block text-sm font-medium text-white">
                  Name
                </label>
                <div class="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autocomplete="name"
                    required
                    placeholder="Your name"
                    class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-white">
                  Email
                </label>
                <div class="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    placeholder="you@example.com"
                    class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                  />
                </div>
              </div>

              <div>
                <label for="role" class="block text-sm font-medium text-white">
                  Your context
                </label>
                <div class="mt-2">
                  <input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="Coach, parent, founder, leader, builder..."
                    class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                  />
                </div>
              </div>

              <div>
                <label for="interest" class="block text-sm font-medium text-white">
                  What do you want to talk about?
                </label>
                <div class="mt-2 grid grid-cols-1">
                  <select
                    id="interest"
                    name="interest"
                    required
                    class="col-start-1 row-start-1 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-base text-white outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95] *:bg-[#1b0b2d]"
                  >
                    <option value="">Select one</option>
                    <option value="belonging-coaching-team-culture">
                      Belonging, coaching, or team culture
                    </option>
                    <option value="software-product-system">
                      A software product or technical system
                    </option>
                    <option value="workplace-community-leadership">
                      A workplace, community, or leadership problem
                    </option>
                    <option value="writing-research-collaboration">
                      Writing, research, or collaboration
                    </option>
                    <option value="something-else">
                      Something else
                    </option>
                  </select>

                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                    class="pointer-events-none col-start-1 row-start-1 mr-4 size-5 self-center justify-self-end text-white/45"
                  >
                    <path
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="message" class="block text-sm font-medium text-white">
                  What is the shape of the conversation?
                </label>
                <div class="mt-2">
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    required
                    placeholder="Tell me what you're seeing, building, trying to understand, or trying to repair. It can be about people, teams, sport, leadership, community, software, systems, or the space between them."
                    class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                  ></textarea>
                </div>
              </div>
            </div>

            @if (submitError()) {
              <div
                class="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100"
              >
                {{ submitError() }}
              </div>
            }

            <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
              <p class="max-w-xl text-sm leading-6 text-white/60">
                No pitch funnel. No automated reply pretending to be personal.
                Send the real context and I’ll reply directly.
              </p>

              <button
                type="submit"
                [disabled]="isSubmitting()"
                class="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ isSubmitting() ? 'Sending…' : 'Start conversation' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class LeadForm {
  private readonly analytics = inject(AnalyticsService);
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal('');

  protected readonly conversationOptions: ConversationOption[] = [
    {
      value: 'belonging-performance',
      label: 'Belonging & performance',
      copy: 'How confidence, trust, participation, and connection shape the way people grow and stay.',
    },
    {
      value: 'systems-technology',
      label: 'Systems & technology',
      copy: 'Software, workflows, platforms, and operational tools designed around the humans using them.',
    },
    {
      value: 'leadership-communication',
      label: 'Leadership & communication',
      copy: 'The invisible dynamics that influence motivation, inclusion, repair, and team culture.',
    },
    {
      value: 'writing-research',
      label: 'Writing & research',
      copy: 'Ideas from sport, parenting, business, leadership, software, and personal growth.',
    },
  ];

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement | null;

    if (!form || this.isSubmitting()) {
      return;
    }

    this.submitError.set('');

    if (!form.reportValidity()) {
      this.analytics.trackEvent('contact_form_validation_error', {
        form_name: 'belonging-systems-conversation',
      });
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    this.analytics.trackEvent('contact_form_submit_attempt', {
      form_name: 'belonging-systems-conversation',
    });

    this.isSubmitting.set(true);

    this.http
      .post<ContactResponse>('/api/contact', payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          if (!response.ok) {
            this.submitError.set('Something went wrong. Please try again.');
            this.analytics.trackEvent('contact_form_submit_error', {
              form_name: 'belonging-systems-conversation',
              error_type: response.error || 'unknown',
            });
            return;
          }

          this.analytics.trackLeadGenerated('belonging-systems-conversation');
          void this.router.navigateByUrl('/thank-you');
        },
        error: () => {
          this.submitError.set(
            'The message could not be sent right now. Please try again shortly.',
          );
          this.analytics.trackEvent('contact_form_submit_error', {
            form_name: 'belonging-systems-conversation',
            error_type: 'request_failed',
          });
        },
      });
  }
}
