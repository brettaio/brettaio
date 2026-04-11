import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import {
  HeroFrameRange,
  HeroStageFrameState,
  buildFrameRanges,
  buildHeroFrameState,
  buildSceneHeight,
  buildSceneOpacity,
  buildSceneTransform,
  buildShaderTimeFromScroll,
} from '../../core/hero-scroll-motion/hero-scroll-motion';
import { CtaDock, CtaDockAction } from '../cta-dock/cta-dock';

type HeroAction = {
  label: string;
  href: string;
  variant?: 'solid' | 'outline';
};

type HeroStageFrame = {
  eyebrow?: string;
  titleLines: string[];
  bodyLines?: string[];
  actions?: HeroAction[];
};

const HERO_VERTEX_SHADER = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const HERO_FRAGMENT_SHADER = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;

  #define T (sin(iTime * 0.6) * 16.0 + iTime * 1e2)
  #define P(z) vec3( \
    cos((z) * 0.011) * 16.0 + cos((z) * 0.012) * 24.0, \
    cos((z) * 0.01) * 4.0, \
    (z) \
  )
  #define N normalize
  #define R(a) mat2(cos((a) + vec4(0.0, 33.0, 11.0, 0.0)))

  vec4 tanhApprox(vec4 x) {
    vec4 e2x = exp(2.0 * x);
    return (e2x - 1.0) / (e2x + 1.0);
  }

  float boxen(vec3 p) {
    p = abs(fract(p / 20.0) * 20.0 - 10.0) - 1.0;
    return min(p.x, min(p.y, p.z));
  }

  vec4 lights;

  float mapScene(vec3 p, bool accumulateLights) {
    vec3 q = P(p.z);
    float g = q.y - p.y + 6.0;
    float m = boxen(p);

    p.xy -= q.xy;

    float red = length(p.xy - sin(p.z / 12.0 + vec2(0.0, 1.3)) * 12.0) - 1.0;
    float blue = length(p.xy - sin(p.z / 16.0 + vec2(0.0, 0.7)) * 16.0) - 2.0;
    float e = min(red, blue);

    if (accumulateLights) {
      lights += vec4(10.0, 2.0, 1.0, 0.0) / (0.1 + abs(red));
      lights += vec4(1.0, 2.0, 10.0, 0.0) / (0.1 + abs(blue) / 10.0);
    }

    p = abs(p);

    float tex = abs(
      length(sin(p * cos(p.yzx / 30.0) * 4.0) / (p * 4.0 + 0.0001))
    );
    float tun = min(32.0 - p.x - p.y, 24.0 - p.y);

    float d = max(min(m, g), tun) - tex;
    return min(e, d);
  }

  void main() {
    vec2 u = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    u.y -= 0.2;

    vec4 o = vec4(0.0);

    vec3 p = P(T);
    vec3 ro = p;
    vec3 Z = N(P(T + 2.0) - p);
    vec3 X = N(vec3(Z.z, 0.0, -Z.x));
    vec3 Y = cross(X, Z);

    vec2 rotated = R(sin(T * 0.005) * 0.4) * u;
    vec3 D = N(vec3(rotated, 1.0) * mat3(-X, Y, Z));

    float d = 0.0;
    float s = 0.0;

    lights = vec4(0.0);
    for (int step = 0; step < 100; step++) {
      p = ro + D * d;
      s = mapScene(p, true) * 0.8;
      d += s;
      o += lights + 1.0 / max(s, 0.01);
    }

    const float h = 0.005;
    const vec2 k = vec2(1.0, -1.0);

    vec3 n = N(
      k.xyy * mapScene(p + k.xyy * h, false) +
      k.yyx * mapScene(p + k.yyx * h, false) +
      k.yxy * mapScene(p + k.yxy * h, false) +
      k.xxx * mapScene(p + k.xxx * h, false)
    );

    o *= (0.1 + max(dot(n, -D), 0.0));

    vec4 ref = vec4(0.0);
    vec3 rp = p + n * 0.05;
    vec3 rdir = reflect(D, n);

    s = 0.0;
    lights = vec4(0.0);
    for (int step = 0; step < 50; step++) {
      rp += rdir * s;
      s = mapScene(rp, true) * 0.8;
      ref += lights + 1.0 / max(s, 0.01);
    }

    o += o * ref;

    vec4 graded = o / 1e9 * exp(vec4(8.0, 2.0, 1.75, 0.0) * d / 500.0);
    vec4 color = tanhApprox(graded);

    color.rgb = pow(color.rgb, vec3(0.92));
    color.rgb *= vec3(1.0, 0.96, 1.18);
    color.rgb = clamp(color.rgb, 0.0, 1.0);

    gl_FragColor = vec4(color.rgb, 1.0);
  }
