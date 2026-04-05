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

      <!--
        Pull the form upward so it can appear underneath the hero
        while the hero shrinks/fades out.
      -->
      <div class="relative z-20 -mt-[24vh] sm:-mt-[22vh] md:-mt-[18vh]">
        <bretta-lead-form />
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