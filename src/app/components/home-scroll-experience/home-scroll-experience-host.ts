import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

import {
  HOME_SCROLL_EXPERIENCES,
  HomeScrollExperienceId,
} from './home-scroll-experience.config';
import { ConnectionScrollExperience } from './connection-scroll-experience';
import { GratitudeScrollExperience } from './gratitude-scroll-experience';
import { KindnessScrollExperience } from './kindness-scroll-experience';
import { PresenceScrollExperience } from './presence-scroll-experience';
import { SystemsBelongingScrollExperience } from './systems-belonging-scroll-experience';

@Component({
  selector: 'bretta-home-scroll-experience-host',
  imports: [
    ConnectionScrollExperience,
    GratitudeScrollExperience,
    KindnessScrollExperience,
    PresenceScrollExperience,
    SystemsBelongingScrollExperience,
  ],
  template: `
    @switch (selectedExperienceId()) {
      @case ('connection') {
        <bretta-connection-scroll-experience />
      }

      @case ('gratitude') {
        <bretta-gratitude-scroll-experience />
      }

      @case ('kindness') {
        <bretta-kindness-scroll-experience />
      }

      @case ('presence') {
        <bretta-presence-scroll-experience />
      }

      @default {
        <bretta-systems-belonging-scroll-experience />
      }
    }
  `,
  styles: [],
})
export class HomeScrollExperienceHost implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly selectedExperienceId =
    signal<HomeScrollExperienceId>('systems-belonging');

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.setTimeout(() => {
      const availableIds = HOME_SCROLL_EXPERIENCES.map(
        (experience) => experience.id
      );
      const selectedIndex = Math.floor(Math.random() * availableIds.length);

      this.selectedExperienceId.set(availableIds[selectedIndex]);
    }, 0);
  }
}
