import type { RestaurantSiteInput } from '../restaurant-site-input';

const jimbosImageBase = '/restaurants/jimbos';

function jimbosImage(file: string, alt: string): {
  src: string;
  alt: string;
} {
  return {
    src: `${jimbosImageBase}/${file}?1702210381`,
    alt,
  };
}

export const jimbosPub: RestaurantSiteInput = {
  slug: 'jimbos-pub',
  name: "Jimbo's Pub & Eatery",
  city: 'London',
  province: 'ON',
  tagline: 'Fresh wings, cold pints, patio nights, and easy pub favourites in east London.',
  summary:
    "From fresh wings and loaded pub starters to wraps, burgers, mains, and daily specials, Jimbo's Pub & Eatery is built for relaxed dinners, karaoke nights, game-day meetups, and easy takeout in London.",
  address: '920 Commissioners Rd E, London, Ontario N5Z 3J1',
  phone: '(519) 204-7991',
  hours: [
    { day: 'Monday', open: '11:00 AM', close: '10:00 PM' },
    { day: 'Tuesday', open: '11:00 AM', close: '10:00 PM' },
    { day: 'Wednesday', open: '11:00 AM', close: '10:00 PM' },
    { day: 'Thursday', open: '11:00 AM', close: '10:00 PM' },
    { day: 'Friday', open: '11:00 AM', close: '1:00 AM' },
    { day: 'Saturday', open: '11:00 AM', close: '1:00 AM' },
    { day: 'Sunday', open: '12:00 PM', close: '10:00 PM' },
  ],
  featureBadges: [
    'Fresh wings',
    'Heated patio',
    'Daily specials',
    'Free parking',
    'Free party room',
    'Karaoke nights',
  ],
  heroImage: jimbosImage('home_patio2.jpg', "Jimbo's Pub patio"),
  galleryImages: [
    jimbosImage('home_bg-wings.jpg', "Jimbo's Pub wings"),
    jimbosImage('gallery_patio1.jpg', "Jimbo's Pub patio seating"),
    jimbosImage('gallery_patio2.jpg', "Jimbo's Pub exterior patio"),
    jimbosImage('gallery_patio4.jpg', "Jimbo's Pub patio tables"),
  ],
  highlights: [
    {
      title: 'Fresh wings done right',
      description:
        'Fresh, never frozen wings lead the menu with house favourites like smoky BBQ, hot ranch, sweet chili Thai, Jamaican jerk, and lemon pepper.',
    },
    {
      title: 'Casual pub nights made easy',
      description:
        'Big-screen sports, karaoke, darts, patio seating, free parking, and takeout keep the week easy whether you stay late or swing by for dinner.',
    },
    {
      title: 'Free party room bookings',
      description:
        'Birthday parties, meetings, stags, team nights, retirement parties, and anniversaries all have a simple home here, with catered meals available.',
    },
  ],
  promoCards: [
    {
      title: 'Fresh Wings Every Week',
      description:
        "Start with Jimbo's signature wings, served fresh and finished with classic pub sauces and house favourites.",
      image: jimbosImage('home_bg-wings.jpg', "Jimbo's Pub wings"),
    },
    {
      title: 'Daily Specials',
      description:
        'Monday wings, Tuesday Bud and burger, Wednesday chicken parmesan, and Friday fish and chips keep the week moving.',
      image: jimbosImage('menus_bg-menu.jpg', "Jimbo's Pub menu board"),
    },
    {
      title: 'Patio Nights & Group Tables',
      description:
        'Grab a table outside, settle in with the crew, or book the party room for birthdays, meetings, and team nights.',
      image: jimbosImage('gallery_patio2.jpg', "Jimbo's Pub patio"),
    },
  ],
  heroCtas: {
    call: 'tel:+15192047991',
    directions: 'https://maps.google.com/?q=920+Commissioners+Rd+E+London+Ontario+N5Z+3J1',
    menu: '#menu',
    links: [
      { label: 'Join VIP list', href: '#vip' },
      { label: 'Book party room', href: '#party-room' },
    ],
  },
  socials: {
    facebook: 'https://www.facebook.com/jimbospub/',
  },
  seo: {
    title: "Jimbo's Pub & Eatery | London, ON",
    description:
      "Fresh wings, daily specials, heated patio seating, party room bookings, and pub favourites at Jimbo's Pub & Eatery in London, Ontario.",
    ogTitle: "Jimbo's Pub & Eatery | London, ON",
    ogDescription:
      "Fresh wings, daily specials, patio seating, and pub favourites at Jimbo's Pub & Eatery in London, Ontario.",
    ogType: 'website',
    canonicalUrl: 'https://bretta.io/restaurants/jimbos-pub',
    twitterCard: 'summary_large_image',
    socialImage: {
      src: 'https://bretta.io/restaurants/jimbos/home_patio2.jpg',
      alt: "Jimbo's Pub social preview image",
    },
  },
  pageCopy: {
    locationLabel: 'Pub & Patio in London, Ontario',
    heroOverlayEyebrow: "Welcome to Jimbo's",
    heroOverlayTitle: 'Fresh wings, cold beer, and an easy local table any night of the week.',
    featuredEyebrow: "Jimbo's favourites",
    featuredTitle: 'Wings, specials, patio nights.',
    featuredDescription:
      'Fresh wings, weekly specials, and patio tables keep the place busy from lunch through late-night pints.',
    venueEyebrow: 'Pub details',
    venueTitle: 'A proper neighbourhood pub setup.',
    venueDescription:
      'Sports, patio seating, karaoke, free parking, and group-friendly tables make it easy to settle in with the crew.',
    menuEyebrow: 'Menu',
    menuTitle: 'Pub favourites.\nFull menu.',
    menuDescription:
      'Daily specials, fresh wings, loaded starters, wraps, burgers, mains, sandwiches, and late-night staples are all here.',
    highlightsEyebrow: 'Why regulars return',
    visitEyebrow: 'Visit',
    visitTitle: 'Bring the crew.\nWe are easy to reach.',
  },
  venueSections: [
    {
      eyebrow: 'Info',
      title: 'Sports hangout, patio, and easy parking.',
      description:
        "Jimbo's keeps the atmosphere casual and straightforward with booth seating, big-screen TVs, darts, WiFi, takeout, and free parking out front.",
      bullets: [
        'Sports hangout with big-screen TVs',
        'Patio seating and karaoke nights',
        'Free parking and takeout available',
        'Visa, MasterCard, and Interac accepted',
      ],
      image: jimbosImage('gallery_patio1.jpg', "Jimbo's Pub patio tables"),
    },
    {
      id: 'party-room',
      eyebrow: 'Party room',
      title: 'Book the room free.',
      description:
        'Use the party room for birthdays, meetings, stags, team parties, retirement parties, and anniversaries, with catered meals available when you need them.',
      bullets: [
        'Birthday parties and anniversaries',
        'Meetings, stags, and team parties',
        'Retirement parties and group dinners',
        'Catered meals available',
      ],
      image: jimbosImage('home_bg-home.jpg', "Jimbo's Pub dining room"),
      cta: {
        label: 'Call to book',
        href: 'tel:+15192047991',
      },
    },
  ],
  newsletterSignup: {
    formName: 'jimbos-vip-list',
    title: 'Join the VIP list.',
    description:
      'Get contest entries, birthday perks, event invites, and special promotions sent directly to you.',
    submitLabel: 'Join VIP list',
    action: '/thank-you',
    privacyNote:
      'Your information stays private and is not shared with third parties.',
    consentLabel:
      'I provide express consent to receive coupons, events, or promotions by email and understand I can unsubscribe at any time.',
  },
  menuSections: [
    {
      title: 'Daily Specials',
      description: 'Current weekly specials from the house.',
      items: [
        {
          name: 'Monday Wing Special',
          description: 'Fresh wings for $8.99 per pound, limit 5 pounds, dine in only.',
          price: '$8.99',
        },
        {
          name: 'Tuesday Bud & Burger',
          description: 'Homemade burger with Bud, Bud Light bottle, or 20 oz draught. Add fries for $2.99.',
          price: '$10.99',
        },
        {
          name: 'Wednesday Chicken Parmesan',
          description: 'Fresh Canadian chicken breast in tomato sauce over spaghetti with two pieces of garlic bread.',
          price: '$13.99',
        },
        {
          name: "Friday Fish & Chips, 1 Piece",
          description: 'Served with fresh cut fries, tartar, and homemade coleslaw.',
          price: '$12.99',
        },
        {
          name: "Friday Fish & Chips, 2 Piece",
          description: 'Served with fresh cut fries, tartar, and homemade coleslaw.',
          price: '$16.99',
        },
      ],
    },
    {
      title: 'Appetizers',
      items: [
        { name: 'Garlic Bread', price: '$6.99' },
        { name: 'Garlic Bread with Cheese', price: '$8.99' },
        { name: 'Garlic Bread with Bacon', price: '$8.49' },
        { name: 'Garlic Bread with Cheese & Bacon', price: '$10.49' },
        {
          name: 'Bruschetta Bread',
          description: 'Add feta cheese for $2.50.',
          price: '$10.99',
        },
        {
          name: 'Fresh Cut Fries',
          description: 'Russet potatoes. Add gravy for $1.50.',
          price: '$6.99',
        },
        {
          name: 'Poutine',
          description: 'Fresh cut fries, melted cheese, homemade gravy. Add nacho beef or fresh chicken for $3.99.',
          price: '$8.99',
        },
        {
          name: 'Sweet Potato Fries',
          description: 'Served with homemade chipotle mayo.',
          price: '$9.99',
        },
        { name: 'Onion Rings', price: '$9.99' },
        {
          name: 'Mozzarella Sticks',
          description: 'Lightly battered and served with marinara dip.',
          price: '$10.99',
        },
        {
          name: 'Battered Mushroom Caps',
          description: 'Lightly battered and served with ranch sauce.',
          price: '$9.99',
        },
        {
          name: 'Deep Fried Pickles',
          description: 'Lightly battered and served with ranch sauce.',
          price: '$9.99',
        },
        {
          name: 'Jalapeno Poppers',
          description: 'Cream cheese stuffed and served with ranch sauce.',
          price: '$9.99',
        },
        {
          name: 'Shrimp Tempura',
          description: 'Lightly battered and served with sweet chili Thai dip.',
          price: '$12.99',
        },
        {
          name: 'Deep Fried Perogies',
          description:
            'Smothered with sauteed onions, green and red peppers, served with sour cream.',
          price: '$12.99',
        },
        {
          name: 'Homemade Spinach & Roasted Red Pepper Dip',
          description:
            'Creamy blend of spinach, roasted red peppers, Asiago, and cream cheese served with grilled pita.',
          price: '$14.99',
        },
        {
          name: 'Homemade Crab Dip',
          description: 'White cheddar and cream cheese blend served with grilled pita.',
          price: '$14.99',
        },
        {
          name: 'Quesadillas',
          description:
            'Tomato, onion, green pepper, and cheese. Add beef, fresh chicken, or Buffalo chicken for $3.99.',
          price: '$13.99',
        },
      ],
    },
    {
      title: 'Nachos',
      items: [
        {
          name: 'Nachos',
          description:
            'Tri-coloured chips, tomatoes, peppers, onion, mixed cheese, sour cream, and salsa. Add double cheese for $2.99. Add chicken or nacho beef for $3.99.',
          price: '$16.99',
        },
      ],
    },
    {
      title: 'Salads',
      items: [
        {
          name: 'Garden',
          description:
            'Mixed greens, tomato, red onion, cucumber, and your choice of dressing.',
          price: '$9.99',
        },
        {
          name: 'Caesar',
          description:
            'Romaine, bacon bits, croutons, Caesar dressing, and Parmesan.',
          price: '$9.99',
        },
        {
          name: 'Greek Village',
          description:
            'Tomatoes, cucumber, red onion, black olives, Greek dressing, and feta.',
          price: '$11.99',
        },
        {
          name: 'Taco Salad',
          description:
            'Fresh greens, tomatoes, red onions, mixed cheese, crushed corn chips, and ground beef with chipotle ranch and sour cream.',
          price: '$15.99',
        },
        {
          name: 'Add Fresh Chicken Breast',
          price: '$3.99',
        },
      ],
    },
    {
      title: "Jimbo's Signature Wings",
      items: [
        {
          name: 'Always Fresh, Never Frozen',
          description:
            "Served by the pound. Sauces include Jimbo's smokey BBQ, mild, medium, hot, honey garlic, chipotle, hot ranch, sweet chili Thai, hot and honey, Cajun, Jamaican jerk, and lemon pepper. Blue cheese or extra wing sauce $1.50.",
          price: '$14.99 / lb',
        },
      ],
    },
    {
      title: 'Grilled Wraps',
      description:
        'Served with fresh cut fries or garden salad. Substitute Caesar, Greek Village, sweet potato fries, poutine, or onion rings for $2.99.',
      items: [
        {
          name: 'Shrimp Wrap',
          description: 'Crispy shrimp tempura with lettuce, bruschetta mix, and sweet chili Thai sauce.',
          price: '$14.99',
        },
        {
          name: 'Gyro Wrap',
          description: 'Roasted gyro meat with lettuce, tomato, onion, and tzatziki sauce.',
          price: '$13.99',
        },
        {
          name: 'Chicken Club Wrap',
          description: 'Fresh grilled chicken breast with bacon, lettuce, tomato, and house-made chipotle sauce.',
          price: '$14.99',
        },
        {
          name: 'Chicken Caesar Wrap',
          description:
            'Crispy breaded chicken breast with romaine, bacon bits, Caesar dressing, and Parmesan.',
          price: '$14.99',
        },
        {
          name: 'Buffalo Chicken Wrap',
          description: 'Fresh crispy chicken tossed in Buffalo sauce with lettuce and tomato.',
          price: '$14.99',
        },
        {
          name: 'Veggie Wrap',
          description: 'Romaine, tomato, cucumber, red onion, and ranch sauce.',
          price: '$12.99',
        },
      ],
    },
    {
      title: 'Fresh Housemade Burgers',
      description:
        'All burgers come with lettuce, tomato, and red onion. Served with fresh cut fries or garden salad. Upgrade sides for $2.99.',
      items: [
        { name: 'Classic Burger', price: '$13.99' },
        { name: 'Cheese Burger', price: '$14.99' },
        { name: 'Bacon Burger', price: '$14.99' },
        { name: 'Bacon Cheese Burger', price: '$15.99' },
        { name: 'Swiss Mushroom Burger', price: '$15.99' },
        { name: 'Swiss Mushroom Bacon Burger', price: '$16.99' },
        {
          name: 'The Ultimate Burger',
          description: 'Two patties smothered in cheddar cheese and bacon.',
          price: '$19.99',
        },
        {
          name: 'Veggie Burger',
          description: 'A juicy vegetarian patty.',
          price: '$13.99',
        },
        { name: 'Crispy Chicken Burger', price: '$15.99' },
        { name: 'Buffalo Chicken Burger', price: '$15.99' },
        { name: 'Chicken Parm Burger', price: '$16.99' },
      ],
    },
    {
      title: 'Mains',
      items: [
        {
          name: 'Philly Beef & Swiss',
          description:
            'Prime rib, Swiss cheese, sauteed onions and peppers, house-made sauce, and grilled hoagie bun.',
          price: '$17.99',
        },
        {
          name: 'Beef Dip',
          description: 'Thinly sliced prime rib on a grilled hoagie bun with au jus.',
          price: '$16.99',
        },
        {
          name: 'Open Face Hot Beef',
          description: 'Thinly sliced prime rib on bread and smothered in gravy.',
          price: '$16.99',
        },
        {
          name: 'Chicken Souvlaki Pita',
          description:
            'Fresh charbroiled chicken breast with lettuce, tomato, onion, and tzatziki on grilled pita with fries or garden salad.',
          price: '$14.99',
        },
        {
          name: 'Chicken Fingers',
          description: 'Five breaded chicken breast strips with plum sauce and fresh cut fries.',
          price: '$15.99',
        },
      ],
    },
    {
      title: 'Beverages',
      items: [
        {
          name: 'Pop - Canned',
          description: 'Pepsi, Diet Pepsi, Coke, Diet Coke, and ginger ale.',
          price: '$2.49',
        },
        { name: 'Bottled Water', price: '$1.00' },
        { name: 'Red Bull', price: '$4.50' },
      ],
    },
    {
      title: 'Sandwiches',
      items: [
        { name: 'B.L.T', price: '$8.99' },
        { name: 'Toasted Western', price: '$8.99' },
        { name: 'Grilled Cheese', price: '$7.99' },
      ],
    },
    {
      title: 'Dessert',
      items: [
        {
          name: 'Slice of Cheesecake',
          description: 'Finished with caramel, chocolate, or strawberry sauce.',
          price: '$5.95',
        },
      ],
    },
  ],
};
