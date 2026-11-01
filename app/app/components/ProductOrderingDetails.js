import Link from 'next/link';
import { DELIVERY_COVERAGE } from '../utils/deliveryPolicy';

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
  return <section className="mt-4 p-4" style={{ background: '#fff3f5', borderRadius: 12 }} aria-label={`Planning your ${product.name} order`}>
    <h2 className="h4">Before we confirm your {product.name} order</h2>
    <p>{advice}</p>
    <p>{DELIVERY_COVERAGE}</p>
    <p>We accept Google Pay and online payments. Check the selected cake, weight, quantity, event date and final total with us in the chat, then review your order confirmation.</p>
    <p className="mb-0"><Link href="/cake-delivery">Delivery and ordering steps</Link> · <Link href="/blog/what-size-cake-for-how-many-guests-tenkasi">Help choosing a cake size</Link> · <Link href="/blog/how-to-store-carry-and-serve-a-cream-cake">Handling and serving guide</Link></p>
  </section>;
}
