import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaListUl } from 'react-icons/fa';
import styles from './ShopPlanning.module.scss';

const choices = [
  ['Birthday flavours', '/cakes/flavoured-cakes', 'Compare flavours and available sizes for the birthday table.', 'https://cdn.serlesbake.in/products/premium-cake/black-forest/20250811_225822.jpg', "Black Forest cake from Serle's Bake", 'Explore birthday cakes'],
  ['Custom & photo cakes', '/cakes/custom-cake', 'Start with a photo or theme and tell us what you have in mind.', 'https://cdn.serlesbake.in/products/custom-cake/photo-cake/20250811_230825.jpg', "Photo cake from Serle's Bake", 'Explore custom designs'],
  ['Wedding & anniversary', '/cakes/tier-cake', 'Discuss tiered designs, guest numbers and your venue plans.', 'https://cdn.serlesbake.in/products/tier-cake/two-tier-cake/20250811_230318.jpg', "Two tier cake from Serle's Bake", 'Explore tiered cakes'],
  ['Brownies for sharing', '/cakes/brownie', 'Find a brownie for a celebration, a gift or a small gathering.', 'https://cdn.serlesbake.in/products/brownie/classic-fudgy-brownie/20250811_230952.jpg', "Classic Fudgy Brownie from Serle's Bake", 'Explore the brownie range'],
];
export default function CelebrationPlanning() {
  return (
    <section className={`container ${styles.celebration}`} aria-labelledby="celebration-planning-heading">
      <div className={styles.collectionHeader}>
        <div>
          <h2 id="celebration-planning-heading" className={styles.collectionTitle}>Plan your celebration from Ilanji</h2>
          <p className={styles.collectionIntro}>Choose your cake, then we will check your date, design and delivery address together.</p>
        </div>
        <Link href="/menu" className={styles.menuLink}><FaListUl aria-hidden="true" /> View menu &amp; prices</Link>
      </div>
      <div className={styles.collections}>
        {choices.map(([title, path, text, image, alt, action]) => (
          <Link href={path} className={styles.collectionCard} key={path}>
            <div className={styles.cardPhoto}>
              <Image src={image} alt={alt} title={alt} width={480} height={360}
                sizes="(max-width: 599px) 104px, (max-width: 991px) 45vw, 25vw" />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{text}</p>
              <span className={styles.cardAction}>{action}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.deliveryStrip}>
        <p><FaMapMarkerAlt aria-hidden="true" /><span>Delivery is checked for eligible addresses within 20 km by road from our Ilanji bakery.</span></p>
        <Link href="/cake-delivery">Check your delivery address</Link>
      </div>
    </section>
  );
}
