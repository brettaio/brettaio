import type { RestaurantSiteInput } from '../restaurant-site-input';

const scoresImageBase =
  'https://imagedelivery.net/aPDHOWLzkdlEAMvg3YLQug';

function scoresImage(imageId: string, alt: string): {
  src: string;
  alt: string;
} {
  return {
    src: `${scoresImageBase}/${imageId}/fit=cover,width=1600`,
    alt,
  };
}

export const scoresOriginalSportsGrill: RestaurantSiteInput = {
  slug: 'scores-original-sports-grill',
  name: "Score's Original Sports Grill",
  city: 'London',
  province: 'ON',
  tagline: 'Big plates, cold drinks, and crowd favourites from open to close.',
  summary:
    "From wings, nachos, and wraps to burgers, steaks, sandwiches, and fish & chips, Score's Original Sports Grill serves up familiar comfort-food favourites in a relaxed London sports-bar setting. Daily specials, summer drinks, pickup, and delivery keep the menu easy to enjoy however the day plays out.",
  address: '1050 Kipps Lane, London, Ontario N5Y 4S5',
  phone: '(519) 601-2322',
  hours: [
    { day: 'Sunday', open: '8:00 AM', close: '2:00 PM' },
    { day: 'Monday', open: '7:00 AM', close: '8:00 PM' },
    { day: 'Tuesday', open: '7:00 AM', close: '8:00 PM' },
    { day: 'Wednesday', open: '7:00 AM', close: '8:00 PM' },
    { day: 'Thursday', open: '7:00 AM', close: '8:00 PM' },
    { day: 'Friday', open: '7:00 AM', close: '8:00 PM' },
    { day: 'Saturday', open: '7:00 AM', close: '8:00 PM' },
  ],
  featureBadges: [
    'Daily specials',
    'Pickup & delivery',
    'Summer beverages',
    'Dinner menu all day',
  ],
  heroImage: scoresImage(
    'production-jpyfk6fgocrfeh4jxo2b1jxep30t',
    "Score's Original Sports Grill homepage banner",
  ),
  galleryImages: [
    scoresImage(
      'production-2cuzg4m2c36kvr9yucyegvplfq13',
      "Score's Original Sports Grill today's specials",
    ),
    scoresImage(
      'production-n3qdo9cr6jgukxgnbpzhf3u9c7v3',
      "Score's Original Sports Grill summer beverages",
    ),
    scoresImage(
      'production-uoetkqbk3dzd8wbkpjtusmzerfi6',
      "Score's Original Sports Grill ultimate nachos",
    ),
    scoresImage(
      'production-50a3k6uf4didkeb25n7k7qgyg9vg',
      "Score's Original Sports Grill fish and chips",
    ),
  ],
  highlights: [
    {
      title: 'Daily specials worth checking',
      description:
        'Check in for fresh specials and feature dishes that keep the menu feeling lively through the week.',
    },
    {
      title: 'Easy pickup and delivery',
      description:
        'Ordering stays straightforward when you want dinner at home, a quick pickup, or an easy plan for the night.',
    },
    {
      title: 'Open for the full day',
      description:
        'With long weekday hours and a shorter Sunday service, it is easy to plan lunch, dinner, or a casual stop-in.',
    },
  ],
  promoCards: [
    {
      title: "Today's Specials",
      description:
        'See what is featured today and jump straight to the dishes getting the spotlight right now.',
      image: scoresImage(
        'production-2cuzg4m2c36kvr9yucyegvplfq13',
        "Score's Original Sports Grill today's specials",
      ),
    },
    {
      title: 'New Summer Alcoholic Beverages',
      description:
        'Seasonal drinks keep the bar menu feeling fresh with easy picks for patio weather and casual nights out.',
      image: scoresImage(
        'production-n3qdo9cr6jgukxgnbpzhf3u9c7v3',
        "Score's Original Sports Grill summer beverages",
      ),
    },
    {
      title: 'Pickup & Delivery Dinner Menu',
      description:
        'Order dinner your way with a menu built for quick browsing, fast decisions, and easy takeout planning.',
      image: scoresImage(
        'production-6fz7n17thmczx6s8ovu5muak51w8',
        "Score's Original Sports Grill chicken wings",
      ),
    },
  ],
  heroCtas: {
    call: 'tel:+15196012322',
    directions: 'https://maps.google.com/?q=1050+Kipps+Lane+London+Ontario+N5Y+4S5',
    menu: '#menu',
  },
  socials: {},
  seo: {
    title: 'Score’s Original Sports Grill | London, ON',
    description:
      'A cleaner, mobile-first restaurant website for Score’s Original Sports Grill in London, Ontario, with the dinner menu, contact details, and key actions presented properly.',
    ogTitle: 'Score’s Original Sports Grill | London, ON',
    ogDescription:
      'A cleaner, mobile-first restaurant website for Score’s Original Sports Grill in London, Ontario.',
    ogType: 'website',
    canonicalUrl: 'https://bretta.io/restaurants/scores-original-sports-grill',
    twitterCard: 'summary_large_image',
    socialImage: {
      src: 'https://bretta.io/social/scores-original-sports-grill-preview.png',
      alt: "Score's Original Sports Grill social preview image",
    },
  },
  pageCopy: {
    locationLabel: 'Sports Grill in London, Ontario',
    heroOverlayEyebrow: 'Welcome to Scores',
    heroOverlayTitle: 'Good food, easy ordering, and a menu built for sharing.',
    featuredEyebrow: 'Featured favourites',
    featuredTitle: 'Specials, drinks, and easy pickup.',
    featuredDescription:
      'Start with featured favourites, then move into the full menu, drinks, and pickup staples.',
    menuEyebrow: 'Menu',
    menuTitle: 'Dinner made easy.\nFavourites up front.',
    menuDescription:
      'Start with fan favourites, jump to salads and wraps, or head straight for steaks, burgers, sandwiches, and family plates. Everything stays easy to scan on any screen.',
    highlightsEyebrow: 'Good reasons to stop by',
    visitEyebrow: 'Visit',
    visitTitle: 'Stop in today.\nWe are easy to find.',
  },
  menuSections: [
    {
      title: 'Fan Favourites',
      items: [
        { name: 'Home Made Soup', description: 'Made fresh daily', price: '$4.50' },
        { name: 'French Fries', description: 'Small', price: '$3.50' },
        { name: 'French Fries', description: 'Large', price: '$6.50' },
        { name: 'Onion Rings', description: 'Small', price: '$4.50' },
        { name: 'Onion Rings', description: 'Large', price: '$8.00' },
        { name: 'Sweet Potato Fries', price: '$8.50' },
        { name: 'Poutine', description: 'Small', price: '$5.00' },
        { name: 'Poutine', description: 'Large', price: '$9.00' },
        {
          name: 'Ultimate Nachos',
          description: 'Served with sour cream and salsa',
          price: '$9.95',
        },
        {
          name: 'Jalapeno Poppers',
          description: 'Served with ranch sauce',
          price: '$9.00',
        },
        {
          name: 'Mushroom Caps',
          description: 'Served with ranch dressing',
          price: '$9.00',
        },
        {
          name: 'Mozzarella Sticks',
          description: 'Eight pieces served with marinara sauce for dipping',
          price: '$9.00',
        },
        {
          name: 'Chicken Wings',
          description: '1 pound, served with your choice of assorted sauces',
          price: '$11.95',
        },
        {
          name: 'Chicken Wings',
          description: '2 pounds, served with your choice of assorted sauces',
          price: '$20.95',
        },
        { name: 'Garlic Bread', price: '$4.00' },
        { name: 'Bruschetta Bread', price: '$8.95' },
        {
          name: 'Chicken Fingers',
          description:
            'Tender filets of chicken, lightly breaded and fried until golden brown. Served with french fries and plum sauce for dipping',
          price: '$12.00',
        },
        {
          name: "Score's BBQ Chicken Fingers",
          description: 'Served with french fries',
          price: '$12.00',
        },
        {
          name: 'Half Pound Boneless Wings',
          description: 'Served with french fries',
          price: '$10.95',
        },
        {
          name: 'Shrimp Basket',
          description: 'Tender popcorn shrimp served with french fries',
          price: '$12.00',
        },
      ],
    },
    {
      title: 'Salads',
      description: 'All salads are served with garlic bread',
      items: [
        {
          name: 'Garden Salad',
          description:
            'Crisp mixed greens, cucumbers, tomatoes served with your choice of dressing',
          price: '$7.50',
        },
        {
          name: 'Caesar Salad',
          description:
            'Crisp romaine lettuce, parmesan cheese, croutons and our creamy garlic dressing',
          price: '$8.50',
        },
        {
          name: 'Greek Salad',
          description:
            'Crisp romaine lettuce, feta cheese, green peppers, cucumbers, tomatoes, onions',
          price: '$9.50',
        },
        {
          name: 'Julienne Salad',
          description: 'Garden salad topped with turkey, ham and cheese',
          price: '$11.50',
        },
      ],
    },
    {
      title: 'Wraps',
      items: [
        {
          name: 'Veggie Wrap',
          description: 'Lettuce, tomato, cucumber, green pepper and onion',
          price: '$8.00',
        },
        {
          name: 'Chicken Caesar Wrap',
          description:
            'Choice of grilled or crispy chicken breast, crispy romaine lettuce, bacon and creamy Caesar dressing wrapped in a soft flour tortilla',
          price: '$9.50',
        },
        {
          name: 'Buffalo Chicken Wrap',
          description:
            'BBQ chicken, lettuce & shredded cheese wrapped on a soft flour tortilla with ranch dressing',
          price: '$9.50',
        },
        {
          name: 'Club Wrap',
          description:
            'Turkey, lettuce, tomatoes, bacon, shredded cheese and mayo wrapped in a soft flour tortilla',
          price: '$9.50',
        },
      ],
    },
    {
      title: 'Side Orders',
      items: [
        { name: 'Sweet Potato Fries', price: '$4.50' },
        { name: 'Garden Salad', price: '$4.50' },
        { name: 'Caesar Salad', price: '$5.00' },
        { name: 'Greek Salad', price: '$6.00' },
      ],
    },
    {
      title: 'Dinner Entrees',
      description: 'All entrees include soup, Caesar salad, or tossed salad',
      items: [
        {
          name: 'Fish & Chips',
          description: '8 oz lightly battered haddock fillet fried until golden brown',
          price: '$14.00',
        },
        { name: 'Liver & Onions', price: '$14.00' },
        { name: 'Pork Chops', price: '$14.95' },
        { name: 'Crunchy Ocean Perch Fillets', price: '$15.00' },
      ],
    },
    {
      title: "Score's Famous Steak",
      description: 'We use only Triple A Canadian corn fed beef grilled to your perfection',
      items: [
        { name: '6 oz New York Striploin', price: '$12.95' },
        { name: '8 oz New York Striploin', price: '$14.95' },
        { name: '10 oz New York Striploin', price: '$18.95' },
      ],
    },
    {
      title: 'Burgers',
      description: 'Served with french fries, soup, or salad',
      items: [
        {
          name: 'Classic Burger',
          description: '6 oz burger topped with lettuce, tomato and onion',
          price: '$7.95',
        },
        {
          name: 'Chicken Burger',
          description:
            'Grilled or crispy chicken breast topped with lettuce, tomato and mayo',
          price: '$9.95',
        },
      ],
    },
    {
      title: 'Sandwiches',
      items: [
        {
          name: 'BLT',
          description: 'Bacon, lettuce, tomato and mayo',
          price: '$7.50',
        },
        { name: 'Corned Beef', price: '$6.95' },
        { name: 'Veggie Quesadilla', price: '$9.95' },
        {
          name: 'Roast Beef Dip',
          description: 'Served with a side of Au Jus',
          price: '$9.50',
        },
        {
          name: 'Traditional Triple Decker Clubhouse',
          description: 'Chicken, lettuce, tomato, bacon and mayo',
          price: '$10.95',
        },
        {
          name: 'Philly Steak Melt',
          description: 'Grilled onions, peppers, topped with assorted melted cheeses',
          price: '$12.00',
        },
      ],
    },
    {
      title: "Kid's Entrees",
      description:
        'Served with french fries and choice of soft drink, juice, or milk (12 and under)',
      items: [
        { name: 'Chicken Fingers', price: '$7.00' },
        { name: 'Hot Dog', price: '$7.00' },
        { name: 'Grilled Cheese', price: '$7.00' },
        { name: 'Boneless Chicken Wings', price: '$7.00' },
      ],
    },
  ],
};
