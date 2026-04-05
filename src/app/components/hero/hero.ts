import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bretta-hero',
  imports: [RouterLink],
  template: `
    <!--
      OUTER SCROLL SCENE

      This is now a 300vh section.
      The point is not for the whole block to stay visible at once.
      The point is to create scroll distance while the inner stage stays pinned.
    -->
    <section
      #heroSection
      class="relative bg-black text-white"
      style="min-height: 400vh;"
    >
      <!--
        STICKY STAGE

        This stays pinned to the viewport while the outer section scrolls past.
        Everything visual lives inside this stage:
        - shader background
        - overlays
        - text content
      -->
      <div class="sticky top-0 h-screen overflow-hidden">
        <!--
          SHADER CANVAS

          Full-screen background vector / shader surface.
        -->
        <canvas
          #shaderCanvas
          class="absolute inset-0 h-full w-full"
          aria-hidden="true"
        ></canvas>

        <!--
          DARK INTENSITY WASH

          Keeps the shader from overpowering the text.
        -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!--
          DIRECTIONAL GRADIENT

          Helps ground the content and shape contrast.
        -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-black/60"
        ></div>

        <!--
          CONTENT LAYER

          This sits above the background and is what we animate upward on scroll.
        -->
        <div class="absolute inset-0">
          <div
            class="mx-auto flex h-full max-w-7xl items-end px-6 py-24 lg:px-8 lg:py-32"
          >
            <div
              class="max-w-3xl will-change-transform"
              [style.transform]="contentTransform()"
              [style.opacity]="contentOpacity()"
            >
              <!-- Eyebrow -->
              <p
                class="mb-6 text-sm font-medium uppercase tracking-[0.24em] text-white/70"
              >
                {{ eyebrow() }}
              </p>

              <!-- Main heading -->
              <h1
                class="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                {{ title() }}
              </h1>

              <!-- Supporting copy -->
              <p class="mt-8 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
                {{ copy() }}
              </p>

              <!-- CTA row -->
              <div class="mt-10 flex flex-wrap items-center gap-4">
                @if (isInternalRoute(primaryCtaHref())) {
                  <a
                    [routerLink]="primaryCtaHref()"
                    class="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    {{ primaryCtaLabel() }}
                  </a>
                } @else {
                  <a
                    [attr.href]="primaryCtaHref()"
                    class="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    {{ primaryCtaLabel() }}
                  </a>
                }

                @if (isInternalRoute(secondaryCtaHref())) {
                  <a
                    [routerLink]="secondaryCtaHref()"
                    class="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                  >
                    {{ secondaryCtaLabel() }}
                  </a>
                } @else {
                  <a
                    [attr.href]="secondaryCtaHref()"
                    class="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                  >
                    {{ secondaryCtaLabel() }}
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class Hero implements AfterViewInit {
  /*
    SECTION REFERENCE

    We use this to calculate scroll progress for the whole 300vh scene.
  */
  @ViewChild('heroSection', { static: true })
  private readonly sectionRef?: ElementRef<HTMLElement>;

  /*
    CANVAS REFERENCE

    WebGL renders into this.
  */
  @ViewChild('shaderCanvas', { static: true })
  private readonly canvasRef?: ElementRef<HTMLCanvasElement>;

  /*
    CONTENT INPUTS

    Parent-driven content.
  */
  readonly eyebrow = input('Independent digital systems');
  readonly title = input('Sharp digital work, built with intent.');
  readonly copy = input(
    'I design, structure, and build commercial digital experiences with a clear point of view — rigorous in execution, refined in language, and focused on useful outcomes.'
  );
  readonly primaryCtaLabel = input('Start a conversation');
  readonly primaryCtaHref = input('/contact');
  readonly secondaryCtaLabel = input('See selected work');
  readonly secondaryCtaHref = input('/work');

  /*
    CONTENT MOTION STATE

    These are bound directly into the template.
    As scroll progress changes, we update transform + opacity.
  */
  protected readonly contentTransform = signal('translate3d(0, 0px, 0)');
  protected readonly contentOpacity = signal(1);

  /*
    ANGULAR / PLATFORM SERVICES
  */
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  /*
    WEBGL STATE
  */
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private vertexShader: WebGLShader | null = null;
  private fragmentShader: WebGLShader | null = null;
  private positionLocation: number | null = null;
  private timeLocation: WebGLUniformLocation | null = null;
  private resolutionLocation: WebGLUniformLocation | null = null;

  /*
    RENDER THROTTLE

    We do not run a perpetual animation loop.
    We only render when scroll/resize changes.
  */
  private renderRequestId: number | null = null;

  /*
    SCROLL-DRIVEN SHADER TIME

    Instead of free-running motion,
    the shader advances based on section scroll progress.
  */
  private shaderTime = 0;

  /*
    MASTER FEEL CONTROLS

    scrollTimeRange:
    How much the shader evolves from the top of the scene to the bottom.

    You can lower this if the background still feels too active.

    textTravelMultiplier:
    How far upward the text block moves relative to viewport height.
  */
  private readonly scrollTimeRange = 0.5;
  private readonly textTravelMultiplier = 0.95;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.startShaderScene();
  }

  /*
    INTERNAL VS EXTERNAL LINK CHECK

    This lets the hero support:
    - internal Angular routes like /work
    - external links like mailto:hello@bretta.io
  */
  protected isInternalRoute(value: string): boolean {
    return value.startsWith('/');
  }

  /*
    START THE SCENE

    Build WebGL once, then update on scroll + resize.
  */
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

    const vertexShaderSource = `
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
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

    const vertexShader = this.createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
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
      this.resizeCanvas();
      this.updateSceneFromScroll();
      this.scheduleRender();
    };

    this.ngZone.runOutsideAngular(() => {
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

  /*
    UPDATE THE WHOLE SCENE FROM SCROLL

    This drives both:
    - shader time
    - text motion
  */
  private updateSceneFromScroll(): void {
    const section = this.sectionRef?.nativeElement;

    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;

    /*
      Because the section is 300vh and the stage is sticky 100vh,
      the useful scroll travel is section height minus viewport height.
    */
    const maxTravel = Math.max(rect.height - viewportHeight, 1);

    /*
      When the section top reaches the top of the viewport,
      progress begins. As the section keeps scrolling, progress rises to 1.
    */
    const rawProgress = -rect.top / maxTravel;
    const progress = this.clamp(rawProgress, 0, 1);

    /*
      Smooth the motion a bit.
    */
    const easedProgress = this.smoothstep(0, 1, progress);

    /*
      SCROLL-DRIVEN SHADER TIME

      Lower range = calmer background motion.
    */
    this.shaderTime = easedProgress * this.scrollTimeRange;

    /*
      TEXT MOTION

      The text starts mostly stable,
      then travels upward and fades away as the scene progresses.
    */
    const moveProgress = this.smoothstep(0.08, 0.82, progress);
    const fadeProgress = this.smoothstep(0.18, 0.72, progress);

    const translateY = -viewportHeight * this.textTravelMultiplier * moveProgress;
    const scale = 1 - 0.08 * moveProgress;
    const opacity = 1 - fadeProgress;

    this.contentTransform.set(
      `translate3d(0, ${translateY}px, 0) scale(${scale})`
    );
    this.contentOpacity.set(this.clamp(opacity, 0, 1));
  }

  /*
    SCHEDULE A SINGLE RENDER
  */
  private scheduleRender(): void {
    if (this.renderRequestId !== null) {
      return;
    }

    this.renderRequestId = window.requestAnimationFrame(() => {
      this.renderRequestId = null;
      this.renderFrame();
    });
  }

  /*
    KEEP THE CANVAS SHARP
  */
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

  /*
    DRAW EXACTLY ONE FRAME
  */
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

  /*
    SHADER COMPILATION
  */
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

  /*
    PROGRAM LINKING
  */
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

  /*
    SMALL MATH HELPERS
  */
  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private smoothstep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }
}