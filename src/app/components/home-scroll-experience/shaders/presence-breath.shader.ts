export const PRESENCE_BREATH_FRAGMENT_SHADER = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 7; i++) {
      value += amplitude * noise(p);
      p *= 2.04;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float breath = 0.5 + 0.5 * sin(iTime * 0.45);

    // Scroll-driven travel. Higher multiplier = more movement across the full scroll.
    float travel = iTime * 0.34;

    vec2 q = p;
    q.x += travel;
    q.y += sin(iTime * 0.28) * 0.18;

    // Parallax layers so it feels like moving through atmosphere, not a flat backdrop.
    float farClouds = fbm(q * 1.15 + vec2(travel * 0.35, 0.0));
    float midClouds = fbm(q * 2.05 + vec2(-travel * 0.72, travel * 0.18));
    float nearClouds = fbm(q * 3.3 + vec2(travel * 1.15, -travel * 0.28));

    float cloud =
      smoothstep(0.30, 0.82, farClouds * 0.52 + midClouds * 0.34 + nearClouds * 0.2);

    float opening = smoothstep(1.05, 0.05, length(p - vec2(0.08 * sin(iTime * 0.2), 0.0)));
    float horizon = smoothstep(-0.75, 0.75, p.y);
    float vignette = smoothstep(1.25, 0.12, length(p));

    vec3 skyTop = vec3(0.30, 0.48, 0.72);
    vec3 skyBottom = vec3(0.78, 0.68, 0.58);
    vec3 cloudLight = vec3(1.0, 0.88, 0.72);
    vec3 cloudWarm = vec3(0.95, 0.58, 0.34);
    vec3 depthBlue = vec3(0.06, 0.14, 0.28);

    vec3 sky = mix(skyBottom, skyTop, horizon);
    vec3 color = sky;

    color = mix(color, cloudLight, cloud * 0.58);
    color += cloudWarm * cloud * breath * 0.16;
    color += vec3(0.18, 0.24, 0.32) * opening * 0.18;

    // Keep the edges cinematic, but do not crush the whole image into black.
    color = mix(depthBlue, color, 0.72 + vignette * 0.28);

    // Lift exposure.
    color += vec3(0.08, 0.07, 0.055);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
