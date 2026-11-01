import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumb';
import JsonLd from '../components/blog/JsonLd';
import { SITE_URL } from '../utils/blog';
import { DELIVERY_COVERAGE, DELIVERY_CHARGES } from '../utils/deliveryPolicy';
import styles from './page.module.scss';
import { DELIVERY_AREA_PAGES, deliveryAreaPath } from '../utils/deliveryAreas';

const title = "Cake Delivery from Ilanji, Tenkasi | Serle's Bake";
const description = 'Check cake delivery within 20 km by road from Serle’s Bake in Ilanji. Browse cakes, check delivery charges and confirm your address and date on WhatsApp.';
const url = `${SITE_URL}/cake-delivery`;
const whatsapp = `https://wa.me/916383070725?text=${encodeURIComponent('Hi! I would like to check cake delivery from Ilanji. My delivery address/map pin is: \nEvent date and time: \nCake/design and size: ')}`;

export const metadata = {
  title, description, alternates: { canonical: url },
  openGraph: { title, description, url, type: 'website', images: ['/img/logo.png'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/img/logo.png'] },
};
const questions = [
  ['How far do you deliver?', DELIVERY_COVERAGE],
  ['What does delivery cost?', DELIVERY_CHARGES],
  ['Can I order for today?', 'Ask us to check availability for your cake, design and event time. Same-day delivery is subject to confirmation; sending a message does not reserve a slot.'],
  ['How do I pay and confirm my order?', 'We accept Google Pay and online payments. Confirm the cake, date, address, final amount and payment instructions with us on WhatsApp, and check your order confirmation in the chat.'],
  ['Can I order for family while I am away?', 'Share the recipient’s delivery address, event date and a contact for handover privately on WhatsApp. We will check the route and available arrangements with you.'],
];

export default function CakeDeliveryPage() {
  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
        isPartOf: { '@id': `${SITE_URL}/#website` }, mainEntity: { '@id': `${url}#service` } },
      { '@type': 'Service', '@id': `${url}#service`, name: 'Cake delivery from Ilanji',
        serviceType: 'Cake delivery', url, description: DELIVERY_COVERAGE,
        provider: { '@id': `${SITE_URL}/#business` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Cake delivery', item: url },
      ] },
    ] }} />
    <Breadcrumb title="Cake delivery from Ilanji" />
    <div className={`container ${styles.delivery}`} data-contact-source="delivery_hub">
      <section className={styles.intro} aria-labelledby="delivery-intro">
        <p className={styles.eyebrow}>Serle&apos;s Bake · Ilanji, Tenkasi</p>
        <h2 id="delivery-intro">A cake for your celebration, with the delivery details agreed first</h2>
        <p>{DELIVERY_COVERAGE}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer">Check delivery on WhatsApp</a>
          <Link className={styles.secondary} href="/menu">Browse cakes &amp; prices</Link>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="coverage-heading">
        <h2 id="coverage-heading">Checking your delivery address</h2>
        <p>Our bakery is on Tenkasi–Shencottai Main Road in Ilanji. For addresses in Ilanji, Tenkasi, Sengottai (Shencottai), Courtallam and surrounding villages, please send a map pin. Coverage depends on the road route to that address, within our 20 km limit, and the arrangements available for your order.</p>
        <p>For nearby places such as Kottakulam, Vallam, Piranoor, Panpoli or Pudur near Sengottai, ask us to check your exact destination. A nearby town name alone does not establish delivery eligibility. We confirm the destination individually before accepting an order.</p>
        <p>We bake from Ilanji; the delivery destinations are served from this bakery. <Link href="/contact">Find our bakery and contact details</Link>.</p>
      </section>
      <section className={styles.section} aria-labelledby="area-guides-heading">
        <h2 id="area-guides-heading">Local delivery guides</h2>
        <p>These guides include driving estimates to mapped village points. Your actual address and order availability are checked separately.</p>
        <ul>{DELIVERY_AREA_PAGES.map(area => <li key={area.slug}><Link href={deliveryAreaPath(area)}>Cake enquiries for {area.name}</Link> — village-point road estimate about {area.km.toFixed(1)} km</li>)}</ul>
        <p>Established guides: <Link href="/blog/cake-delivery-in-tenkasi-timings-and-ordering">Tenkasi</Link>, <Link href="/blog/cake-delivery-in-shencottai">Sengottai / Shencottai</Link> and <Link href="/blog/cake-delivery-in-courtallam">Courtallam</Link>.</p>
      </section>
      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="charges-heading">
          <h2 id="charges-heading">Delivery charges</h2><p>{DELIVERY_CHARGES}</p>
          <p>The cake price, any agreed design changes and delivery are confirmed together before you proceed. Check current cake weights and prices in our <Link href="/menu">menu</Link>.</p>
        </section>
        <section className={styles.card} aria-labelledby="timing-heading">
          <h2 id="timing-heading">Plan around the cake-cutting time</h2>
          <p>Tell us when you need the cake, including time for the handover and any setup. For photo, themed or tiered cakes, send your design request early so we can check feasibility, preparation and transport.</p>
          <p>For a hotel, hall or another venue, include its name and entrance details. Let us know if refrigeration will be available before serving.</p>
        </section>
      </div>
      <section className={styles.section} aria-labelledby="order-heading">
        <h2 id="order-heading">How to arrange your cake</h2>
        <ol className={styles.steps}>
          <li><strong>Choose a cake.</strong> Browse our <Link href="/cakes">cake collection</Link> and note the design and weight you would like.</li>
          <li><strong>Send the essentials privately.</strong> Message your address or map pin, date, cake-cutting time, design request and preferred size on WhatsApp.</li>
          <li><strong>Check the details with us.</strong> We confirm coverage, availability, customization, the final amount and payment instructions.</li>
          <li><strong>Check your confirmation.</strong> Review the agreed cake, message, delivery address and timing in the chat. A website enquiry is the start of the conversation.</li>
        </ol>
        <p>We accept Google Pay and online payments. For a photo cake, attach a clear original photo in the chat after checking that the design can be made.</p>
        <p>Ordering from another city? Read our <Link href="/blog/order-cake-for-family-in-tenkasi-from-another-city">guide to arranging a cake for family in Tenkasi</Link>. For a hall, hotel or other event space, use the <Link href="/blog/cake-delivery-venue-handover-checklist">venue handover checklist</Link>.</p>
      </section>
      <section className={styles.section} aria-labelledby="questions-heading">
        <h2 id="questions-heading">Delivery questions</h2>
        {questions.map(([question, answer]) => <details className={styles.question} key={question}>
          <summary>{question}</summary><p>{answer}</p>
        </details>)}
      </section>
      <section className={styles.closing} aria-labelledby="delivery-contact-heading">
        <h2 id="delivery-contact-heading">Share your address and celebration date</h2>
        <p>We will check the details before you commit to the order.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer">Ask about cake delivery</a>
          <a className={styles.secondary} href="tel:+916383070725">Call +91 63830 70725</a>
        </div>
      </section>
    </div>
  </>;
}
