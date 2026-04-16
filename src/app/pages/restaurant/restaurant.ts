import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { map } from 'rxjs';

import type {
  RestaurantPageCopy,
  RestaurantSiteInput,
} from '../../data/restaurant-site-input';
import { jimbosPub } from '../../data/restaurants/jimbos-pub';
import { scoresOriginalSportsGrill } from '../../data/restaurants/scores-original-sports-grill';

const RESTAURANT_PAGES: Record<string, RestaurantSiteInput> = {
  [jimbosPub.slug]: jimbosPub,
  [scoresOriginalSportsGrill.slug]: scoresOriginalSportsGrill,
};

const DEFAULT_PAGE_COPY: Required<RestaurantPageCopy> = {
  locationLabel: 'Restaurant in London, Ontario',
  heroOverlayEyebrow: 'Welcome',
  heroOverlayTitle: 'Good food, easy ordering, and a menu built for sharing.',
  featuredEyebrow: 'Featured favourites',
  featuredTitle: 'Fresh picks up front.',
  featuredDescription:
    'Start with house favourites, then move into the menu, contact details, and key actions.',
  venueEyebrow: 'Details',
  venueTitle: 'Everything important stays easy to find.',
  venueDescription:
    'Hours, highlights, group-friendly details, and practical next steps are all here when you need them.',
  menuEyebrow: 'Menu',
  menuTitle: 'Dinner made easy.\nFavourites up front.',
  menuDescription:
    'Start with fan favourites, then scroll the full menu without losing context or key actions.',
  highlightsEyebrow: 'Good reasons to stop by',
  visitEyebrow: 'Visit',
  visitTitle: 'Stop in today.\nWe are easy to find.',
};

