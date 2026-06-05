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

@Component({
  selector: 'bretta-lead-form',
  template: `
    <section
      id="project-inquiry-panel"
      class="relative isolate overflow-hidden bg-[#05070D] px-6 py-24 text-white sm:py-32 lg:px-8"
    >
      <div class="absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute inset-x-0 top-0 h-px bg-white/25"></div>
        <div class="absolute inset-x-0 top-24 h-px bg-white/10"></div>
        <div class="absolute inset-x-0 bottom-24 h-px bg-white/10"></div>
        <div class="absolute inset-x-0 bottom-0 h-px bg-white/20"></div>
        <div class="absolute left-6 top-0 h-full w-px bg-white/10 sm:left-8"></div>
        <div class="absolute right-6 top-0 h-full w-px bg-white/10 sm:right-8"></div>
        <div class="absolute left-1/2 top-0 hidden h-full w-px bg-white/8 lg:block"></div>
        <div class="absolute left-0 top-1/2 h-px w-full bg-[#00C3FF]/16"></div>
      </div>

      <div class="mx-auto max-w-7xl">
        <div class="mb-14 max-w-5xl border-l border-white/18 pl-6">
          <p class="text-xs font-semibold uppercase tracking-[0.36em] text-[#FEA735]">
            Work with me
          </p>

          <h2 class="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            What are you trying to teach, fix, build, or understand?
          </h2>

          <p class="mt-7 max-w-3xl text-lg leading-8 text-white/68">
            Use this form if you are trying to make something clearer for people:
            a coaching idea, leadership problem, parent education resource,
            team system, service offer, workflow, website, digital product, or
            something hard to explain that needs structure.
          </p>
        </div>

        <div class="grid gap-0 overflow-hidden border border-white/12 bg-black/20 lg:grid-cols-[0.78fr_1.22fr]">
          <aside class="border-b border-white/12 bg-[#07111F] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-white/12">
            <p class="text-sm font-semibold text-white">
              I am useful when you need to:
            </p>

            <div class="mt-7 space-y-6">
              <div class="border-l border-[#00C3FF]/50 pl-5">
                <h3 class="text-base font-semibold text-white">
                  Teach something clearly
                </h3>
                <p class="mt-2 text-sm leading-6 text-white/58">
                  Turn knowledge, lived experience, or a complex idea into a
                  resource, workshop, guide, content system, or learning flow.
                </p>
              </div>

              <div class="border-l border-[#FEA735]/55 pl-5">
                <h3 class="text-base font-semibold text-white">
                  Coach through a human problem
                </h3>
                <p class="mt-2 text-sm leading-6 text-white/58">
                  Shape language, principles, frameworks, and systems around
                  leadership, sport, parenting, confidence, communication, or belonging.
                </p>
              </div>

              <div class="border-l border-[#FE7235]/55 pl-5">
                <h3 class="text-base font-semibold text-white">
                  Build the digital layer
                </h3>
                <p class="mt-2 text-sm leading-6 text-white/58">
                  Create the website, form, dashboard, workflow, tool, content
                  structure, prototype, or web application around the work.
                </p>
              </div>

              <div class="border-l border-white/25 pl-5">
                <h3 class="text-base font-semibold text-white">
                  Understand what is actually broken
                </h3>
                <p class="mt-2 text-sm leading-6 text-white/58">
                  Diagnose the friction before building the wrong solution faster.
                </p>
              </div>
            </div>
          </aside>

          <form
            id="belonging-systems-form"
            name="belonging-systems-conversation"
            (submit)="onSubmit($event)"
            class="bg-[#FCF5EF] p-5 text-[#07111F] sm:p-7 lg:p-9"
          >
            <input
              type="hidden"
              name="formName"
              value="belonging-systems-conversation"
            />

            <p class="hidden">
              <label>
                Do not fill this out if you're human:
                <input name="bot-field" tabindex="-1" autocomplete="off" />
              </label>
            </p>

            <div class="flex flex-col gap-3 border-b border-[#07111F]/12 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#0077FF]">
                  Start here
                </p>
                <h3 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Start with the situation.
                </h3>
              </div>

              <p class="max-w-sm text-sm leading-6 text-[#26384F]">
                Share what exists, what is not working, who it affects, and what you want to make possible.
              </p>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-[#07111F]/15 sm:grid-cols-2">
              <div class="border-b border-[#07111F]/12 bg-white px-5 py-4 sm:border-r">
                <label for="name" class="block text-sm font-semibold">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  required
                  placeholder="Your name"
                  class="mt-2 block w-full border-0 bg-transparent px-0 py-2.5 text-base text-[#07111F] outline-none placeholder:text-[#607089] focus:ring-0"
                />
              </div>

              <div class="border-b border-[#07111F]/12 bg-white px-5 py-4">
                <label for="email" class="block text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  placeholder="you@example.com"
                  class="mt-2 block w-full border-0 bg-transparent px-0 py-2.5 text-base text-[#07111F] outline-none placeholder:text-[#607089] focus:ring-0"
                />
              </div>

              <div class="border-b border-[#07111F]/12 bg-white px-5 py-4 sm:border-r">
                <label for="phone" class="block text-sm font-semibold">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autocomplete="tel"
                  required
                  placeholder="Your phone number"
                  class="mt-2 block w-full border-0 bg-transparent px-0 py-2.5 text-base text-[#07111F] outline-none placeholder:text-[#607089] focus:ring-0"
                />
              </div>

              <div class="border-b border-[#07111F]/12 bg-white px-5 py-4">
                <label for="role" class="block text-sm font-semibold">
                  You are a...
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="Coach, founder, parent, leader, operator..."
                  class="mt-2 block w-full border-0 bg-transparent px-0 py-2.5 text-base text-[#07111F] outline-none placeholder:text-[#607089] focus:ring-0"
                />
              </div>

              <div class="bg-white px-5 py-4 sm:col-span-2">
                <label for="interest" class="block text-sm font-semibold">
                  What do you need help with?
                </label>

                <div class="mt-2 grid grid-cols-1">
                  <select
                    id="interest"
                    name="interest"
                    required
                    class="col-start-1 row-start-1 w-full appearance-none border-0 bg-transparent px-0 py-2.5 pr-10 text-base text-[#07111F] outline-none focus:ring-0"
                  >
                    <option value="">Choose one</option>
                    <option value="teach-clearly">
                      I need help explaining or teaching something clearly
                    </option>
                    <option value="coaching-education-content">
                      I need coaching or education content built around an idea
                    </option>
                    <option value="team-leadership-sport-belonging">
                      I need help with a team, leadership, sport, or belonging problem
                    </option>
                    <option value="website-form-dashboard-workflow">
                      I need a website, form, dashboard, workflow, or digital system
                    </option>
                    <option value="service-offer-understanding">
                      I need help turning my service or offer into something people understand
                    </option>
                    <option value="diagnosis-structure">
                      I am not sure yet, but I know something needs structure
                    </option>
                  </select>

                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                    class="pointer-events-none col-start-1 row-start-1 mr-4 size-5 self-center justify-self-end text-[#26384F]"
                  >
                    <path
                      d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div class="border-t border-[#07111F]/12 bg-white px-5 py-4 sm:border-r">
                <label for="stage" class="block text-sm font-semibold">
                  Current stage
                </label>
                <select
                  id="stage"
                  name="stage"
                  class="mt-2 block w-full border-0 bg-transparent px-0 py-2.5 text-base text-[#07111F] outline-none focus:ring-0"
                >
                  <option value="">Choose one</option>
                  <option value="idea">Idea / early shape</option>
                  <option value="existing-but-broken">Exists, but not working well</option>
                  <option value="needs-rebuild">Needs a serious rebuild</option>
                  <option value="ready-to-build">Ready to build</option>
                  <option value="ongoing-support">Needs ongoing support</option>
                </select>
              </div>

              <div class="border-t border-[#07111F]/12 bg-white px-5 py-4">
                <label for="website" class="block text-sm font-semibold">
                  Website or reference
                </label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  placeholder="Optional URL or reference"
                  class="mt-2 block w-full border-0 bg-transparent px-0 py-2.5 text-base text-[#07111F] outline-none placeholder:text-[#607089] focus:ring-0"
                />
              </div>

              <div class="border-t border-[#07111F]/12 bg-white px-5 py-4 sm:col-span-2">
                <label for="message" class="block text-sm font-semibold">
                  Tell me what you are trying to teach, fix, build, or understand.
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="8"
                  required
                  placeholder="What is happening now? Who is it for? What do people need to understand, feel, do, or use differently? What would a better version make possible?"
                  class="mt-2 block w-full resize-y border-0 bg-transparent px-0 py-2.5 text-base leading-7 text-[#07111F] outline-none placeholder:text-[#607089] focus:ring-0"
                ></textarea>
              </div>
            </div>

            @if (submitError()) {
              <div
                class="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {{ submitError() }}
              </div>
            }

            <div class="mt-8 flex flex-col gap-5 border-t border-[#07111F]/12 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p class="max-w-lg text-sm leading-6 text-[#26384F]">
                You do not need a polished brief. Start with the situation. I
                will read it directly and reply like a person.
              </p>

              <button
                type="submit"
                [disabled]="isSubmitting()"
                class="group inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#FE7235] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(254,114,53,0.30)] transition hover:-translate-y-0.5 hover:bg-[#FEA735] hover:text-[#07111F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ isSubmitting() ? 'Sending…' : 'Send enquiry' }}
                <span
                  class="ml-2 transition group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
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
