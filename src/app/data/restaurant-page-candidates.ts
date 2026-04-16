import singlePageIdealIngestJson from './restaurant-ingest/prospects.single-page-ideal.json';
import weakSiteRebuildIngestJson from './restaurant-ingest/prospects.weak-site-rebuild.json';

export type RestaurantOpportunityClass =
  | 'single_page_ideal'
  | 'weak_site_rebuild'
  | 'decent_existing_site'
  | 'manual_review';

export type RestaurantSiteType =
  | 'none'
  | 'social_only'
  | 'linktree'
  | 'marketplace_only'
  | 'single_page'
  | 'multi_page'
  | 'unknown';

export type RestaurantMenuSourceType = 'official' | 'third_party' | 'none';
export type RestaurantConfidence = 'high' | 'medium' | 'low';
export type RestaurantLocalMarketTier = 'primary' | 'nearby' | 'outside';
export type RestaurantSocialPlatform = 'instagram' | 'facebook' | 'other';

interface RestaurantUrlEvidence {
  url: string | null;
  confidence: RestaurantConfidence;
  reason: string;
}

interface RestaurantIngestMenu {
  found: boolean;
  url: string | null;
  sourceType: RestaurantMenuSourceType;
  reason: string;
}

interface RestaurantIngestSocialProfile {
  platform: RestaurantSocialPlatform;
  url: string | null;
  confidence: RestaurantConfidence;
  reason?: string;
}

interface RestaurantIngestProspect {
  officialWebsite: RestaurantUrlEvidence;
  siteType: RestaurantSiteType;
  menu: RestaurantIngestMenu;
  googleMaps: RestaurantUrlEvidence;
  socialProfiles: readonly RestaurantIngestSocialProfile[];
  opportunityClass: RestaurantOpportunityClass;
  summary: string;
  overallConfidence: RestaurantConfidence;
}

interface RestaurantIngestSource {
  type: string;
  url: string;
}

interface RestaurantIngestRecord {
  file: string;
  id: string;
  parsed: {
    prospect: RestaurantIngestProspect;
  };
  sources: readonly RestaurantIngestSource[];
}

interface RestaurantCandidateMetadata {
  slug: string;
  establishmentName: string;
  segmentName: string | null;
  city: string | null;
  stateProvince: string | null;
  address1: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  localMarketTier: RestaurantLocalMarketTier;
  icpScore?: number;
}

export interface RestaurantSocialProfile {
  platform: RestaurantSocialPlatform;
  url: string | null;
  confidence: RestaurantConfidence;
  reason?: string;
}

export interface RestaurantPageCandidate {
  sourceId: string;
  ingestFile: string;
  slug: string;
  routePath: string;
  establishmentName: string;
  segmentName: string | null;
  city: string | null;
  stateProvince: string | null;
  address1: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  officialWebsite: RestaurantUrlEvidence;
  siteType: RestaurantSiteType;
  menu: {
    found: boolean;
    url: string | null;
    urls: readonly string[];
    sourceType: RestaurantMenuSourceType;
    reason: string;
  };
  googleMaps: RestaurantUrlEvidence;
  socialProfiles: readonly RestaurantSocialProfile[];
  opportunityClass: RestaurantOpportunityClass;
  summary: string;
  overallConfidence: RestaurantConfidence;
  localMarketTier: RestaurantLocalMarketTier;
  icpScore?: number;
  sourceUrls: readonly string[];
}

const RESTAURANT_PAGE_ROUTE_PREFIX = 'restaurants' as const;

const INVALID_URL_VALUES = new Set(['', 'n/a', 'na', 'null', 'unknown']);

const OPPORTUNITY_PRIORITY: Record<RestaurantOpportunityClass, number> = {
  single_page_ideal: 0,
  weak_site_rebuild: 1,
  decent_existing_site: 2,
  manual_review: 3,
};

