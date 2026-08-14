import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaGoogle } from 'react-icons/fa';

const contactInfo = [
  {
    icon: "fa-map-marker",
    text: "Tenkasi, Tamil Nadu, India",
    href: null,
  },
  {
    icon: "fa-envelope",
    text: "serlesbake@gmail.com",
    href: "mailto:serlesbake@gmail.com",
  },
  {
    icon: "fa-phone",
    text: "+91 6383070725",
    href: "tel:+916383070725",
  },
];

const socialLinks = [
  {
    icon: "fa-facebook",
    href: "https://www.facebook.com/serlesbake",
    color: "#3b5998",
    label: "FaFacebook",
  },
  {
    icon: "fa-instagram",
    href: "https://www.instagram.com/serles_bake",
    color: "#e1306c",
    label: "FaInstagram",
  },
  {
    icon: "fa-whatsapp",
    href: "https://wa.me/916383070725?text=Hi!%20I'm%20interested%20in%20ordering%20the%20cakes",
    color: "#25d366",
    label: "FaWhatsapp",
  },
];

// Updated working hours: single line for all days, and home delivery mention
const workingHours = [
  { day: "Monday - Sunday", time: "7:00 am – 11:00 pm" },
  { day: "Home Delivery", time: "Available" },
];

const quickLinks = [
  { label: "Cakes", href: "/cakes" },
  { label: "Menu & Pricing", href: "/menu" },
  // { label: "Cake Categories", href: "/cakes/category" },
  { label: "WhatsApp Enquiry", href: "https://wa.me/916383070725?text=Hi!%20I'm%20interested%20in%20ordering%20the%20cakes", external: true, icon: <FaWhatsapp style={{ marginRight: 6, color: "#25d366" }} /> },
  { label: "Google Reviews", href: "https://www.google.com/search?q=Serles+Bake+Tenkasi", external: true, icon: <FaGoogle style={{ marginRight: 6, color: "#ea4335" }} /> },
];

function ContactList({ info }) {
  return (
    <ul style={{ color: "#fff", listStyle: "none", padding: 0, margin: 0, fontSize: "1.05rem" }}>
      {info.map((item, idx) => (
        <li key={idx} style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 10, color: "#ffb6c1" }}>
            <i className={`fa ${item.icon}`}></i>
          </span>
          {item.href ? (
            <a
              href={item.href}
              style={{
                color: "#fff",
                textDecoration: item.icon === "fa-envelope" ? "underline" : "none",
                wordBreak: "break-all",
              }}
            >
              {item.text}
            </a>
          ) : (
            item.text
          )}
        </li>
      ))}
    </ul>
  );
}

