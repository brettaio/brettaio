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
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'bretta-hero',
  template: `
    <!--
      OUTER HERO SECTION

      - relative: lets absolutely-positioned children anchor to this section
      - isolate: creates a new stacking context for layered effects
      - overflow-hidden: clips the canvas and overlays to the section bounds
      - bg-black: fallback background while shader loads
    -->
    <section class="relative isolate overflow-hidden bg-black text-white">
      <!--
        SHADER CANVAS

        This is the actual WebGL surface.
        The shader renders into this full-bleed canvas.
      -->
      <canvas
        #shaderCanvas
        class="absolute inset-0 h-full w-full"
        aria-hidden="true"
      ></canvas>

      <!--
        OVERLAY 1: SOLID BLACK WASH

        This is the big intensity control.
        bg-black/50 = 50% black over the shader.
        Raise this number if the shader is too loud.
        Lower it if you want more of the raw shader visible.
      -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!--
        OVERLAY 2: SOFT DIRECTIONAL GRADIENT

        This shapes the image a bit more so the lower area
        and edges feel grounded for content.
      -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-black/50"
      ></div>

      <!--
        CONTENT WRAPPER

        This holds the text and buttons above the shader.
        "relative" ensures it sits above the overlays/canvas.
      -->
      <div
        class="relative mx-auto flex min-h-[90vh] max-w-7xl items-end px-6 py-24 lg:px-8 lg:py-32"
      >
        <!--
          TEXT COLUMN

          Keeps the authored content in a controlled readable width.
        -->
        <div class="max-w-3xl">
          <!-- Small top label / eyebrow -->
          <p
            class="mb-6 text-sm font-medium uppercase tracking-[0.24em] text-white/70"
          >
            {{ eyebrow() }}
          </p>

          <!-- Main hero heading -->
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
            <!-- Primary CTA -->
            <a
              [href]="primaryCtaHref()"
              class="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              {{ primaryCtaLabel() }}
            </a>

            <!-- Secondary CTA -->
            <a
              [href]="secondaryCtaHref()"
              class="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              {{ secondaryCtaLabel() }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [],
})
export class Hero implements AfterViewInit {
  /*
    TEMPLATE REFERENCE TO THE CANVAS

    Angular grabs the <canvas> element after the view is created
    so we can initialize WebGL against it.
  */
  @ViewChild('shaderCanvas', { static: true })
  private readonly canvasRef?: ElementRef<HTMLCanvasElement>;

  /*
    INPUT SIGNALS

    These let the parent component pass content into the hero.
    Because these are Angular input signals, we read them in the
    template with function-call syntax: eyebrow(), title(), etc.
  */
  readonly eyebrow = input('Independent digital systems');
  readonly title = input('Sharp digital work, built with intent.');
  readonly copy = input(
    'I design, structure, and build commercial digital experiences with a clear point of view — rigorous in execution, refined in language, and focused on useful outcomes.'
  );
  readonly primaryCtaLabel = input('Start a conversation');
  readonly primaryCtaHref = input('#contact');
  readonly secondaryCtaLabel = input('See selected work');
  readonly secondaryCtaHref = input('#work');

  /*
    ANGULAR SERVICE INJECTIONS

    PLATFORM_ID: lets us detect browser vs server
    NgZone: lets the animation run outside Angular change detection
    DestroyRef: lets us clean up animation and listeners on destroy
  */
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  /*
    We store the current animation frame ID so it can be cancelled
    when the component is destroyed.
  */
  private animationFrameId: number | null = null;

  /*
    AFTER VIEW INIT

    We wait until the view exists before touching the canvas.
    Also, because your app uses SSR, we only run WebGL in the browser.
  */
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.startShader();
  }

  /*
    START SHADER

    This method:
    1. gets the canvas
    2. creates the WebGL context
    3. compiles shaders
    4. links the shader program
    5. creates a full-screen quad
    6. starts the render loop
  */
  private startShader(): void {
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

    /*
      VERTEX SHADER

      This is very small.
      It simply draws a full-screen rectangle so the fragment shader
      can run once per pixel across the canvas.
    */
    const vertexShaderSource = `
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    /*
      FRAGMENT SHADER

      This is the Shadertoy-style scene ported into WebGL.
      iResolution and iTime are passed in from TypeScript.
    */
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
      return;
    }

    /*
      POSITION BUFFER

      This defines a full-screen quad using four points.
      The fragment shader will be run across this area.
    */
    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) {
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

    /*
      LOOK UP SHADER INPUT LOCATIONS

      - a_position = geometry attribute
      - iTime = elapsed time in seconds
      - iResolution = canvas resolution
    */
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');

    /*
      RESIZE HANDLER

      Keeps the canvas in sync with CSS size and device pixel ratio
      so the shader stays crisp.
    */
    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const start = performance.now();

    /*
      RENDER LOOP

      Called every animation frame.
      Updates time and resolution uniforms, then draws.
    */
    const render = (now: number): void => {
      resize();

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      if (timeLocation) {
        gl.uniform1f(timeLocation, (now - start) * 0.001);
      }

      if (resolutionLocation) {
        gl.uniform3f(resolutionLocation, canvas.width, canvas.height, 1.0);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      this.animationFrameId = window.requestAnimationFrame(render);
    };

    const onResize = (): void => resize();

    /*
      RUN OUTSIDE ANGULAR

      This prevents Angular change detection from running every frame.
      That keeps the shader animation efficient.
    */
    this.ngZone.runOutsideAngular(() => {
      resize();
      this.animationFrameId = window.requestAnimationFrame(render);
      window.addEventListener('resize', onResize, { passive: true });
    });

    /*
      CLEANUP

      Cancel animation, remove listeners, free GPU resources.
    */
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('resize', onResize);

      if (this.animationFrameId !== null) {
        window.cancelAnimationFrame(this.animationFrameId);
      }

      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    });
  }

  /*
    CREATE SHADER

    Compiles either a vertex shader or fragment shader.
    Returns null if compilation fails.
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
    CREATE PROGRAM

    Links the compiled vertex and fragment shaders into one GPU program.
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
}