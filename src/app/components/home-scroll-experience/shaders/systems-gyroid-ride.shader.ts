export const SYSTEMS_GYROID_RIDE_FRAGMENT_SHADER = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;

  #define FAR 42.0
  #define PI 3.14159265359

  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  float gyroid(vec3 p) {
    return dot(sin(p), cos(p.zxy));
  }

  float mapScene(vec3 p) {
    p.xy *= rot(0.28 * sin(p.z * 0.13 + iTime * 0.35));
    p.xz *= rot(0.18 * sin(iTime * 0.25));

    float tunnel = abs(length(p.xy) - 2.15) - 0.18;
    float lattice = abs(gyroid(p * 1.65 + vec3(0.0, 0.0, iTime * 0.55))) - 0.28;
    float ribs = abs(sin(p.z * 1.7 + iTime * 1.2)) * 0.11;

    return max(tunnel, lattice) - ribs;
  }

  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);

    return normalize(vec3(
      mapScene(p + e.xyy) - mapScene(p - e.xyy),
      mapScene(p + e.yxy) - mapScene(p - e.yxy),
      mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
  }

  float march(vec3 ro, vec3 rd) {
    float t = 0.0;

    for (int i = 0; i < 96; i++) {
      vec3 p = ro + rd * t;
      float d = mapScene(p);

      if (abs(d) < 0.002 || t > FAR) {
        break;
      }

      t += d * 0.72;
    }

    return t;
  }

  vec3 shade(vec3 ro, vec3 rd, float t) {
    vec3 p = ro + rd * t;
    vec3 n = getNormal(p);

    vec3 lightA = normalize(vec3(0.5, 0.8, -0.35));
    vec3 lightB = normalize(vec3(-0.9, 0.25, 0.6));

    float diffA = max(dot(n, lightA), 0.0);
    float diffB = max(dot(n, lightB), 0.0);
    float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 2.2);

    float signal = 0.5 + 0.5 * sin(p.z * 0.9 + iTime * 1.4);
    float pulse = 0.5 + 0.5 * sin(length(p.xy) * 5.0 - iTime * 2.2);

    vec3 navy = vec3(0.018, 0.025, 0.055);
    vec3 blue = vec3(0.02, 0.32, 0.9);
    vec3 violet = vec3(0.42, 0.14, 0.68);
    vec3 amber = vec3(0.95, 0.48, 0.18);
    vec3 linen = vec3(0.92, 0.82, 0.68);

    vec3 base = mix(blue, violet, signal);
    vec3 color = navy;
    color += base * diffA * 0.95;
    color += amber * diffB * 0.55;
    color += linen * fresnel * 0.75;
    color += amber * pulse * fresnel * 0.18;

    float fog = 1.0 - exp(-0.018 * t * t);
    color = mix(color, navy, fog * 0.78);

    return color;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float travel = iTime * 2.35;

    vec3 ro = vec3(
      0.72 * sin(iTime * 0.45),
      0.42 * cos(iTime * 0.36),
      travel
    );

    vec3 target = vec3(
      0.9 * sin(iTime * 0.42 + 0.8),
      0.55 * cos(iTime * 0.31 + 0.5),
      travel + 4.0
    );

    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(right, forward));

    uv *= rot(0.08 * sin(iTime * 0.8));

    vec3 rd = normalize(forward + uv.x * right + uv.y * up);

    float t = march(ro, rd);

    vec3 color;

    if (t > FAR) {
      float depthGlow = 0.5 + 0.5 * sin(uv.x * 8.0 + uv.y * 5.0 + iTime);
      color = vec3(0.01, 0.018, 0.04) + vec3(0.02, 0.07, 0.16) * depthGlow;
    } else {
      color = shade(ro, rd, t);
    }

    float vignette = smoothstep(1.25, 0.2, length(uv));
    color *= 0.55 + vignette * 0.68;

    color = pow(clamp(color, 0.0, 1.0), vec3(0.82));

    gl_FragColor = vec4(color, 1.0);
  }
`;
