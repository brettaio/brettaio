import { Component, signal } from '@angular/core';
import { Hero } from '../../components/hero/hero';


@Component({
  selector: 'bretta-home',
  imports: [Hero],
  template: `     <bretta-hero
      [eyebrow]="hero().eyebrow"
      [title]="hero().title"
      [copy]="hero().copy"
      [primaryCtaLabel]="hero().primaryCtaLabel"
      [primaryCtaHref]="hero().primaryCtaHref"
      [secondaryCtaLabel]="hero().secondaryCtaLabel"
      [secondaryCtaHref]="hero().secondaryCtaHref"
    />`,
  styles: ``,
})
export class Home {
    protected readonly hero = signal({
    eyebrow: 'Independent digital systems',
    title: 'Sharp digital work, built with intent.',
    copy:
      'I design, structure, and build commercial digital experiences with a clear point of view — rigorous in execution, refined in language, and focused on useful outcomes.',
    primaryCtaLabel: 'Start a conversation',
    primaryCtaHref: '#contact',
    secondaryCtaLabel: 'See selected work',
    secondaryCtaHref: '#work',
  });
}
