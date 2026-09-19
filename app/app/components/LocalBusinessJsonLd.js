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
 * Every value is taken from the Google Business Profile or from what the site
 * already publishes (Footer, contact page). The node is complete: address with
 * postcode, opening hours, and coordinates.
 *
 * **Keep this in step with the Business Profile.** Where the two disagree Google
 * treats the profile as authoritative and the mismatch counts against the site.
 * The street name is the live example: the site said "Sengottai" while the profile
 * said "Shencottai", so the site was moved to match the profile.
 *
 * Deliberately absent: `aggregateRating` / `review`. The shop has excellent Google
 * reviews, but marking up ratings collected on a third-party profile as your own
 * structured data is against Google's review-snippet guidelines and risks a manual
 * action. Reviews belong on the profile, where they already work.
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
 * Tenkasi–Shencottai road, about 3 km west of Tenkasi centre.
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
    streetAddress: 'Tenkasi - Shencottai Main Road, Ilanji',
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
  // The towns the owner confirmed delivery to. Naming them individually is worth
  // more than "Tenkasi District" alone for local search, and each has a matching
  // page on the site so the claim is backed by something.
  //
  // Alangulam was explicitly excluded and must not be added back without asking —
  // declaring a service area the shop does not serve is a promise it cannot keep.
  areaServed: [
    { '@type': 'City', name: 'Tenkasi' },
    { '@type': 'City', name: 'Shencottai' },
    { '@type': 'City', name: 'Courtallam' },
    { '@type': 'City', name: 'Kadayanallur' },
    { '@type': 'City', name: 'Puliyangudi' },
    { '@type': 'City', name: 'Sankarankovil' },
    { '@type': 'City', name: 'Tirunelveli' },
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
