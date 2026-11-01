import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '../../components/Breadcrumb';
import JsonLd from '../../components/blog/JsonLd';
import { SITE_URL } from '../../utils/blog';
import { DELIVERY_COVERAGE, DELIVERY_CHARGES } from '../../utils/deliveryPolicy';
import { DELIVERY_AREA_PAGES, findDeliveryArea, deliveryAreaPath } from '../../utils/deliveryAreas';
import styles from '../page.module.scss';

export const dynamicParams = false;
export function generateStaticParams() { return DELIVERY_AREA_PAGES.map(area => ({ area: area.slug })); }
export async function generateMetadata({ params }) {
  const area = findDeliveryArea((await params).area);
  if (!area) return { title: 'Delivery area not found', robots: { index: false, follow: false } };
  const title = `Cake Delivery to ${area.name} from Ilanji | Serle's Bake`;
  const description = `Planning a cake for ${area.name}? Check the route from our Ilanji bakery, delivery charges, your address and available arrangements on WhatsApp.`;
  const url = `${SITE_URL}${deliveryAreaPath(area)}`;
  return { title, description, alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: ['/img/logo.png'] },
    twitter: { card: 'summary_large_image', title, description, images: ['/img/logo.png'] } };
}
export default async function DeliveryAreaPage({ params }) {
  const area = findDeliveryArea((await params).area);
  if (!area) notFound();
  const url = `${SITE_URL}${deliveryAreaPath(area)}`;
  const maps = `https://www.google.com/maps/dir/?api=1&origin=8.963562,77.281437&destination=${area.latitude},${area.longitude}&travelmode=driving`;
  const wa = `https://wa.me/916383070725?text=${encodeURIComponent(`Hi! Please check cake delivery to ${area.name}. My exact address/map pin is: \nDate and cake-cutting time: \nCake/design and size: `)}`;
  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: `Cake delivery to ${area.name}`, mainEntity: { '@id': `${url}#service` }, isPartOf: { '@id': `${SITE_URL}/#website` } },
      { '@type': 'Service', '@id': `${url}#service`, url, name: `Cake delivery enquiries for ${area.name}`, provider: { '@id': `${SITE_URL}/#business` }, description: DELIVERY_COVERAGE, areaServed: { '@type': 'Place', name: area.name, description: 'Eligible addresses within 20 km by road from the Ilanji bakery; confirm each destination before ordering.' } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Cake delivery', item: `${SITE_URL}/cake-delivery` },
        { '@type': 'ListItem', position: 3, name: area.name, item: url },
      ] },
    ] }} />
    <Breadcrumb title={`Cake delivery to ${area.name}`} items={[{ label: 'Cake delivery', href: '/cake-delivery' }]} />
    <article className={`container ${styles.delivery}`} data-contact-source={`delivery_${area.slug}`}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>{area.aliases}</p><h2>Cakes from our Ilanji bakery for your celebration</h2>
        <p>{area.intro}</p><div className={styles.actions}><a href={wa} className={styles.primary} target="_blank" rel="noopener noreferrer">Check your address on WhatsApp</a><Link href="/menu" className={styles.secondary}>View cakes &amp; prices</Link></div>
      </section>
      <section className={styles.section}><h2>{area.heading}</h2>{area.paragraphs.map(text => <p key={text}>{text}</p>)}</section>
      <section className={styles.card}>
        <h2>Route reference for {area.name}</h2>
        <p><strong>About {area.km.toFixed(1)} km by road</strong> from the bakery&apos;s known map coordinates to the mapped village point ({area.latitude}, {area.longitude}). Calculated 2 November 2026. This is a routing estimate to a public village point; it is not a measured trip to your address, a delivery time, or a guaranteed charge.</p>
        <p><a href={maps} target="_blank" rel="noopener noreferrer">Open the driving route in Google Maps</a>. Send your own destination pin so we can check it separately.</p>
        <p>Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>; route calculated with <a href="https://routing.openstreetmap.de/about.html" target="_blank" rel="noopener noreferrer">FOSSGIS/OSRM</a>. <a href={`https://www.openstreetmap.org/?mlat=${area.latitude}&mlon=${area.longitude}#map=16/${area.latitude}/${area.longitude}`} target="_blank" rel="noopener noreferrer">View or correct the mapped place</a>.</p>
      </section>
      <section className={styles.section}><h2>Coverage, charges and confirmation</h2><p>{DELIVERY_COVERAGE}</p><p>{DELIVERY_CHARGES}</p><p>We accept Google Pay and online payments. Confirm the cake, design, date, address, final amount and payment instructions with us, and check your order confirmation in the chat. Same-day availability must be checked for the actual request.</p></section>
      <section className={styles.section}><h2>{area.question}</h2><p>{area.answer}</p><p>For a photo design, send a clear original image after checking feasibility. For larger designs, discuss the guest count and handover with us. Explore our <Link href="/cakes/custom-cake">custom and photo cakes</Link>, <Link href="/cakes/tier-cake">tiered cakes</Link> or <Link href="/cakes/brownie">brownies</Link> before you enquire.</p></section>
      <nav className={styles.section} aria-label="Related delivery information"><h2>Other delivery information</h2><ul><li><Link href="/cake-delivery">Delivery boundary and ordering steps</Link></li>{area.related.map(slug => { const item = findDeliveryArea(slug); return <li key={slug}><Link href={deliveryAreaPath(item)}>Cake enquiries for {item.name}</Link></li>; })}<li><Link href="/contact">Bakery contact and location</Link></li></ul></nav>
      <div className={styles.actions}><a href={wa} className={styles.primary} target="_blank" rel="noopener noreferrer">Ask about your celebration</a><a className={styles.secondary} href="tel:+916383070725">Call +91 63830 70725</a></div>
    </article>
  </>;
}
