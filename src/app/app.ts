import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Hero } from './components/hero/hero';
import { HeroAlt } from './components/hero-alt/hero-alt';

@Component({
  selector: 'bretta-root',
  imports: [RouterOutlet, Header, Footer, Hero],
  template: `
    <bretta-header />

    <bretta-hero
      [eyebrow]="hero().eyebrow"
      [title]="hero().title"
      [copy]="hero().copy"
      [primaryCtaLabel]="hero().primaryCtaLabel"
      [primaryCtaHref]="hero().primaryCtaHref"
      [secondaryCtaLabel]="hero().secondaryCtaLabel"
      [secondaryCtaHref]="hero().secondaryCtaHref"
    />

    <router-outlet />

    <bretta-footer />
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('brettaio');

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