function SocialIcons({ links }) {
  return (
    <div style={{ marginTop: 18, display: "flex", gap: 16 }}>
      {links.map((link, idx) => {
        let IconComponent;
        switch (link.label) {
          case "FaFacebook":
            IconComponent = FaFacebook;
            break;
          case "FaInstagram":
            IconComponent = FaInstagram;
            break;
          case "FaWhatsapp":
            IconComponent = FaWhatsapp;
            break;
          default:
            IconComponent = FaFacebook;
        }
        
        return (
          <a
            key={idx}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            style={{
              display: "inline-block",
              background: "#fff",
              borderRadius: "4px",
              padding: "7px 12px",
              color: link.color,
              fontSize: "1.3rem",
              border: "2px solid #ffb6c1",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <IconComponent size={20} />
          </a>
        );
      })}
    </div>
  );
}

function WorkingHours({ hours }) {
  return (
    <div style={{
      background: "#232025",
      borderRadius: "6px",
      padding: "32px 24px",
      margin: "32px 0",
      minWidth: "220px",
      maxWidth: "320px",
      width: "100%",
      color: "#fff",
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    }}>
      <h4 style={{
        color: "#ffb6c1",
        fontWeight: 700,
        marginBottom: "18px",
        letterSpacing: "1px",
      }}>
        WORKING HOURS
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "1.05rem" }}>
        {hours.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: 600 }}>{item.day}:</span><br/> {item.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickLinks({ links }) {
  return (
    <div
      style={{
        background: "#232025",
        borderRadius: "6px",
        padding: "32px 24px",
        margin: "32px 0",
        minWidth: "220px",
        maxWidth: "320px",
        width: "100%",
        color: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}
    >
      <h4
        style={{
          color: "#ffb6c1",
          fontWeight: 700,
          marginBottom: "18px",
          letterSpacing: "1px",
        }}
      >
        QUICK LINKS
      </h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "1.05rem", width: "100%" }}>
        {links.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 12 }}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
              >
                {item.icon} 
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <footer
        className="footer"
        style={{
          background: "#18171c",
          padding: 0,
          borderTop: "4px solid #ffb6c1",
        }}
      >
        <div className="container" style={{ maxWidth: "100vw", padding: 0 }}>
          <div
            className="row"
            style={{
              margin: 0,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              minHeight: "340px",
            }}
          >
            {/* Left: About */}
            <div
              className="col-lg-4 col-md-12"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "340px",
                padding: 0,
              }}
            >
              <div className="bg-primary-light"
                style={{
                  background: "#ffb6c1",
                  border: "6px solid #fff",
                  borderRadius: "6px",
                  padding: "36px 32px 32px 32px",
                  margin: "32px 0",
                  width: "95%",
                  maxWidth: "420px",
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                  position: "relative",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <Image
                    src="/img/serlesbakelogo.webp"
                    alt="Serle's Bake Logo"
                    width={100}
                    height={100}
                  />
                </div>
                <h2 className="h1 text-white">
                  SERLE&apos;S BAKE
                </h2>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "1.05rem",
                    lineHeight: "1.7",
                    margin: 0,
                    textShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  At Serle&apos;s Bake, we craft homemade cakes with love, passion, and the finest ingredients. From birthdays to weddings, our cakes add a sweet touch to every celebration. Experience the warmth of home in every bite. We are committed to delivering freshness, quality, and happiness to your table.
                </p>
              </div>
            </div>
            {/* Middle: Quick Links */}
            <div
              className="col-lg-3 col-md-12"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                background: "#18171c",
                minHeight: "340px",
                padding: 0,
                gap: "0 16px",
              }}
            >
              <QuickLinks links={quickLinks} />
            </div>
            {/* Right: Get In Touch & Working Hours */}
            <div
              className="col-lg-5 col-md-12"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                background: "#18171c",
                minHeight: "340px",
                padding: 0,
                gap: "16px",
              }}
            >
              <WorkingHours hours={workingHours} />

              <div
                style={{
                  flex: "1 1 220px",
                  padding: "36px 24px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h4
                  style={{
                    color: "#ffb6c1",
                    fontWeight: 700,
                    marginBottom: "18px",
                    letterSpacing: "1px",
                  }}
                >
                  GET IN TOUCH
                </h4>
                <ContactList info={contactInfo} />
                <SocialIcons links={socialLinks} />
              </div>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="copyright" style={{ background: "#15141a", padding: "16px 0 0 0" }}>
          <div className="container">
            <div className="row" style={{ display: "flex", alignItems: "center" }}>
              <div className="col-lg-7" style={{ color: "#fff", fontSize: "1rem" }}>
                <p className="copyright__text text-white" style={{ margin: 0 }}>
                  &copy; {typeof window !== 'undefined' ? new Date().getFullYear() : '2025'} Serle&apos;s Bake
                </p>
              </div>
              <div className="col-lg-5">
                <div className="copyright__widget">
                  <ul style={{ display: "flex", gap: 16, listStyle: "none", padding: 0, margin: 0 }}>
                    <li><Link href="/blog" style={{ color: "#ffb6c1" }}>Blog</Link></li>
                    <li><Link href="/privacy-policy" style={{ color: "#ffb6c1" }}>Privacy Policy</Link></li>
                    <li><Link href="/terms-conditions" style={{ color: "#ffb6c1" }}>Terms &amp; Conditions</Link></li>
                    <li><Link href="/site-map" style={{ color: "#ffb6c1" }}>Site Map</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Search Begin */}
      <div className="search-model">
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="search-close-switch">+</div>
          <form className="search-model-form">
            <input type="text" id="search-input" placeholder="Search here....." />
          </form>
        </div>
      </div>
      {/* Search End */}
    </>
  );
}