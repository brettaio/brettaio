import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bretta-thank-you',
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-black text-white">
      <section class="relative isolate flex min-h-screen items-center overflow-hidden px-6 py-24 lg:px-8">
        <!-- Background surfaces -->
        <div class="absolute inset-0 bg-[#08040f]"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-[#14081f] via-[#0d051e] to-black"></div>

        <div
          class="absolute left-1/2 top-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#6e3259]/20 blur-3xl"
          aria-hidden="true"
        ></div>

        <div
          class="absolute bottom-[-10rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[#301042]/30 blur-3xl"
          aria-hidden="true"
        ></div>

        <div class="relative z-10 mx-auto w-full max-w-5xl">
          <div class="max-w-3xl">
            <p class="text-sm font-medium uppercase tracking-[0.28em] text-white/45">
              Inquiry received
            </p>

            <h1 class="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              Thank you —
              <br />
              we’ll chat soon.
            </h1>

            <p class="mt-8 max-w-2xl text-lg leading-8 text-white/72">
              Your enquiry has landed. I’ll review it properly and come back with a considered response,
              not an automated brush-off.
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-4">
              <a
                routerLink="/"
                class="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Back to home
              </a>

              <a
                href="mailto:etc@bretta.io"
                class="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Email directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [],
})
export class ThankYou {}