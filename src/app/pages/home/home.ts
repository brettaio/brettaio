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

      <bretta-lead-form />
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
    primaryCtaLabel: 'Call Now',
    primaryCtaHref: 'tel:+15195214260',
    secondaryCtaLabel: 'Start a conversation',
    secondaryCtaHref: '@project-inquiry',
  });
}