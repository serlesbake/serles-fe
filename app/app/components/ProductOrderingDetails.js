import Link from 'next/link';
import { FaClipboardList, FaBirthdayCake, FaMapMarkerAlt, FaWallet, FaTruck, FaRuler, FaBookOpen } from 'react-icons/fa';
import { DELIVERY_COVERAGE } from '../utils/deliveryPolicy';
import styles from './ShopPlanning.module.scss';

export default function ProductOrderingDetails({ product }) {
  if (!product?.name) return null;
  const category = product.category?.slug;
  const isPhoto = product.slug === 'photo-cake';
  const advice = isPhoto
    ? 'Have a clear original photo ready. After we check your design, attach the image in WhatsApp; the website enquiry does not upload a photo for you.'
    : category === 'tier-cake'
      ? 'Tell us your guest count, venue, cake-cutting time and design reference. Ask us to check the weight, structure and handover arrangements together.'
      : category === 'brownie'
        ? 'Tell us whether this is for a birthday, gifting or sharing. Confirm the selected weight and ask about the portions and any presentation changes you need.'
        : ['custom-cake', 'themed-cake'].includes(category)
          ? 'Send a design reference and identify the details that matter most. We check feasibility, available colours, size and any additional design charge before confirming.'
          : 'Confirm the flavour, selected weight, cake message and event time. Ask us about any design changes before assuming they are included in the selected price.';
  const servingGuide = category === 'brownie'
    ? { path: '/blog/fudgy-brownies-in-tenkasi-gifting-parties-office-treats', label: 'Brownie serving & gifting' }
    : { path: '/blog/how-to-store-carry-and-serve-a-cream-cake', label: 'Handling & serving guide' };
  return (
    <section className={styles.orderPanel} aria-label={`Planning your ${product.name} order`}>
      <div className={styles.orderHeader}>
        <span className={styles.orderHeaderIcon}><FaClipboardList aria-hidden="true" /></span>
        <div>
          <h2 className={styles.orderTitle}>Before we confirm your {product.name} order</h2>
          <p className={styles.orderIntro}>A few details to check together on WhatsApp.</p>
        </div>
      </div>
      <div className={styles.orderChecks}>
        <div className={styles.orderCheck}>
          <h3 className={styles.checkHeading}><FaBirthdayCake aria-hidden="true" /> Your cake &amp; occasion</h3>
          <p className={styles.checkText}>{advice}</p>
        </div>
        <div className={styles.orderCheck}>
          <h3 className={styles.checkHeading}><FaMapMarkerAlt aria-hidden="true" /> Your delivery address</h3>
          <p className={styles.checkText}>{DELIVERY_COVERAGE}</p>
        </div>
        <div className={styles.orderCheck}>
          <h3 className={styles.checkHeading}><FaWallet aria-hidden="true" /> Payment &amp; confirmation</h3>
          <p className={styles.checkText}>Review your cake, weight, quantity, date and final total in the chat. We accept Google Pay and online payments. Ask us for payment instructions and review your order confirmation.</p>
        </div>
      </div>
      <div className={styles.guideBar}>
        <p className={styles.guideLabel}>Helpful before you order</p>
        <nav className={styles.guideLinks} aria-label="Cake ordering guides">
          <Link href="/cake-delivery" className={styles.guideLink}><FaTruck aria-hidden="true" /> Delivery &amp; ordering</Link>
          <Link href="/blog/what-size-cake-for-how-many-guests-tenkasi" className={styles.guideLink}><FaRuler aria-hidden="true" /> Choosing a cake size</Link>
          <Link href={servingGuide.path} className={styles.guideLink}><FaBookOpen aria-hidden="true" /> {servingGuide.label}</Link>
        </nav>
      </div>
    </section>
  );
}
