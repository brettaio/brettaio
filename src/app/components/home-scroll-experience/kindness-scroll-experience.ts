import { Component } from '@angular/core';

import { ScrollExperienceShell } from './scroll-experience-shell';
import { getHomeScrollExperienceConfig } from './home-scroll-experience.config';

@Component({
  selector: 'bretta-kindness-scroll-experience',
  imports: [ScrollExperienceShell],
  template: `<bretta-scroll-experience-shell [config]="config" />`,
  styles: [],
})
export class KindnessScrollExperience {
  protected readonly config = getHomeScrollExperienceConfig('kindness');
}
