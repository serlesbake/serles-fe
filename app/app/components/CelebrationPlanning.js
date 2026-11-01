import Link from 'next/link';

const choices = [
  ['Birthday flavours', '/cakes/flavoured-cakes', 'Compare flavours and current weight options for a birthday cake.'],
  ['Custom & photo cakes', '/cakes/custom-cake', 'Choose a starting design and share your photo or theme request.'],
  ['Wedding & anniversary tiers', '/cakes/tier-cake', 'Discuss the design, guest count and venue arrangements.'],
  ['Brownies for sharing', '/cakes/brownie', 'Browse the brownie range for a celebration or gift.'],
];
export default function CelebrationPlanning() {
  return <section className="container py-5" aria-labelledby="celebration-planning-heading">
    <h2 id="celebration-planning-heading">Plan your celebration from Ilanji</h2>
    <p>Choose your cake, then check your address, date and design with us. Delivery is limited to eligible addresses within 20 km by road from the bakery.</p>
    <div className="row g-3">{choices.map(([title, path, text]) => <div className="col-md-6 col-lg-3" key={path}>
      <div className="p-4 h-100" style={{ background: '#fff3f5', borderRadius: 12 }}><h3 className="h5"><Link href={path}>{title}</Link></h3><p className="mb-0">{text}</p></div>
    </div>)}</div>
    <p className="mt-4"><Link href="/cake-delivery">Check delivery areas and ordering steps</Link> · <Link href="/menu">See current menu and prices</Link></p>
  </section>;
}
