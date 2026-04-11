export type HeroStageFrameState = {
  opacity: number;
  bodyOpacity: number;
  ctaOpacity: number;
  blur: number;
  translateY: number;
  scale: number;
  pointerEvents: 'auto' | 'none';
};

export type HeroFrameRange = {
  start: number;
  end: number;
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function buildFrameRanges(weights: number[]): HeroFrameRange[] {
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = 0;

  return weights.map((weight) => {
    const length = weight / total;
    const range = {
      start: cursor,
      end: cursor + length,
    };

    cursor += length;
    return range;
  });
}

export function buildSceneHeight(
  weights: number[],
  unitVh = 58,
  offsetVh = 68,
  minVh = 460
): string {
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  const vh = totalWeight * unitVh + offsetVh;
  return `${Math.max(minVh, vh)}vh`;
}

export function buildSceneExitProgress(progress: number): number {
  return smoothstep(0.91, 0.993, progress);
}

export function buildSceneOpacity(progress: number): number {
  return 1 - buildSceneExitProgress(progress);
}

export function buildSceneTransform(progress: number): string {
  const exit = buildSceneExitProgress(progress);
  const scale = 1 - exit * 0.14;
  const translateY = -40 * exit;

  return `translate3d(0, ${translateY}px, 0) scale(${scale})`;
}

export function buildShaderTimeFromScroll(
  progress: number,
  scrollTimeRange: number
): number {
  const motionProgress = smoothstep(0.0, 1.0, progress);
  const exitBoost = smoothstep(0.83, 1.0, progress) * 0.78;

  return 0.18 + motionProgress * scrollTimeRange + exitBoost;
}

export function buildHeroFrameState(
  frameIndex: number,
  frameCount: number,
  range: HeroFrameRange,
  progress: number
): HeroStageFrameState {
  const local =
    (progress - range.start) / Math.max(range.end - range.start, 0.0001);

  if (frameIndex === 0 && progress <= 0.002) {
    return {
      opacity: 1,
      bodyOpacity: 1,
      ctaOpacity: 1,
      blur: 0,
      translateY: 0,
      scale: 1,
      pointerEvents: 'auto',
    };
  }

  const isFinalFrame = frameIndex === frameCount - 1;

  const enter = smoothstep(-0.16, 0.06, local);
  const exit = isFinalFrame
    ? smoothstep(0.975, 0.9995, local)
    : smoothstep(0.9, 0.998, local);

  const visibility = clamp(enter * (1 - exit), 0, 1);

  const bodyReveal = smoothstep(-0.1, 0.05, local);
  const ctaReveal = smoothstep(-0.04, 0.1, local);

  const translateIn = 3 * (1 - enter);
  const translateOut = isFinalFrame ? -6 * exit : -12 * exit;
  const translateY = translateIn + translateOut;

  const scale = isFinalFrame
    ? 0.999 + enter * 0.003 - exit * 0.003
    : 0.999 + enter * 0.003 - exit * 0.006;

  const blur = isFinalFrame ? 0.5 * (1 - visibility) : 0.9 * (1 - visibility);

  return {
    opacity: visibility,
    bodyOpacity: visibility * bodyReveal,
    ctaOpacity: visibility * ctaReveal,
    blur,
    translateY,
    scale,
    pointerEvents: visibility > 0.08 ? 'auto' : 'none',
  };
}