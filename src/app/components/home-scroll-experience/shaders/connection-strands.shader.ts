export const CONNECTION_STRANDS_FRAGMENT_SHADER = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float strand(vec2 p, float offset, float speed, float width) {
    float y = sin(p.x * 3.0 + iTime * speed + offset) * 0.18;
    y += sin(p.x * 7.0 - iTime * speed * 0.7 + offset) * 0.045;

    float line = smoothstep(width, 0.0, abs(p.y - y));
    float pulse = 0.55 + 0.45 * sin(iTime * 1.2 + p.x * 4.0 + offset);

    return line * pulse;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    vec3 deep = vec3(0.015, 0.018, 0.045);
    vec3 blue = vec3(0.02, 0.42, 0.95);
    vec3 violet = vec3(0.45, 0.16, 0.72);
    vec3 warm = vec3(0.95, 0.62, 0.34);

    float vignette = smoothstep(1.15, 0.12, length(p));
    float field = 0.0;

    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      vec2 q = p;
      q.y += (fi - 4.0) * 0.105;
      q.x += sin(iTime * 0.08 + fi) * 0.08;

      field += strand(q, fi * 1.7, 0.55 + hash(fi) * 0.5, 0.012 + hash(fi + 3.0) * 0.01);
    }

    float bridge = smoothstep(0.0, 1.2, field);
    float centerGlow = smoothstep(0.85, 0.0, length(p - vec2(0.12 * sin(iTime * 0.18), 0.0)));

    vec3 color = deep;
    color = mix(color, blue, bridge * 0.55);
    color = mix(color, violet, bridge * 0.35);
    color += warm * centerGlow * 0.18;
    color += vec3(0.9, 0.95, 1.0) * pow(bridge, 2.4) * 0.65;

    color *= 0.68 + vignette * 0.62;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