`;

@Component({
  selector: 'bretta-hero',
  imports: [RouterLink, CtaDock],
  template: `
    <section
      #heroSection
      class="relative z-10 text-white"
      [style.min-height]="sceneHeight()"
    >
      <div
        class="sticky top-0 h-screen overflow-hidden origin-top will-change-transform"
        [style.opacity]="sceneOpacity()"
        [style.transform]="sceneTransform()"
      >
        <canvas
          #shaderCanvas
          class="absolute inset-0 h-full w-full"
          aria-hidden="true"
        ></canvas>

        <div class="absolute inset-0 bg-black/50"></div>

        <div
          class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-black/65"
        ></div>

        <div class="absolute inset-0">
          <div
            class="mx-auto flex h-full max-w-7xl items-start px-6 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-16 md:items-end md:pt-36 md:pb-24 lg:px-8 lg:pb-32"
          >
            <div
              class="relative w-full max-w-5xl min-h-[28rem] sm:min-h-[30rem] md:min-h-[24rem] lg:min-h-[28rem]"
            >
              @for (frame of frames(); track $index; let frameIndex = $index) {
                <article
                  class="absolute inset-x-0 top-0 will-change-transform"
                  [style.opacity]="frameStates()[frameIndex].opacity"
                  [style.transform]="frameTransform(frameIndex)"
                  [style.filter]="frameFilter(frameIndex)"
                  [style.pointer-events]="frameStates()[frameIndex].pointerEvents"
                >
                  @if (frame.eyebrow) {
                    <p
                      class="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/65 sm:text-xs"
                    >
                      {{ frame.eyebrow }}
                    </p>
                  }

                  <div class="space-y-1 sm:space-y-2">
                    @for (line of frame.titleLines; track $index) {
                      <h2
                        class="max-w-5xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                      >
                        {{ line }}
                      </h2>
                    }
                  </div>

                  @if (frame.bodyLines?.length) {
                    <div
                      class="mt-7 max-w-3xl space-y-4 text-base leading-7 text-white/80 sm:text-lg sm:leading-8"
                      [style.opacity]="frameStates()[frameIndex].bodyOpacity"
                    >
                      @for (line of frame.bodyLines; track $index) {
                        <p>{{ line }}</p>
                      }
                    </div>
                  }

                  @if (frame.actions?.length) {
                    <div
                      class="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
                      [style.opacity]="frameStates()[frameIndex].ctaOpacity"
                    >
                      @for (action of frame.actions; track action.label + action.href) {
                        @if (isScrollTarget(action.href)) {
                          <button
                            type="button"
                            (click)="handleActionClick(action.href)"
                            [class]="actionClass(action)"
                          >
                            {{ action.label }}
                          </button>
                        } @else if (isInternalRoute(action.href)) {
                          <a
                            [routerLink]="action.href"
                            (click)="handleActionClick(action.href)"
                            [class]="actionClass(action)"
                          >
                            {{ action.label }}
                          </a>
                        } @else {
                          <a
                            [attr.href]="action.href"
                            (click)="handleActionClick(action.href)"
                            [class]="actionClass(action)"
                          >
                            {{ action.label }}
                          </a>
                        }
                      }
                    </div>
                  }
                </article>
              }
            </div>
          </div>
        </div>

        <bretta-cta-dock
          [emailHref]="resolveEmailHref()"
          [smsHref]="buildSmsHref()"
          [callHref]="'tel:+15195214260'"
          (actionTriggered)="handleDockAction($event)"
        />
      </div>
    </section>
  `,
  styles: [],
})
export class Hero implements AfterViewInit {
  @ViewChild('heroSection', { static: true })
  private readonly sectionRef?: ElementRef<HTMLElement>;

  @ViewChild('shaderCanvas', { static: true })
  private readonly canvasRef?: ElementRef<HTMLCanvasElement>;

  readonly eyebrow = input('Independent digital practice');
  readonly title = input('Sharp digital work, built with intent.');
  readonly copy = input(
    'For businesses that need more than surface polish — clearer positioning, stronger structure, better digital judgement, and work that can carry commercial weight.'
  );
  readonly primaryCtaLabel = input('Email now');
  readonly primaryCtaHref = input('');
  readonly secondaryCtaLabel = input(`Start The Conversation`);
  readonly secondaryCtaHref = input('@project-inquiry-panel');

  protected readonly scrollProgress = signal(0);
  protected readonly viewportWidth = signal(1440);

  protected readonly isMobile = computed(() => this.viewportWidth() < 768);

  protected readonly desktopEmailAction = computed<HeroAction>(() => ({
    label: this.primaryCtaLabel(),
    href: this.resolveEmailHref(),
    variant: 'solid',
  }));

  protected readonly continueAction = computed<HeroAction>(() => ({
    label: this.secondaryCtaLabel(),
    href: this.secondaryCtaHref(),
    variant: 'outline',
  }));

  protected readonly inlineActions = computed<HeroAction[]>(() => {
    if (this.isMobile()) {
      return [this.continueAction()];
    }

    return [this.desktopEmailAction(), this.continueAction()];
  });

  protected readonly frames = computed<HeroStageFrame[]>(() => {
    const actions = this.inlineActions();

    return [
      {
        eyebrow: this.eyebrow(),
        titleLines: [this.title()],
        bodyLines: [this.copy()],
        actions,
      },
      {
        eyebrow: 'Who',
        titleLines: ['Not a broad agency.', 'Not a disposable freelancer.'],
        bodyLines: [
          'One accountable digital practice.',
          'Strategy, structure, design, and implementation held to one standard of judgement.',
        ],
      },
      {
        eyebrow: 'What',
        titleLines: ['The work is digital.', 'The standard is commercial.'],
        bodyLines: [
          'The brief may look like a site, a service layer, a user path, or a structural content problem.',
          'The job is the same: make the digital surface clearer, more credible, and more useful to the business behind it.',
        ],
      },
      {
        eyebrow: 'When',
        titleLines: [
          'Clarity over noise.',
          'Structure over drift.',
          'Judgement over volume.',
        ],
        bodyLines: [
          'Most digital work does not fail because it lacked activity.',
          'It fails because the message is weak, the hierarchy is muddy, and the build does not support the business properly.',
        ],
      },
      {
        eyebrow: 'Why',
        titleLines: [
          'A better digital surface',
          'changes what happens behind it.',
        ],
        bodyLines: [
          'Better trust. Better fit. Better signal quality. Better internal confidence in what the business is actually presenting to the market.',
        ],
      },
      {
        eyebrow: 'How',
        titleLines: ['Singular by design.'],
        bodyLines: [
          'bretta.io is not a scaled delivery machine.',
          'It is one practice, one standard, and one line of accountability.',
        ],
      },
      {
        eyebrow: 'Decision',
        titleLines: ['If the work matters,', 'the structure has to hold.'],
        bodyLines: ['Bring the real problem. I’ll take it seriously.'],
        actions,
      },
    ];
  });

  protected readonly frameWeights = computed<number[]>(() => [
    1.28,
    0.98,
    0.96,
    0.96,
    0.96,
    1.02,
    1.78,
  ]);

  protected readonly frameRanges = computed<HeroFrameRange[]>(() =>
    buildFrameRanges(this.frameWeights())
  );

  protected readonly sceneHeight = computed(() =>
    buildSceneHeight(this.frameWeights())
  );

  protected readonly sceneOpacity = computed(() =>
    buildSceneOpacity(this.scrollProgress())
  );

  protected readonly sceneTransform = computed(() =>
    buildSceneTransform(this.scrollProgress())
  );

  protected readonly frameStates = computed<HeroStageFrameState[]>(() => {
    const progress = this.scrollProgress();
    const ranges = this.frameRanges();
    const frameCount = this.frames().length;

    return this.frames().map((_, index) =>
      buildHeroFrameState(index, frameCount, ranges[index], progress)
    );
  });

  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly analytics = inject(AnalyticsService);

  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private vertexShader: WebGLShader | null = null;
  private fragmentShader: WebGLShader | null = null;
  private positionLocation: number | null = null;
  private timeLocation: WebGLUniformLocation | null = null;
  private resolutionLocation: WebGLUniformLocation | null = null;

  private renderRequestId: number | null = null;
  private shaderTime = 0;

  private readonly scrollTimeRange = 6.8;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.updateViewportWidth();

    const start = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          this.startShaderScene();
        });
      });
    };

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
    };

    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(() => start());
    } else {
      window.setTimeout(start, 120);
    }
  }

  protected isInternalRoute(value: string): boolean {
    return value.startsWith('/');
  }

  protected isScrollTarget(value: string): boolean {
    return value.startsWith('@');
  }

  protected actionClass(action: HeroAction): string {
    const base =
      'inline-flex min-h-[48px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 sm:px-6';

    if (action.variant === 'solid') {
      return `${base} bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.16)] hover:-translate-y-0.5 hover:bg-white/92`;
    }

    return `${base} border border-white/20 bg-white/6 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10`;
  }

  protected handleActionClick(value: string): void {
    if (value.startsWith('tel:')) {
      this.analytics.trackCallClick('hero');
      return;
    }

    if (value.startsWith('mailto:')) {
      this.analytics.trackEmailClick('hero');
      return;
    }

    if (value.startsWith('sms:')) {
      this.trackSmsClick();
      return;
    }

    if (this.isScrollTarget(value)) {
      this.scrollToTarget(value);
    }
  }

  protected handleDockAction(action: CtaDockAction): void {
    if (action === 'email') {
      this.analytics.trackEmailClick('hero');
      return;
    }

    if (action === 'sms') {
      this.trackSmsClick();
      return;
    }

    if (action === 'call') {
      this.analytics.trackCallClick('hero');
      return;
    }

    this.scrollToTop();
  }

  protected scrollToTarget(value: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const targetId = value.replace('@', '');

    if (targetId === 'project-inquiry-panel') {
      this.openProjectInquiryPanel();
    }

    const element = document.getElementById(targetId);

    if (!element) {
      console.warn(`Scroll target not found: ${targetId}`);
      return;
    }

    const headerOffset = this.viewportWidth() < 768 ? 88 : 104;
    const absoluteTop =
      window.scrollY + element.getBoundingClientRect().top - headerOffset;

    window.scrollTo({
      top: Math.max(0, absoluteTop),
      behavior: 'smooth',
    });
  }

  protected scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  protected frameTransform(frameIndex: number): string {
    const state = this.frameStates()[frameIndex];
    return `translate3d(0, ${state.translateY}px, 0) scale(${state.scale})`;
  }

  protected frameFilter(frameIndex: number): string {
    const state = this.frameStates()[frameIndex];
    return `blur(${state.blur}px)`;
  }

  protected resolveEmailHref(): string {
    return this.primaryCtaHref() || this.buildDesktopMailtoHref();
  }

  protected buildSmsHref(): string {
    const body = encodeURIComponent(
      'Hi Bretta, would love to chat shop about my online presence'
    );

    return `sms:+15195214260?&body=${body}`;
  }

  private buildDesktopMailtoHref(): string {
    const subject = encodeURIComponent('Project inquiry — bretta.io');
    const body = encodeURIComponent(
      [
        'Hi Brett,',
        '',
        "I'm reaching out about improving our digital presence and commercial performance.",
        '',
        'Company:',
        'Website:',
        'Main problem:',
        'Desired outcome:',
        'Timeline:',
        '',
        'Best,',
      ].join('\n')
    );

    return `mailto:etc@bretta.io?subject=${subject}&body=${body}`;
  }

  private trackSmsClick(): void {
    const smsAwareAnalytics = this.analytics as AnalyticsService & {
      trackTextClick?: (source: string) => void;
    };

    smsAwareAnalytics.trackTextClick?.('hero');
  }

  private openProjectInquiryPanel(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.dispatchEvent(new CustomEvent('bretta:open-project-inquiry'));
  }

  private updateViewportWidth(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.viewportWidth.set(window.innerWidth || 1440);
  }

  private startShaderScene(): void {
    const canvas = this.canvasRef?.nativeElement;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      return;
    }

    const vertexShader = this.createShader(
      gl,
      gl.VERTEX_SHADER,
      HERO_VERTEX_SHADER
    );
    const fragmentShader = this.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      HERO_FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) {
      return;
    }

    const program = this.createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    this.gl = gl;
    this.program = program;
    this.positionBuffer = positionBuffer;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.positionLocation = gl.getAttribLocation(program, 'a_position');
    this.timeLocation = gl.getUniformLocation(program, 'iTime');
    this.resolutionLocation = gl.getUniformLocation(program, 'iResolution');

    const onScroll = (): void => {
      this.updateSceneFromScroll();
      this.scheduleRender();
    };

    const onResize = (): void => {
      this.updateViewportWidth();
      this.resizeCanvas();
      this.updateSceneFromScroll();
      this.scheduleRender();
    };

    this.ngZone.runOutsideAngular(() => {
      this.updateViewportWidth();
      this.resizeCanvas();
      this.updateSceneFromScroll();
      this.renderFrame();

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
    });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      if (this.renderRequestId !== null) {
        window.cancelAnimationFrame(this.renderRequestId);
      }

      if (this.gl && this.positionBuffer) {
        this.gl.deleteBuffer(this.positionBuffer);
      }

      if (this.gl && this.program) {
        this.gl.deleteProgram(this.program);
      }

      if (this.gl && this.vertexShader) {
        this.gl.deleteShader(this.vertexShader);
      }

      if (this.gl && this.fragmentShader) {
        this.gl.deleteShader(this.fragmentShader);
      }
    });
  }

  private updateSceneFromScroll(): void {
    const section = this.sectionRef?.nativeElement;

    if (!section || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const maxTravel = Math.max(rect.height - viewportHeight, 1);

    const rawProgress = -rect.top / maxTravel;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    this.scrollProgress.set(progress);
    this.shaderTime = buildShaderTimeFromScroll(progress, this.scrollTimeRange);
  }

  private scheduleRender(): void {
    if (this.renderRequestId !== null) {
      return;
    }

    this.renderRequestId = window.requestAnimationFrame(() => {
      this.renderRequestId = null;
      this.renderFrame();
    });
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    const gl = this.gl;

    if (!canvas || !gl) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  private renderFrame(): void {
    const canvas = this.canvasRef?.nativeElement;
    const gl = this.gl;
    const program = this.program;
    const positionBuffer = this.positionBuffer;
    const positionLocation = this.positionLocation;

    if (
      !canvas ||
      !gl ||
      !program ||
      !positionBuffer ||
      positionLocation === null ||
      positionLocation < 0
    ) {
      return;
    }

    this.resizeCanvas();

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    if (this.timeLocation) {
      gl.uniform1f(this.timeLocation, this.shaderTime);
    }

    if (this.resolutionLocation) {
      gl.uniform3f(this.resolutionLocation, canvas.width, canvas.height, 1.0);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);

    if (!shader) {
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    }

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  private createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null {
    const program = gl.createProgram();

    if (!program) {
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    }

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
}