import JsonLd from './blog/JsonLd';
import { SITE_URL, SITE_NAME } from '../utils/blog';

/**
 * Sitewide `Bakery` (a LocalBusiness subtype) + `WebSite` graph.
 *
 * This is the single most valuable schema for a local bakery — it is what makes a
 * business eligible for the local/knowledge panels behind searches like "cakes
 * near me in Tenkasi" — and the site had no structured data at all outside the
 * blog.
 *
 * Every value here is taken from what the site already publishes (Footer and the
 * contact page), plus the postcode supplied by the owner.
 *
 * `geo` and `openingHoursSpecification` are still deliberately absent. They are the
 * two fields local search leans on hardest, so they are worth adding — but wrong
 * hours or coordinates are worse than none: they send customers to a closed shop
 * and can get the whole markup distrusted. Copy them from the Google Business
 * Profile and fill in OPENING_HOURS / GEO below; both are wired up already, so
 * uncommenting the values is the only change needed.
 *
 * Whatever goes here must match the Google Business Profile exactly. If the two
 * disagree, Google trusts the profile and the mismatch counts against the site.
 */

const PHONE = '+916383070725';
const EMAIL = 'serlesbake@gmail.com';

/**
 * Opening hours, as published on the Google Business Profile: open every day,
 * 9am–10pm. These must stay in step with the profile — where the two disagree
 * Google trusts the profile, and the mismatch counts against the site.
 *
 * Times are 24-hour. A day the shop is closed is simply left out of the list.
 */
const OPENING_HOURS = [
  {
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '22:00',
  },
];

/**
 * Coordinates, decoded from the shop's Google plus code `X77J+CH Ilanji`
 * (full code `6JWVX77J+CH`), which resolves to a ~14 m cell on the
 * Tenkasi–Sengottai road, about 3 km west of Tenkasi centre.
 */
const PLUS_CODE = '6JWVX77J+CH';
const GEO = { lat: 8.963562, lng: 77.281437 };

const bakery = {
  '@type': 'Bakery',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/img/logo.png`,
  logo: `${SITE_URL}/img/logo.png`,
  description:
    "Homemade cake shop in Tenkasi, Tamil Nadu. Freshly baked birthday, photo, custom and tiered cakes, brownies and desserts, baked to order with delivery across Tenkasi.",
  telephone: PHONE,
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tenkasi - Sengottai Main Road, Ilanji',
    addressLocality: 'Tenkasi',
    addressRegion: 'Tamil Nadu',
    postalCode: '627805',
    addressCountry: 'IN',
  },
  // Only emitted once real values are set above — an empty or invented opening-hours
  // block is worse than none.
  ...(OPENING_HOURS.length > 0
    ? {
        openingHoursSpecification: OPENING_HOURS.map(({ days, opens, closes }) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: days,
          opens,
          closes,
        })),
      }
    : {}),
  ...(GEO
    ? { geo: { '@type': 'GeoCoordinates', latitude: GEO.lat, longitude: GEO.lng } }
    : {}),
  areaServed: [
    { '@type': 'City', name: 'Tenkasi' },
    { '@type': 'AdministrativeArea', name: 'Tenkasi District' },
  ],
  servesCuisine: 'Bakery',
  // The plus code resolves to the exact shop rather than a fuzzy text search over
  // the road name, which is what the previous ?q= URL did.
  hasMap: `https://plus.codes/${PLUS_CODE}`,
  sameAs: [
    'https://www.facebook.com/serlesbake',
    'https://www.instagram.com/serles_bake',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: PHONE,
    email: EMAIL,
    areaServed: 'IN',
    availableLanguage: ['en', 'ta'],
  },
};

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { '@id': `${SITE_URL}/#business` },
  inLanguage: 'en-IN',
};

const graph = {
  '@context': 'https://schema.org',
  '@graph': [bakery, website],
};

export default function LocalBusinessJsonLd() {
  return <JsonLd data={graph} />;
}