// Ingest payloads currently carry prospect analysis only.
// Route-ready business identity stays here until curator output includes it.
const CANDIDATE_METADATA_BY_FILE: Record<string, RestaurantCandidateMetadata> = {
  '3e635e4e-c756-4ad4-bda2-361c04f4de06.json': {
    slug: 'flying-m-restaurant-london-on',
    establishmentName: 'Flying M Restaurant',
    segmentName: 'truck stop restaurant',
    city: 'London',
    stateProvince: 'Ontario',
    address1: '7340 Colonel Talbot Rd',
    postalCode: null,
    phone: '+1-519-652-2310',
    email: null,
    localMarketTier: 'primary',
    icpScore: 96,
  },
  '40dcd122-d1ac-4a1b-995c-5f554111f553.json': {
    slug: 'scores-original-sports-grill-london-on',
    establishmentName: 'Scores Original Sports Grill',
    segmentName: 'sports bar',
    city: 'London',
    stateProvince: 'Ontario',
    address1: '1050 Kipps Lane',
    postalCode: 'N5Y 4S5',
    phone: null,
    email: null,
    localMarketTier: 'primary',
    icpScore: 84,
  },
  '8084e345-f933-4f7a-afe7-e1a69a72d70a.json': {
    slug: 'boss-hogs-bbq-london-on',
    establishmentName: 'Boss Hogs BBQ',
    segmentName: 'bbq',
    city: 'London',
    stateProvince: 'Ontario',
    address1: null,
    postalCode: null,
    phone: null,
    email: null,
    localMarketTier: 'primary',
    icpScore: 78,
  },
  '94abb048-c948-4fc7-b7ce-937c1d137b40.json': {
    slug: 'the-knotty-pine-restaurant-london-on',
    establishmentName: 'The Knotty Pine Restaurant',
    segmentName: 'family restaurant',
    city: 'London',
    stateProvince: 'Ontario',
    address1: '1100 Wellington Rd S',
    postalCode: null,
    phone: '+1-519-649-0488',
    email: null,
    localMarketTier: 'primary',
    icpScore: 81,
  },
  'f066a8e7-3d61-4057-b569-481c76fe09b3.json': {
    slug: 'fireside-grill-and-bar-london-on',
    establishmentName: 'Fireside Grill & Bar',
    segmentName: 'grill and bar',
    city: 'London',
    stateProvince: 'Ontario',
    address1: null,
    postalCode: null,
    phone: null,
    email: null,
    localMarketTier: 'primary',
    icpScore: 80,
  },
};

const ingestRecords = [
  ...(singlePageIdealIngestJson as readonly RestaurantIngestRecord[]),
  ...(weakSiteRebuildIngestJson as readonly RestaurantIngestRecord[]),
];

export const restaurantPageRoutePrefix = RESTAURANT_PAGE_ROUTE_PREFIX;

export function buildRestaurantPageCandidatePath(slug: string): string {
  return `/${RESTAURANT_PAGE_ROUTE_PREFIX}/${slug}`;
}

function getCandidateMetadata(file: string): RestaurantCandidateMetadata {
  const metadata = CANDIDATE_METADATA_BY_FILE[file];

  if (!metadata) {
    throw new Error(`Missing restaurant candidate metadata for ${file}.`);
  }

  return metadata;
}

function normalizeUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.replace(/^[('"<>]+|[)"'<>.,]+$/g, '');

  if (!normalizedValue || INVALID_URL_VALUES.has(normalizedValue.toLowerCase())) {
    return null;
  }

  const withScheme = /^[a-z]+:\/\//i.test(normalizedValue)
    ? normalizedValue
    : `https://${normalizedValue}`;

  try {
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}

function extractUrls(value: string | null | undefined): readonly string[] {
  if (!value) {
    return [];
  }

  const matches =
    value.match(/https?:\/\/[^\s)]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s)]*)?/gi) ?? [];

  return uniqueStrings(
    matches
      .map((match) => normalizeUrl(match))
      .filter((match): match is string => match !== null),
  );
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values));
}