function toTwentyFourHour(time: string): string | null {
  const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const [, rawHours, minutes, period] = match;
  let hours = Number(rawHours);

  if (Number.isNaN(hours)) {
    return null;
  }

  if (period.toUpperCase() === 'AM') {
    hours = hours === 12 ? 0 : hours;
  } else {
    hours = hours === 12 ? 12 : hours + 12;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function buildRestaurantStructuredData(
  site: RestaurantSiteInput,
  canonicalHref: string,
): Record<string, unknown> {
  const sameAs = Object.values(site.socials ?? {}).filter(
    (value): value is string => Boolean(value),
  );

  const openingHoursSpecification = site.hours
    .map((row) => {
      const opens = toTwentyFourHour(row.open);
      const closes = toTwentyFourHour(row.close);

      if (!opens || !closes) {
        return null;
      }

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${row.day}`,
        opens,
        closes,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${canonicalHref}#restaurant`,
    name: site.name,
    url: canonicalHref,
    description: site.seo?.description ?? site.summary,
    image: [
      site.seo?.socialImage?.src ?? site.heroImage.src,
      site.heroImage.src,
      ...site.galleryImages.map((image) => image.src),
    ],
    telephone: site.heroCtas.call?.replace(/^tel:/, '') || site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressLocality: site.city,
      addressRegion: site.province,
      addressCountry: 'CA',
    },
    menu: `${canonicalHref}#menu`,
    sameAs: sameAs.length ? sameAs : undefined,
    openingHoursSpecification:
      openingHoursSpecification.length ? openingHoursSpecification : undefined,
  };
}

function getMenuSectionId(title: string): string {
  return `menu-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;
}

@Component({
  selector: 'bretta-restaurant',
  imports: [RouterLink, NgOptimizedImage],
  template: `
    @if (restaurant(); as site) {
      <div class="pb-24 md:pb-0">
      <section class="relative isolate overflow-hidden bg-[#060606] text-stone-100">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.24),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.18),_transparent_28%),linear-gradient(180deg,_#2a1208_0%,_#140d09_40%,_#060606_100%)]"
          aria-hidden="true"
        ></div>

        <div class="relative mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-8 lg:pb-28 lg:pt-36">
          <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.96fr)] lg:items-center">
            <div class="max-w-4xl">
              <p class="text-xs font-semibold uppercase tracking-[0.34em] text-orange-200/72">
                {{ pageCopy().locationLabel }}
              </p>

              <h1 class="mt-6 font-serif text-5xl tracking-tight text-stone-50 sm:text-6xl lg:text-7xl">
                {{ site.name }}
              </h1>

              <p class="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-stone-300/72">
                {{ site.city }}, {{ site.province }}
              </p>

              <p class="mt-8 max-w-3xl text-2xl leading-tight text-stone-50 sm:text-3xl">
                {{ site.tagline }}
              </p>

              <p class="mt-8 max-w-3xl text-lg leading-8 text-stone-200/84">
                {{ site.summary }}
              </p>

              <div class="mt-8 flex flex-wrap gap-3">
                @for (badge of site.featureBadges; track badge) {
                  <span
                    class="inline-flex items-center rounded-full border border-orange-200/18 bg-orange-100/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-100"
                  >
                    {{ badge }}
                  </span>
                }
              </div>

              <div class="mt-10 flex flex-wrap gap-4">
                @if (site.heroCtas.menu) {
                  <a
                    [routerLink]="[]"
                    fragment="menu"
                    class="inline-flex items-center rounded-full bg-orange-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-200"
                  >
                    View menu
                  </a>
                }

                @if (site.heroCtas.call; as callHref) {
                  <a
                    [href]="callHref"
                    class="inline-flex items-center rounded-full border border-stone-200/18 bg-stone-100/6 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-orange-200/44 hover:bg-stone-100/10"
                  >
                    Call now
                  </a>
                }

                @if (site.heroCtas.directions; as directionsHref) {
                  <a
                    [href]="directionsHref"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center rounded-full border border-stone-200/18 bg-stone-100/6 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-orange-200/44 hover:bg-stone-100/10"
                  >
                    Get directions
                  </a>
                }

                @for (link of site.heroCtas.links ?? []; track link.label + link.href) {
                  <a
                    [href]="link.href"
                    [attr.target]="link.external ? '_blank' : null"
                    [attr.rel]="link.external ? 'noreferrer' : null"
                    class="inline-flex items-center rounded-full border border-stone-200/18 bg-stone-100/6 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-orange-200/44 hover:bg-stone-100/10"
                  >
                    {{ link.label }}
                  </a>
                }
              </div>

              <div class="mt-10 grid gap-4 sm:grid-cols-3">
                <div class="rounded-[1.75rem] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
                  <p class="text-xs uppercase tracking-[0.24em] text-stone-400">
                    Address
                  </p>
                  <p class="mt-3 text-base font-semibold leading-7 text-stone-50">
                    {{ site.address }}
                  </p>
                </div>

                <div class="rounded-[1.75rem] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
                  <p class="text-xs uppercase tracking-[0.24em] text-stone-400">
                    Phone
                  </p>
                  <a
                    [href]="site.heroCtas.call"
                    class="mt-3 inline-flex text-base font-semibold leading-7 text-stone-50 transition hover:text-orange-100"
                  >
                    {{ site.phone }}
                  </a>
                </div>

                <div class="rounded-[1.75rem] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
                  <p class="text-xs uppercase tracking-[0.24em] text-stone-400">
                    Today
                  </p>
                  <p class="mt-3 text-base font-semibold leading-7 text-stone-50">
                    {{ todayHours() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="grid gap-4">
              <div class="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 shadow-2xl shadow-black/40">
                <div class="relative aspect-[4/5]">
                  <img
                    [ngSrc]="site.heroImage.src"
                    [alt]="site.heroImage.alt"
                    fill
                    priority
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    class="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_44%,rgba(0,0,0,0.82)_100%)]"
                    aria-hidden="true"
                  ></div>
                </div>

                <div class="absolute inset-x-0 bottom-0 p-6">
                  <p class="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/72">
                    {{ pageCopy().heroOverlayEyebrow }}
                  </p>
                  <p class="mt-3 max-w-sm text-2xl font-semibold leading-tight text-stone-50">
                    {{ pageCopy().heroOverlayTitle }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#080808] px-6 py-20 text-stone-100 lg:px-8 lg:py-24">
        <div class="mx-auto max-w-7xl">
          <div class="mb-10 max-w-3xl">
            <p class="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/68">
              {{ pageCopy().featuredEyebrow }}
            </p>
            <h2 class="mt-5 font-serif text-4xl tracking-tight text-stone-50 sm:text-5xl">
              {{ pageCopy().featuredTitle }}
            </h2>
            <p class="mt-5 text-lg leading-8 text-stone-300/80">
              {{ pageCopy().featuredDescription }}
            </p>
          </div>

          <div class="grid gap-6 lg:grid-cols-3">
            @for (promo of site.promoCards; track promo.title) {
              <article class="overflow-hidden rounded-[2rem] border border-white/8 bg-white/5">
                <div class="relative aspect-[4/3]">
                  <img
                    [ngSrc]="promo.image.src"
                    [alt]="promo.image.alt"
                    fill
                    sizes="(min-width: 1024px) 28vw, 100vw"
                    class="object-cover"
                  />
                </div>

                <div class="p-6">
                  <p class="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/68">
                    House pick
                  </p>
                  <h2 class="mt-4 text-2xl font-semibold tracking-tight text-stone-50">
                    {{ promo.title }}
                  </h2>
                  <p class="mt-4 text-base leading-7 text-stone-300/80">
                    {{ promo.description }}
                  </p>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      @if (venueSections().length) {
        <section class="bg-[#0d0d0d] px-6 py-20 text-stone-100 lg:px-8 lg:py-24">
          <div class="mx-auto max-w-7xl">
            <div class="max-w-3xl">
              <p class="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/68">
                {{ pageCopy().venueEyebrow }}
              </p>
              <h2 class="mt-5 font-serif text-4xl tracking-tight text-stone-50 sm:text-5xl">
                {{ pageCopy().venueTitle }}
              </h2>
              <p class="mt-5 text-lg leading-8 text-stone-300/80">
                {{ pageCopy().venueDescription }}
              </p>
            </div>

            <div class="mt-10 grid gap-6 lg:grid-cols-2">
              @for (section of venueSections(); track section.id ?? section.title) {
                <article
                  [attr.id]="section.id ?? null"
                  class="overflow-hidden rounded-[2rem] border border-white/8 bg-white/5"
                >
                  @if (section.image; as image) {
                    <div class="relative aspect-[4/3]">
                      <img
                        [ngSrc]="image.src"
                        [alt]="image.alt"
                        fill
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        class="object-cover"
                      />
                    </div>
                  }

                  <div class="p-6 sm:p-8">
                    @if (section.eyebrow) {
                      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/68">
                        {{ section.eyebrow }}
                      </p>
                    }

                    <h3 class="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
                      {{ section.title }}
                    </h3>

                    <p class="mt-4 text-base leading-7 text-stone-300/80">
                      {{ section.description }}
                    </p>

                    @if (section.bullets?.length) {
                      <ul class="mt-6 grid gap-3">
                        @for (bullet of section.bullets; track bullet) {
                          <li class="rounded-[1.25rem] border border-white/8 bg-black/22 px-4 py-3 text-sm leading-6 text-stone-200/84">
                            {{ bullet }}
                          </li>
                        }
                      </ul>
                    }

                    @if (section.cta; as cta) {
                      <div class="mt-6">
                        <a
                          [href]="cta.href"
                          [attr.target]="cta.external ? '_blank' : null"
                          [attr.rel]="cta.external ? 'noreferrer' : null"
                          class="inline-flex items-center rounded-full bg-orange-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-200"
                        >
                          {{ cta.label }}
                        </a>
                      </div>
                    }
                  </div>
                </article>
              }
            </div>
          </div>
        </section>
      }

      @if (newsletterSignup(); as signup) {
        <section id="vip" class="bg-[#120d0b] px-6 py-20 text-stone-100 lg:px-8 lg:py-24">
          <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
            <div class="max-w-3xl">
              <p class="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/68">
                VIP
              </p>
              <h2 class="mt-5 font-serif text-4xl tracking-tight text-stone-50 sm:text-5xl">
                {{ signup.title }}
              </h2>
              <p class="mt-6 text-lg leading-8 text-stone-300/82">
                {{ signup.description }}
              </p>
              @if (signup.privacyNote) {
                <p class="mt-6 text-sm leading-6 text-stone-400">
                  {{ signup.privacyNote }}
                </p>
              }
            </div>

            <form
              [attr.name]="signup.formName"
              method="POST"
              [attr.action]="signup.action ?? '/thank-you'"
              data-netlify="true"
              netlify-honeypot="bot-field"
              class="rounded-[2rem] border border-white/8 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8"
            >
              <input type="hidden" name="form-name" [value]="signup.formName" />
              <input type="hidden" name="restaurant" [value]="site.name" />

              <p class="hidden">
                <label>
                  Do not fill this out if you're human:
                  <input name="bot-field" />
                </label>
              </p>

              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="vip-first-name" class="block text-sm font-medium text-stone-100">
                    First name
                  </label>
                  <input
                    id="vip-first-name"
                    name="first-name"
                    type="text"
                    autocomplete="given-name"
                    required
                    class="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-300"
                  />
                </div>

                <div>
                  <label for="vip-last-name" class="block text-sm font-medium text-stone-100">
                    Last name
                  </label>
                  <input
                    id="vip-last-name"
                    name="last-name"
                    type="text"
                    autocomplete="family-name"
                    required
                    class="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-300"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label for="vip-email" class="block text-sm font-medium text-stone-100">
                    Email
                  </label>
                  <input
                    id="vip-email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    class="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-300"
                  />
                </div>

                <div>
                  <label for="vip-phone" class="block text-sm font-medium text-stone-100">
                    Phone
                  </label>
                  <input
                    id="vip-phone"
                    name="phone"
                    type="tel"
                    autocomplete="tel"
                    class="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-300"
                  />
                </div>

                <div>
                  <label for="vip-city" class="block text-sm font-medium text-stone-100">
                    City
                  </label>
                  <input
                    id="vip-city"
                    name="city"
                    type="text"
                    autocomplete="address-level2"
                    class="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-300"
                  />
                </div>

                <div>
                  <label for="vip-birthday" class="block text-sm font-medium text-stone-100">
                    Birthday
                  </label>
                  <input
                    id="vip-birthday"
                    name="birthday"
                    type="date"
                    class="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-300"
                  />
                </div>

                <div>
                  <label for="vip-anniversary" class="block text-sm font-medium text-stone-100">
                    Anniversary
                  </label>
                  <input
                    id="vip-anniversary"
                    name="anniversary"
                    type="date"
                    class="mt-2 block w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-stone-100 placeholder:text-stone-500 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-300"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label class="flex items-start gap-3 rounded-[1.25rem] border border-white/8 bg-black/18 px-4 py-4 text-sm leading-6 text-stone-300">
                    <input
                      name="consent"
                      type="checkbox"
                      value="yes"
                      required
                      class="mt-1 h-4 w-4 rounded border-white/20 bg-black/20 text-orange-300 focus:ring-orange-300"
                    />
                    <span>{{ signup.consentLabel }}</span>
                  </label>
                </div>
              </div>

              <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
                <p class="max-w-xl text-sm leading-6 text-stone-400">
                  Birthday perks, event invites, and special offers.
                </p>

                <button
                  type="submit"
                  class="inline-flex items-center rounded-full bg-orange-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-200"
                >
                  {{ signup.submitLabel }}
                </button>
              </div>
            </form>
          </div>
        </section>
      }

      <section
        id="menu"
        class="scroll-mt-8 bg-[#111111] px-6 py-20 text-stone-100 lg:scroll-mt-12 lg:px-8 lg:py-24"
      >
        <div class="mx-auto max-w-7xl">
          <div class="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div class="lg:sticky lg:top-28">
              <p class="text-xs font-semibold uppercase tracking-[0.34em] text-orange-200/68">
                {{ pageCopy().menuEyebrow }}
              </p>

              <h2 class="mt-5 whitespace-pre-line font-serif text-4xl tracking-tight text-stone-50 sm:text-5xl">
                {{ pageCopy().menuTitle }}
              </h2>

              <p class="mt-6 max-w-2xl text-lg leading-8 text-stone-300/82">
                {{ pageCopy().menuDescription }}
              </p>

              <div class="mt-8 rounded-[1.75rem] border border-white/8 bg-white/5 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/68">
                  Menu guide
                </p>
                <p class="mt-3 text-sm leading-6 text-stone-300/78">
                  {{ menuItemCount() }} items on current menu.
                </p>
                <div class="mt-5 flex flex-wrap gap-3">
                  @for (section of menuLinks(); track section.id) {
                    <a
                      [routerLink]="[]"
                      [fragment]="section.id"
                      class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-100 transition hover:border-orange-200/44 hover:bg-white/8"
                    >
                      <span>{{ section.title }}</span>
                      <span class="text-orange-100/80">{{ section.itemCount }}</span>
                    </a>
                  }
                </div>
              </div>

              <div class="mt-8 grid gap-4 sm:grid-cols-2">
                @for (image of site.galleryImages; track image.src) {
                  <div class="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
                    <div class="relative aspect-[5/4]">
                      <img
                        [ngSrc]="image.src"
                        [alt]="image.alt"
                        fill
                        sizes="(min-width: 1024px) 18vw, 50vw"
                        class="object-cover"
                      />
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="grid gap-6">
              @for (section of site.menuSections; track section.title) {
                <section
                  [attr.id]="menuSectionId(section.title)"
                  class="scroll-mt-24 rounded-[2rem] border border-white/8 bg-white/5 p-6 sm:p-8"
                >
                  <div class="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/68">
                        On the menu
                      </p>
                      <h3 class="mt-3 text-2xl font-semibold tracking-tight text-stone-50">
                        {{ section.title }}
                      </h3>
                    </div>

                    <span class="rounded-full border border-orange-200/14 bg-orange-100/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-100">
                      {{ section.items.length }} items
                    </span>
                  </div>

                  @if (section.description) {
                    <p class="mt-4 text-sm leading-6 text-stone-300/76">
                      {{ section.description }}
                    </p>
                  }

                  <div class="mt-6 grid gap-4 sm:grid-cols-2">
                    @for (item of section.items; track item.name + (item.description ?? '') + (item.price ?? '')) {
                      <article class="rounded-[1.5rem] bg-black/22 p-4">
                        <div class="flex items-start justify-between gap-4">
                          <div class="min-w-0">
                            <h4 class="text-base font-semibold text-stone-50">
                              {{ item.name }}
                            </h4>

                            @if (item.description) {
                              <p class="mt-2 text-sm leading-6 text-stone-300/76">
                                {{ item.description }}
                              </p>
                            }
                          </div>

                          @if (item.price) {
                            <p class="shrink-0 text-sm font-semibold text-orange-100">
                              {{ item.price }}
                            </p>
                          }
                        </div>
                      </article>
                    }
                  </div>
                </section>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#140c08] px-6 py-20 text-stone-100 lg:px-8 lg:py-24">
        <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
          <div class="rounded-[2rem] border border-white/8 bg-black/20 p-6 sm:p-8">
              <p class="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/68">
                {{ pageCopy().visitEyebrow }}
              </p>

              <h2 class="mt-5 whitespace-pre-line font-serif text-4xl tracking-tight text-stone-50">
                {{ pageCopy().visitTitle }}
              </h2>

            <div class="mt-8 grid gap-5 sm:grid-cols-2">
              <div class="rounded-[1.5rem] border border-white/8 bg-white/6 p-5">
                <p class="text-xs uppercase tracking-[0.24em] text-stone-400">
                  Address
                </p>
                <p class="mt-3 text-lg font-semibold leading-7 text-stone-50">
                  {{ site.address }}
                </p>
              </div>

              <div class="rounded-[1.5rem] border border-white/8 bg-white/6 p-5">
                <p class="text-xs uppercase tracking-[0.24em] text-stone-400">
                  Phone
                </p>
                <a
                  [href]="site.heroCtas.call"
                  class="mt-3 inline-flex text-lg font-semibold leading-7 text-stone-50 transition hover:text-orange-100"
                >
                  {{ site.phone }}
                </a>
              </div>
            </div>

            <div class="mt-8 rounded-[1.75rem] border border-white/8 bg-white/6 p-5">
              <p class="text-xs uppercase tracking-[0.24em] text-stone-400">
                Weekly hours
              </p>

              <div class="mt-4 grid gap-3">
                @for (row of site.hours; track row.day) {
                  <div class="flex items-center justify-between gap-4 border-b border-white/6 pb-3 text-sm text-stone-200/82 last:border-b-0 last:pb-0">
                    <span>{{ row.day }}</span>
                    <span>{{ row.open }} - {{ row.close }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="grid gap-6">
            <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6">
              <div class="relative aspect-[5/4]">
                <img
                  [ngSrc]="site.galleryImages[0].src"
                  [alt]="site.galleryImages[0].alt"
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  class="object-cover"
                />
              </div>
            </div>

            <aside class="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/35 backdrop-blur-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/68">
                {{ pageCopy().highlightsEyebrow }}
              </p>

              <div class="mt-6 grid gap-4">
                @for (highlight of site.highlights; track highlight.title) {
                  <div class="rounded-[1.5rem] border border-white/8 bg-black/18 p-5">
                    <p class="text-lg font-semibold text-stone-50">
                      {{ highlight.title }}
                    </p>
                    <p class="mt-3 text-sm leading-6 text-stone-300/78">
                      {{ highlight.description }}
                    </p>
                  </div>
                }
              </div>

              <div class="mt-8 flex flex-col gap-3">
                @if (site.heroCtas.call; as callHref) {
                  <a
                    [href]="callHref"
                    class="inline-flex items-center justify-center rounded-full bg-orange-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-200"
                  >
                    Call for pickup
                  </a>
                }

                @if (site.heroCtas.directions; as directionsHref) {
                  <a
                    [href]="directionsHref"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center justify-center rounded-full border border-stone-200/18 bg-stone-100/6 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-orange-200/44 hover:bg-stone-100/10"
                  >
                    Get directions
                  </a>
                }
              </div>
            </aside>
          </div>
        </div>
      </section>

      <footer class="border-t border-white/8 bg-[#0a0a0a] px-6 py-10 text-stone-300 lg:px-8">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-lg font-semibold text-stone-50">
              {{ site.name }}
            </p>
            <p class="mt-2 text-sm leading-6 text-stone-400">
              {{ site.address }}
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            @if (site.heroCtas.call; as callHref) {
              <a
                [href]="callHref"
                class="inline-flex items-center rounded-full border border-stone-200/14 px-5 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-orange-200/44 hover:bg-stone-100/8"
              >
                {{ site.phone }}
              </a>
            }

            @if (site.heroCtas.directions; as directionsHref) {
              <a
                [href]="directionsHref"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center rounded-full border border-stone-200/14 px-5 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-orange-200/44 hover:bg-stone-100/8"
              >
                Directions
              </a>
            }
          </div>
        </div>
      </footer>
      <div class="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#080808]/94 px-4 py-3 backdrop-blur-md md:hidden">
        <div class="mx-auto grid max-w-xl grid-cols-3 gap-2">
          <a
            [routerLink]="[]"
            fragment="menu"
            class="inline-flex items-center justify-center rounded-full bg-orange-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-950"
          >
            Menu
          </a>

          @if (site.heroCtas.call; as callHref) {
            <a
              [href]="callHref"
              class="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-100"
            >
              Call
            </a>
          }

          @if (site.heroCtas.directions; as directionsHref) {
            <a
              [href]="directionsHref"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-100"
            >
              Map
            </a>
          }
        </div>
      </div>
      </div>
    } @else {
      <section class="bg-[#0a0704] px-6 py-32 text-stone-100 lg:px-8">
        <div class="mx-auto max-w-5xl">
          <p class="text-xs font-semibold uppercase tracking-[0.34em] text-orange-200/68">
            Restaurant route
          </p>

          <h1 class="mt-6 font-serif text-5xl tracking-tight text-stone-50">
            Restaurant page not found.
          </h1>

          <p class="mt-6 max-w-2xl text-lg leading-8 text-stone-300/82">
            This route is ready, but no compiled restaurant page input matches this slug yet.
          </p>

          <div class="mt-10">
            <a
              routerLink="/"
              class="inline-flex items-center rounded-full border border-stone-200/18 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-stone-200/36 hover:bg-stone-100/6"
            >
              Back to bretta.io
            </a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Restaurant {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    {
      initialValue: this.route.snapshot.paramMap.get('slug') ?? '',
    },
  );

  protected readonly restaurant = computed(
    () => RESTAURANT_PAGES[this.slug()] ?? null,
  );
  protected readonly pageCopy = computed<Required<RestaurantPageCopy>>(() => ({
    ...DEFAULT_PAGE_COPY,
    ...(this.restaurant()?.pageCopy ?? {}),
  }));
  protected readonly venueSections = computed(
    () => this.restaurant()?.venueSections ?? [],
  );
  protected readonly newsletterSignup = computed(
    () => this.restaurant()?.newsletterSignup ?? null,
  );
  protected readonly menuSectionId = getMenuSectionId;
  protected readonly menuLinks = computed(() =>
    (this.restaurant()?.menuSections ?? []).map((section) => ({
      id: getMenuSectionId(section.title),
      title: section.title,
      itemCount: section.items.length,
    })),
  );
  protected readonly menuItemCount = computed(() =>
    (this.restaurant()?.menuSections ?? []).reduce(
      (total, section) => total + section.items.length,
      0,
    ),
  );
  protected readonly todayHours = computed(() => {
    const todayIndex = new Date().getDay();
    const todayName = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][todayIndex];
    const todayRow = this.restaurant()?.hours.find((row) => row.day === todayName);

    return todayRow ? `${todayRow.open} - ${todayRow.close}` : 'Open today';
  });

  private updateNameMeta(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private updatePropertyMeta(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private removeNameMeta(name: string): void {
    this.meta.removeTag(`name="${name}"`);
  }

  private removePropertyMeta(property: string): void {
    this.meta.removeTag(`property="${property}"`);
  }

  private upsertCanonicalLink(href: string): void {
    let canonicalLink = this.document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.rel = 'canonical';
      this.document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = href;
  }

  private upsertStructuredData(site: RestaurantSiteInput, canonicalHref: string): void {
    let structuredDataScript = this.document.head.querySelector<HTMLScriptElement>(
      'script[data-bretta-seo="restaurant"]',
    );

    if (!structuredDataScript) {
      structuredDataScript = this.document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.setAttribute('data-bretta-seo', 'restaurant');
      this.document.head.appendChild(structuredDataScript);
    }

    structuredDataScript.text = JSON.stringify(
      buildRestaurantStructuredData(site, canonicalHref),
    );
  }

  private removeStructuredData(): void {
    this.document.head
      .querySelector<HTMLScriptElement>('script[data-bretta-seo="restaurant"]')
      ?.remove();
  }

  private removeDefaultStructuredData(): void {
    this.document.head
      .querySelector<HTMLScriptElement>('script[data-bretta-seo="default"]')
      ?.remove();
  }

  private applyRestaurantSeo(site: RestaurantSiteInput): void {
    const pageTitle = site.seo?.title ?? `${site.name} | ${site.city}, ${site.province}`;
    const description = site.seo?.description ?? site.summary;
    const canonicalHref =
      site.seo?.canonicalUrl ?? `https://bretta.io/restaurants/${site.slug}`;
    const ogTitle = site.seo?.ogTitle ?? pageTitle;
    const ogDescription = site.seo?.ogDescription ?? description;
    const ogType = site.seo?.ogType ?? 'website';
    const socialImage = site.seo?.socialImage ?? site.heroImage;
    const twitterCard = site.seo?.twitterCard ?? 'summary_large_image';
    const keywords = [
      site.name,
      `${site.city} restaurant`,
      `${site.city} menu`,
      `${site.city} dining`,
      `${site.city} phone`,
    ].join(', ');

    this.title.setTitle(pageTitle);
    this.updateNameMeta('description', description);
    this.updateNameMeta('keywords', keywords);
    this.updateNameMeta(
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    this.updateNameMeta(
      'googlebot',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    this.updatePropertyMeta('og:type', ogType);
    this.updatePropertyMeta('og:site_name', site.name);
    this.updatePropertyMeta('og:url', canonicalHref);
    this.updatePropertyMeta('og:title', ogTitle);
    this.updatePropertyMeta('og:description', ogDescription);
    this.updatePropertyMeta('og:image', socialImage.src);
    this.updatePropertyMeta('og:image:secure_url', socialImage.src);
    this.updatePropertyMeta('og:image:alt', socialImage.alt);
    this.updateNameMeta('twitter:card', twitterCard);
    this.updateNameMeta('twitter:url', canonicalHref);
    this.updateNameMeta('twitter:title', ogTitle);
    this.updateNameMeta('twitter:description', ogDescription);
    this.updateNameMeta('twitter:image', socialImage.src);
    this.updateNameMeta('twitter:image:alt', socialImage.alt);

    this.removePropertyMeta('og:video');
    this.removePropertyMeta('og:video:secure_url');
    this.removePropertyMeta('og:video:type');
    this.removePropertyMeta('og:image:type');
    this.removePropertyMeta('og:image:width');
    this.removePropertyMeta('og:image:height');

    this.removeDefaultStructuredData();
    this.upsertCanonicalLink(canonicalHref);
    this.upsertStructuredData(site, canonicalHref);
  }

  private applyMissingSeo(): void {
    this.title.setTitle('Restaurant Page Not Found');
    this.updateNameMeta(
      'description',
      'Restaurant page route is active, but no compiled restaurant page input matches this slug yet.',
    );
    this.updateNameMeta('robots', 'noindex, nofollow');
    this.updateNameMeta('googlebot', 'noindex, nofollow');
    this.removeDefaultStructuredData();
    this.removeStructuredData();
  }

  constructor() {
    effect(() => {
      const site = this.restaurant();

      if (!site) {
        this.applyMissingSeo();
        return;
      }

      this.applyRestaurantSeo(site);
    });
  }
}
