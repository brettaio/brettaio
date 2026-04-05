import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bretta-hero-secondary',
  imports: [],
  template: ` <p>hero-secondary works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSecondary {}
