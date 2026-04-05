import { Component } from '@angular/core';

@Component({
  selector: 'bretta-lead-form',
  template: `
    <section id="project-inquiry" class="bg-[#14081f] px-6 py-24 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <div class="max-w-3xl">
          <p class="text-sm font-medium uppercase tracking-[0.28em] text-white/45">
            Project inquiry
          </p>

          <h2 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Bring the commercial problem, not just the deliverable.
          </h2>

          <p class="mt-6 max-w-2xl text-lg leading-8 text-white/72">
            This intake is designed to get past vague briefs quickly. The point
            is to understand what is actually not working: visibility, lead
            quality, paid performance, conversion friction, weak positioning, or
            a digital presence that simply is not carrying enough weight.
          </p>
        </div>

        <form
          name="project-inquiry"
          method="POST"
          action="/thank-you"
          data-netlify="true"
          data-netlify-recaptcha="true"
          netlify-honeypot="bot-field"
          class="mt-14 rounded-3xl border border-white/10 bg-[#1b0b2d]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 lg:p-10"
        >
          <input type="hidden" name="form-name" value="project-inquiry" />

          <p class="hidden">
            <label>
              Do not fill this out if you're human:
              <input name="bot-field" />
            </label>
          </p>

          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="name" class="block text-sm font-medium text-white">
                Name
              </label>
              <div class="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  placeholder="Your name"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="email" class="block text-sm font-medium text-white">
                Email
              </label>
              <div class="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@company.com"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="company" class="block text-sm font-medium text-white">
                Company
              </label>
              <div class="mt-2">
                <input
                  id="company"
                  name="company"
                  type="text"
                  autocomplete="organization"
                  placeholder="Business or organisation name"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="website" class="block text-sm font-medium text-white">
                Current website
              </label>
              <div class="mt-2">
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://..."
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="role" class="block text-sm font-medium text-white">
                Your role
              </label>
              <div class="mt-2">
                <input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="Founder, director, owner, head of marketing..."
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label
                for="business-model"
                class="block text-sm font-medium text-white"
              >
                What do you actually sell?
              </label>
              <div class="mt-2">
                <input
                  id="business-model"
                  name="business-model"
                  type="text"
                  placeholder="Product, service, offer, category"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                />
              </div>
            </div>

            <div class="col-span-full">
              <fieldset>
                <legend class="block text-sm font-medium text-white">
                  What needs to improve most right now?
                </legend>
                <p class="mt-2 text-sm leading-6 text-white/45">
                  Select the commercial outcomes that actually matter.
                </p>

                <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  @for (item of priorityOptions; track item.value) {
                    <label
                      class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
                    >
                      <input
                        type="checkbox"
                        [name]="item.value"
                        class="mt-1 size-4 rounded border-white/15 bg-white/5 text-[#9d5d95] focus:ring-[#9d5d95]"
                      />
                      <span>
                        <span class="block text-sm font-medium text-white">
                          {{ item.label }}
                        </span>
                        <span
                          class="mt-1 block text-sm leading-6 text-white/50"
                        >
                          {{ item.copy }}
                        </span>
                      </span>
                    </label>
                  }
                </div>
              </fieldset>
            </div>

            <div class="col-span-full">
              <label for="problem" class="block text-sm font-medium text-white">
                Where is the current drag?
              </label>
              <div class="mt-2">
                <textarea
                  id="problem"
                  name="problem"
                  rows="4"
                  placeholder="Be specific. Weak lead quality? Low organic visibility? Paid traffic not converting? Offer unclear? Site does not build enough trust?"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                ></textarea>
              </div>
            </div>

            <div class="col-span-full">
              <label
                for="lead-quality"
                class="block text-sm font-medium text-white"
              >
                What is happening with leads or enquiries right now?
              </label>
              <div class="mt-2">
                <textarea
                  id="lead-quality"
                  name="lead-quality"
                  rows="4"
                  placeholder="Too few? Wrong fit? Weak intent? Poor close rate? Plenty of traffic but low-quality enquiries?"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                ></textarea>
              </div>
            </div>

            <div class="col-span-full">
              <label for="organic" class="block text-sm font-medium text-white">
                What is the organic search situation?
              </label>
              <div class="mt-2">
                <textarea
                  id="organic"
                  name="organic"
                  rows="4"
                  placeholder="Are you invisible in search, ranking for the wrong terms, attracting weak traffic, or failing to turn organic visits into serious enquiries?"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                ></textarea>
              </div>
            </div>

            <div class="col-span-full">
              <label for="paid" class="block text-sm font-medium text-white">
                What is happening with paid advertising?
              </label>
              <div class="mt-2">
                <textarea
                  id="paid"
                  name="paid"
                  rows="4"
                  placeholder="Are you running paid traffic now? If so, what is not carrying — targeting, landing pages, messaging, conversion quality, trust, cost efficiency?"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                ></textarea>
              </div>
            </div>

            <div class="col-span-full">
              <label
                for="presence"
                class="block text-sm font-medium text-white"
              >
                What does your digital presence fail to communicate today?
              </label>
              <div class="mt-2">
                <textarea
                  id="presence"
                  name="presence"
                  rows="4"
                  placeholder="What should jump off the page but currently does not? Credibility, seriousness, category clarity, premium value, trust, differentiation?"
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                ></textarea>
              </div>
            </div>

            <div class="col-span-full">
              <label for="outcome" class="block text-sm font-medium text-white">
                What needs to become true on the other side of this work?
              </label>
              <div class="mt-2">
                <textarea
                  id="outcome"
                  name="outcome"
                  rows="4"
                  placeholder="More qualified traffic, stronger trust, better-fit leads, clearer offer, better conversion quality, stronger paid performance, better organic traction..."
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                ></textarea>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label
                for="timeline"
                class="block text-sm font-medium text-white"
              >
                Timeline pressure
              </label>
              <div class="mt-2 grid grid-cols-1">
                <select
                  id="timeline"
                  name="timeline"
                  class="col-start-1 row-start-1 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-base text-white outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95] *:bg-[#1b0b2d]"
                >
                  <option value="">Select one</option>
                  <option>Immediate — this is already costing us</option>
                  <option>Within 30 days</option>
                  <option>Within this quarter</option>
                  <option>Exploratory, but serious</option>
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

            <div class="sm:col-span-3">
              <label for="budget" class="block text-sm font-medium text-white">
                Budget band
              </label>
              <div class="mt-2 grid grid-cols-1">
                <select
                  id="budget"
                  name="budget"
                  class="col-start-1 row-start-1 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-base text-white outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95] *:bg-[#1b0b2d]"
                >
                  <option value="">Select one</option>
                  <option>Under $5k</option>
                  <option>$5k – $15k</option>
                  <option>$15k – $35k</option>
                  <option>$35k+</option>
                  <option>Need to discuss</option>
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

            <div class="col-span-full">
              <label for="context" class="block text-sm font-medium text-white">
                Anything else I should know before replying?
              </label>
              <div class="mt-2">
                <textarea
                  id="context"
                  name="context"
                  rows="4"
                  placeholder="Constraints, internal politics, prior attempts, stakeholders, pressure points, or anything that changes the shape of the work."
                  class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/35 focus:outline-2 focus:-outline-offset-2 focus:outline-[#9d5d95]"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <div data-netlify-recaptcha="true"></div>
          </div>

          <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <p class="max-w-xl text-sm leading-6 text-white/45">
              Good answers create a sharper first response. This form is for
              serious enquiries, not vague fishing expeditions.
            </p>

            <button
              type="submit"
              class="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Submit inquiry
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [],
})
export class LeadForm {
  protected readonly priorityOptions = [
    {
      value: 'priority-qualified-leads',
      label: 'More qualified leads',
      copy: 'Better fit, stronger intent, fewer weak enquiries.',
    },
    {
      value: 'priority-organic-traffic',
      label: 'Stronger organic visibility',
      copy: 'Better search presence and more useful inbound traffic.',
    },
    {
      value: 'priority-paid-performance',
      label: 'Paid traffic that performs',
      copy: 'Ads and landing experiences that convert more intelligently.',
    },
    {
      value: 'priority-digital-presence',
      label: 'A stronger digital presence',
      copy: 'A site that carries more credibility, seriousness, and value.',
    },
    {
      value: 'priority-conversion-quality',
      label: 'Better conversion quality',
      copy: 'Less friction, clearer paths, stronger decision momentum.',
    },
    {
      value: 'priority-positioning',
      label: 'Clearer positioning',
      copy: 'A sharper offer, better message, and cleaner market signal.',
    },
  ];
}