import Link from 'next/link';

/** Explain the actual catalog grouping without adding unsupported product claims. */
export default function TagCollectionIntro({ name, products = [] }) {
  const examples = products.slice(0, 4).map(product => product.name).join(', ');
  return (
    <section className="mb-4" aria-label="How to choose from this collection">
      <p>
        This collection groups products carrying the {name} tag in our catalog.
        {examples ? ` Current listings include ${examples}.` : ' Browse the available listings below.'}
        {' '}Open a product to see its photos, available weights and current prices.
        Each listing has its own options; a price or size from one cake does not apply to every item here.
      </p>
      <p>
        Choose the cake first, then send your date, message and preferred size on WhatsApp.
        Ask us to check any design or ingredient change before paying.
        For delivery, share the actual address or map pin. We check availability within 20 km by road from Ilanji.
        You can also <Link href="/cakes">browse all cakes by category</Link> or <Link href="/menu">compare the menu and prices</Link>.
      </p>
    </section>
  );
}
