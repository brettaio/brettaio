export const GRATITUDE_TUNNEL_FRAGMENT_SHADER = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;

  #define PI 3.14159265359

  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  vec3 path(float z) {
    return vec3(
      12.0 * cos(z * 0.10),
      12.0 * cos(z * 0.12),
      z
    );
  }

  float carvedTexture(vec3 p, float frequency, float strength, float scale) {
    return abs(dot(sin(frequency * p * scale), vec3(strength))) / scale;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    if (abs(uv.y) > 0.405) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    float T = iTime * 4.0 + 5.0 + 5.0 * sin(iTime * 0.3);
    float sineTime = sin(iTime);

    vec3 ro = path(T);
    vec3 forward = normalize(path(T + 4.0) - ro);
    vec3 right = normalize(vec3(forward.z, 0.0, -forward.x));
    vec3 up = normalize(cross(right, forward));

    uv *= rot(0.08 * sin(iTime * 0.55));

    vec3 rd = normalize(vec3(uv, 1.0) * mat3(-right, up, forward));

    vec3 colorAccum = vec3(0.0);
    float distanceTravelled = 0.0;
    float stepSize = 0.15;
    float orbDistance = 1.0;

    for (int i = 0; i < 34; i++) {
      if (distanceTravelled > 36.0) {
        break;
      }

      vec3 p = ro + rd * distanceTravelled;
      vec3 center = path(p.z);

      vec2 local = p.xy - center.xy;

      float radius = 4.0 + 2.0 * cos(p.z * 0.6);
      float tunnel = radius - min(
        length(local),
        length(local - vec2(6.0, 0.0))
      );

      tunnel += carvedTexture(p, 4.0, 0.25, 0.10);
      tunnel += carvedTexture(p, T + 8.0, 0.22, 2.0);

      vec3 orbPosition = vec3(
        center.x + sineTime,
        center.y + sineTime * 2.0,
        6.0 + T + sineTime * 2.0
      );

      orbDistance = length(p - orbPosition) - 0.015;

      stepSize = min(orbDistance, 0.01 + 0.3 * abs(tunnel));
      stepSize = max(stepSize, 0.018);

      float tunnelGlow = 1.0 / max(stepSize, 0.035);
      float orbGlow = 1.0 / max(orbDistance, 0.6);

      vec3 gratitudeWarmth = vec3(1.0, 0.56, 0.18);
      vec3 signalBlue = vec3(0.12, 0.35, 1.0);
      vec3 linen = vec3(1.0, 0.86, 0.62);

      float pulse = 0.5 + 0.5 * sin(p.z * 0.45 - iTime * 3.0);

      colorAccum += tunnelGlow * mix(gratitudeWarmth, signalBlue, pulse) * 0.035;
      colorAccum += orbGlow * linen * 0.42;

      distanceTravelled += stepSize;
    }

    vec3 color = colorAccum * colorAccum / 18.0;

    float vignette = smoothstep(1.05, 0.18, length(uv));
    color *= 0.58 + vignette * 0.82;

    color = pow(clamp(color, 0.0, 1.0), vec3(0.78));

    gl_FragColor = vec4(color, 1.0);
  }
`;
