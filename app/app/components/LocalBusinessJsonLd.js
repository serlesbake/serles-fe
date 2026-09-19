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
 * contact page). Fields we cannot verify from the repo are deliberately absent
 * rather than guessed: `postalCode`, `geo` and `openingHoursSpecification` are
 * worth adding, but wrong hours or coordinates in structured data are worse than
 * none — they mislead customers and can get the markup distrusted. Fill them in
 * from the Google Business Profile, which is itself the highest-impact thing
 * outstanding for this business.
 */

const PHONE = '+916383070725';
const EMAIL = 'serlesbake@gmail.com';

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
    addressCountry: 'IN',
  },
  areaServed: [
    { '@type': 'City', name: 'Tenkasi' },
    { '@type': 'AdministrativeArea', name: 'Tenkasi District' },
  ],
  servesCuisine: 'Bakery',
  hasMap: 'https://maps.google.com/?q=Tenkasi+Sengottai+Main+Road+Ilanji+Tenkasi+Tamil+Nadu',
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
