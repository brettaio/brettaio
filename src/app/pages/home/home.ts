import { Component, signal } from '@angular/core';

import { Hero } from '../../components/hero/hero';
import { LeadForm } from '../../components/lead-form/lead-form';

@Component({
  selector: 'bretta-home',
  imports: [Hero, LeadForm],
  template: `
    <main class="bg-black text-white">
      <bretta-hero
        [eyebrow]="hero().eyebrow"
        [title]="hero().title"
        [copy]="hero().copy"
        [primaryCtaLabel]="hero().primaryCtaLabel"
        [primaryCtaHref]="hero().primaryCtaHref"
        [secondaryCtaLabel]="hero().secondaryCtaLabel"
        [secondaryCtaHref]="hero().secondaryCtaHref"
      />

      <div class="relative z-20 -mt-[24vh] sm:-mt-[22vh] md:-mt-[18vh]">
        @defer (on viewport) {
          <bretta-lead-form />
        } @placeholder {
          <section id="project-inquiry" class="bg-[#14081f] px-6 py-24 lg:px-8">
            <div class="mx-auto max-w-6xl">
              <div class="rounded-3xl border border-white/10 bg-[#1b0b2d]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 lg:p-10">
                <div class="max-w-3xl">
                  <p class="text-sm font-medium uppercase tracking-[0.28em] text-white/45">
                    Project inquiry
                  </p>

                  <h2 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Bring the commercial problem, not just the deliverable.
                  </h2>

                  <p class="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                    Loading inquiry form…
                  </p>
                </div>

                <div class="mt-12 space-y-4">
                  <div class="h-14 rounded-xl bg-white/5"></div>
                  <div class="h-14 rounded-xl bg-white/5"></div>
                  <div class="h-32 rounded-xl bg-white/5"></div>
                  <div class="h-14 w-48 rounded-full bg-white/10"></div>
                </div>
              </div>
            </div>
          </section>
        }
      </div>
    </main>
  `,
  styles: [],
})
export class Home {
  protected readonly hero = signal({
    eyebrow: 'Independent digital practice',
    title: 'Sharp digital work, built with intent.',
    copy:
      'For businesses that need more than surface polish — clearer positioning, stronger structure, better digital judgement, and work that can carry commercial weight.',
    primaryCtaLabel: 'Email now',
    primaryCtaHref: '',
    secondaryCtaLabel: 'Discuss a project',
    secondaryCtaHref: '@project-inquiry',
  });
}