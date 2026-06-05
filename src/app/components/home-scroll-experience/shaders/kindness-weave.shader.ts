export const KINDNESS_WEAVE_FRAGMENT_SHADER = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;

  float line(vec2 p, float y, float width) {
    return smoothstep(width, 0.0, abs(p.y - y));
  }

  float verticalLine(vec2 p, float x, float width) {
    return smoothstep(width, 0.0, abs(p.x - x));
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    vec3 deep = vec3(0.018, 0.014, 0.04);
    vec3 blue = vec3(0.03, 0.24, 0.52);
    vec3 violet = vec3(0.36, 0.13, 0.52);
    vec3 warm = vec3(0.95, 0.54, 0.28);
    vec3 linen = vec3(0.95, 0.86, 0.72);

    float woven = 0.0;
    float warmThread = 0.0;

    for (int i = 0; i < 9; i++) {
      float fi = float(i) - 4.0;
      float offset = fi * 0.12;

      float waveA = sin(p.x * 4.0 + iTime * 0.45 + fi) * 0.045;
      float waveB = cos(p.y * 4.0 - iTime * 0.32 + fi) * 0.045;

      woven += line(p, offset + waveA, 0.012);
      woven += verticalLine(p, offset + waveB, 0.009);

      warmThread += line(p, offset * 0.82 - waveA * 1.4, 0.006);
    }

    float center = smoothstep(0.95, 0.0, length(p));
    float vignette = smoothstep(1.2, 0.16, length(p));
    float breath = 0.5 + 0.5 * sin(iTime * 0.35);

    vec3 color = deep;
    color = mix(color, blue, center * 0.4);
    color = mix(color, violet, min(woven * 0.14, 0.45));
    color += linen * min(woven, 2.0) * 0.08;
    color += warm * warmThread * (0.12 + breath * 0.12);
    color *= 0.7 + vignette * 0.6;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;
