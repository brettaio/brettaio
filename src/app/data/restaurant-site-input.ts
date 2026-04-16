export interface RestaurantMenuItem {
  name: string;
  description?: string;
  price?: string;
}

export interface RestaurantImageAsset {
  src: string;
  alt: string;
}

export interface RestaurantActionLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface RestaurantHighlight {
  title: string;
  description: string;
}

export interface RestaurantPromoCard {
  title: string;
  description: string;
  image: RestaurantImageAsset;
}

export interface RestaurantMenuSection {
  title: string;
  description?: string;
  items: RestaurantMenuItem[];
}

export interface RestaurantHoursRow {
  day: string;
  open: string;
  close: string;
}

export interface RestaurantSeoInput {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  canonicalUrl?: string;
  twitterCard?: string;
  socialImage?: RestaurantImageAsset;
}

export interface RestaurantPageCopy {
  locationLabel?: string;
  heroOverlayEyebrow?: string;
  heroOverlayTitle?: string;
  featuredEyebrow?: string;
  featuredTitle?: string;
  featuredDescription?: string;
  venueEyebrow?: string;
  venueTitle?: string;
  venueDescription?: string;
  menuEyebrow?: string;
  menuTitle?: string;
  menuDescription?: string;
  highlightsEyebrow?: string;
  visitEyebrow?: string;
  visitTitle?: string;
}

export interface RestaurantFeatureSection {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  image?: RestaurantImageAsset;
  cta?: RestaurantActionLink;
}

export interface RestaurantNewsletterSignup {
  formName: string;
  title: string;
  description: string;
  submitLabel: string;
  action?: string;
  privacyNote?: string;
  consentLabel: string;
}

export interface RestaurantSiteInput {
  slug: string;
  name: string;
  city: string;
  province: string;
  tagline: string;
  summary: string;
  address: string;
  phone: string;
  hours: RestaurantHoursRow[];
  featureBadges: string[];
  heroImage: RestaurantImageAsset;
  galleryImages: RestaurantImageAsset[];
  highlights: RestaurantHighlight[];
  promoCards: RestaurantPromoCard[];
  heroCtas: {
    call?: string;
    directions?: string;
    menu?: string;
    links?: RestaurantActionLink[];
  };
  socials?: {
    instagram?: string;
    facebook?: string;
  };
  seo?: RestaurantSeoInput;
  pageCopy?: RestaurantPageCopy;
  venueSections?: RestaurantFeatureSection[];
  newsletterSignup?: RestaurantNewsletterSignup;
  menuSections: RestaurantMenuSection[];
}
