export type ScrollExperienceAction = {
  label: string;
  href: string;
  variant?: 'solid' | 'outline';
};

export type ScrollExperienceFrame = {
  eyebrow?: string;
  titleLines: string[];
  bodyLines?: string[];
  actions?: ScrollExperienceAction[];
};

export type ScrollExperienceVectorConfig = {
  accentA?: readonly [number, number, number];
  accentB?: readonly [number, number, number];
  velocity?: number;
  density?: number;
  depth?: number;
  warmth?: number;
};

export type ScrollExperienceConfig = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  frames: ScrollExperienceFrame[];
  frameWeights: number[];
  scrollTimeRange: number;
  fragmentShader?: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  vectors?: ScrollExperienceVectorConfig;
};
