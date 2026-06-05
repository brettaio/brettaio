export const GRATITUDE_FIELD_FRAGMENT_SHADER = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float glow(vec2 p, vec2 c, float r) {
    float d = length(p - c);
    return smoothstep(r, 0.0, d);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    vec3 deep = vec3(0.035, 0.018, 0.035);
    vec3 amber = vec3(0.95, 0.52, 0.18);
    vec3 linen = vec3(0.98, 0.82, 0.62);
    vec3 rose = vec3(0.55, 0.18, 0.24);

    float breath = 0.5 + 0.5 * sin(iTime * 0.38);
    float center = glow(p, vec2(0.15 * sin(iTime * 0.16), -0.05), 0.95);

    float particles = 0.0;

    for (int i = 0; i < 34; i++) {
      float fi = float(i);
      vec2 seed = vec2(hash(vec2(fi, 1.3)), hash(vec2(fi, 9.7)));
      vec2 pos = seed * 2.0 - 1.0;

      pos.x += sin(iTime * (0.08 + seed.x * 0.08) + fi) * 0.06;
      pos.y += cos(iTime * (0.07 + seed.y * 0.06) + fi * 1.4) * 0.05;

      float size = 0.018 + seed.x * 0.035;
      float pulse = 0.65 + 0.35 * sin(iTime * 0.9 + fi);
      particles += glow(p, pos, size) * pulse;
    }

    float horizon = smoothstep(-0.7, 0.65, p.y);
    float vignette = smoothstep(1.15, 0.1, length(p));

    vec3 color = mix(deep, rose, horizon * 0.35);
    color = mix(color, amber, center * 0.35);
    color += linen * particles * 0.5;
    color += amber * center * (0.16 + breath * 0.12);
    color *= 0.68 + vignette * 0.58;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
