export const CLOUD_PRESENCE_FRAGMENT_SHADER = `
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

    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float breath = 0.5 + 0.5 * sin(iTime * 0.42);
    float drift = iTime * 0.045;

    vec2 cloudUv = p * 1.55;
    cloudUv.x += drift;
    cloudUv.y += sin(iTime * 0.12) * 0.08;

    float softClouds = fbm(cloudUv);
    float detail = fbm(cloudUv * 2.4 + vec2(-drift * 1.7, drift * 0.6));
    float cloud = smoothstep(0.32, 0.88, softClouds * 0.72 + detail * 0.34);

    float vignette = smoothstep(1.05, 0.15, length(p));
    float horizon = smoothstep(-0.55, 0.65, p.y);

    vec3 deepNavy = vec3(0.018, 0.035, 0.075);
    vec3 duskBlue = vec3(0.055, 0.19, 0.36);
    vec3 warmLinen = vec3(0.92, 0.78, 0.62);
    vec3 softRose = vec3(0.55, 0.24, 0.28);

    vec3 sky = mix(deepNavy, duskBlue, horizon);
    vec3 warmth = mix(softRose, warmLinen, breath);
    vec3 color = mix(sky, warmth, cloud * 0.58);

    color += vec3(0.12, 0.17, 0.22) * vignette * cloud;
    color *= 0.72 + vignette * 0.42;

    gl_FragColor = vec4(color, 1.0);
  }
`;
