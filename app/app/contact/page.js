import ContactPageClient from './ContactPageClient';

// `twitter` and `alternates` used to sit *inside* `openGraph`, where Next ignores
// them — so this page emitted no Twitter card and, more importantly, inherited the
// root layout's `canonical: '/'` and told Google it was a duplicate of the
// homepage. Both are now top-level keys. Title trimmed from 68 chars to under 60.
const TITLE = "Contact Serle's Bake | Order Cakes in Tenkasi";
const DESCRIPTION =
  "Get in touch with Serle's Bake – order cakes online, request custom designs, or ask about delivery. Your local homemade cake shop in Tenkasi.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'cake shop contact tenkasi, serles bake contact, customer support, best cake shop tenkasi',
  alternates: {
    canonical: 'https://www.serlesbake.in/contact',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.serlesbake.in/contact',
    siteName: "Serle's Bake",
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/img/logo.png',
        width: 1200,
        height: 630,
        alt: "Serle's Bake Logo",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/img/logo.png'],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