function isGenericSocialUrl(
  url: string,
  platform: RestaurantSocialPlatform,
): boolean {
  try {
    const parsedUrl = new URL(url);
    const normalizedPath = parsedUrl.pathname.replace(/\/+$/g, '');

    if (platform === 'instagram') {
      return parsedUrl.hostname.includes('instagram.com') && normalizedPath === '';
    }

    if (platform === 'facebook') {
      return parsedUrl.hostname.includes('facebook.com') && normalizedPath === '';
    }

    return normalizedPath === '';
  } catch {
    return false;
  }
}

function normalizeSocialProfiles(
  profiles: readonly RestaurantIngestSocialProfile[],
): readonly RestaurantSocialProfile[] {
  return profiles.map((profile) => {
    const normalizedUrl = normalizeUrl(profile.url);

    return {
      ...profile,
      url:
        normalizedUrl && !isGenericSocialUrl(normalizedUrl, profile.platform)
          ? normalizedUrl
          : null,
    };
  });
}

function compareCandidates(
  left: RestaurantPageCandidate,
  right: RestaurantPageCandidate,
): number {
  const priorityDifference =
    OPPORTUNITY_PRIORITY[left.opportunityClass] -
    OPPORTUNITY_PRIORITY[right.opportunityClass];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return left.establishmentName.localeCompare(right.establishmentName);
}

function createRestaurantPageCandidate(
  record: RestaurantIngestRecord,
): RestaurantPageCandidate {
  const metadata = getCandidateMetadata(record.file);
  const prospect = record.parsed.prospect;
  const menuUrls = extractUrls(prospect.menu.url);

  return {
    sourceId: record.id,
    ingestFile: record.file,
    slug: metadata.slug,
    routePath: buildRestaurantPageCandidatePath(metadata.slug),
    establishmentName: metadata.establishmentName,
    segmentName: metadata.segmentName,
    city: metadata.city,
    stateProvince: metadata.stateProvince,
    address1: metadata.address1,
    postalCode: metadata.postalCode,
    phone: metadata.phone,
    email: metadata.email,
    officialWebsite: {
      ...prospect.officialWebsite,
      url: normalizeUrl(prospect.officialWebsite.url),
    },
    siteType: prospect.siteType,
    menu: {
      found: prospect.menu.found,
      url: menuUrls[0] ?? normalizeUrl(prospect.menu.url),
      urls: menuUrls,
      sourceType: prospect.menu.sourceType,
      reason: prospect.menu.reason,
    },
    googleMaps: {
      ...prospect.googleMaps,
      url: normalizeUrl(prospect.googleMaps.url),
    },
    socialProfiles: normalizeSocialProfiles(prospect.socialProfiles),
    opportunityClass: prospect.opportunityClass,
    summary: prospect.summary.trim(),
    overallConfidence: prospect.overallConfidence,
    localMarketTier: metadata.localMarketTier,
    icpScore: metadata.icpScore,
    sourceUrls: uniqueStrings(
      record.sources
        .map((source) => normalizeUrl(source.url))
        .filter((sourceUrl): sourceUrl is string => sourceUrl !== null),
    ),
  };
}

export const restaurantPageCandidates = ingestRecords
  .map((record) => createRestaurantPageCandidate(record))
  .sort(compareCandidates);

const restaurantPageCandidatesBySlug = new Map(
  restaurantPageCandidates.map((candidate) => [candidate.slug, candidate] as const),
);

const restaurantPageCandidatesBySourceId = new Map(
  restaurantPageCandidates.map((candidate) => [candidate.sourceId, candidate] as const),
);

export const restaurantPageCandidatePreview = restaurantPageCandidates[0] ?? null;

export function getRestaurantPageCandidates(): readonly RestaurantPageCandidate[] {
  return restaurantPageCandidates;
}

export function getRestaurantPageCandidateBySlug(
  slug: string,
): RestaurantPageCandidate | null {
  return restaurantPageCandidatesBySlug.get(slug) ?? null;
}

export function getRestaurantPageCandidateBySourceId(
  sourceId: string,
): RestaurantPageCandidate | null {
  return restaurantPageCandidatesBySourceId.get(sourceId) ?? null;
}
