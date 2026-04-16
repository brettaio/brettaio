export interface RestaurantMenuItem {
  name: string;
  description?: string;
  price?: string;
}

export interface RestaurantImageAsset {
  src: string;
  alt: string;
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
  };
  socials?: {
    instagram?: string;
    facebook?: string;
  };
  menuSections: RestaurantMenuSection[];
}
