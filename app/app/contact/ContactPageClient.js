'use client'
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaWhatsapp, FaUsers } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";

// Reusable ContactCard component with modern design
function ContactCard({ icon, title, children, link, gradient, iconBg }) {
  return (
    <div className="col-12 col-md-6 col-lg-3 mb-4">
      <div
        className="text-center p-4 h-100"
        style={{
          background: gradient || "linear-gradient(135deg, #f8a6b6 0%, #e4718a 100%)",
          border: "none",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(228, 113, 138, 0.15)",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(228, 113, 138, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(228, 113, 138, 0.15)";
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "60px",
          height: "60px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          zIndex: 1
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-15px",
          left: "-15px",
          width: "40px",
          height: "40px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          zIndex: 1
        }}></div>
        
        <div className="mb-3" style={{ 
          color: "#fff", 
          position: "relative",
          zIndex: 2
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            background: iconBg || "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.3)"
          }}>
            {icon}
          </div>
        </div>
        <h5 className="fw-bold mb-3" style={{ 
          color: "#fff", 
          fontSize: "1.1rem",
          position: "relative",
          zIndex: 2
        }}>{title}</h5>
        {link ? (
          <a
            href={link}
            className="text-decoration-none"
            style={{ 
              color: "#fff", 
              position: "relative",
              zIndex: 2,
              opacity: 0.95,
              transition: "opacity 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.95"}
          >
            {children}
          </a>
        ) : (
          <div style={{ 
            color: "#fff", 
            opacity: 0.95,
            position: "relative",
            zIndex: 2
          }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactPageClient() {
  return (
    <>
      <Breadcrumb title="Contact Us" headingLevel="h2" />
      
      {/* Hero Section */}
      <section style={{ 
        background: "linear-gradient(135deg, #fef7f8 0%, #fff5f6 50%, #ffeef1 100%)", 
        padding: "80px 0 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: "absolute",
          top: "20px",
          left: "10%",
          width: "100px",
          height: "100px",
          background: "linear-gradient(45deg, #f8a6b6, #e4718a)",
          borderRadius: "50%",
          opacity: 0.1,
          animation: "float 6s ease-in-out infinite"
        }}></div>
        <div style={{
          position: "absolute",
          top: "60px",
          right: "15%",
          width: "80px",
          height: "80px",
          background: "linear-gradient(45deg, #e4718a, #f8a6b6)",
          borderRadius: "50%",
          opacity: 0.08,
          animation: "float 8s ease-in-out infinite reverse"
        }}></div>
        
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3" style={{ 
              background: "linear-gradient(135deg, #e4718a, #f8a6b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Get in Touch
            </h1>
            <p className="lead text-muted" style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
              We'd love to hear from you! Reach out to us using any of the methods below and let's create something sweet together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h2 fw-bold mb-3" style={{ color: "#231f20" }}>Contact Information</h2>
            <div style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #e4718a, #f8a6b6)",
              margin: "0 auto",
              borderRadius: "2px"
            }}></div>
          </div>
          
          <div className="row justify-content-center">
            <ContactCard
              icon={<FaMapMarkerAlt size={28} />}
              title="Visit Us"
              link="https://maps.google.com/?q=Tenkasi+Sengottai+Main+Road+Ilanji+Tenkasi+Tamil+Nadu"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              iconBg="rgba(255,255,255,0.25)"
            >
              <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                Tenkasi - Sengottai Main Road,<br />
                Ilanji, Tenkasi, Tamil Nadu
              </div>
            </ContactCard>
            
            <ContactCard
              icon={<FaEnvelope size={28} />}
              title="Email Us"
              link="mailto:serlesbake@gmail.com"
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              iconBg="rgba(255,255,255,0.25)"
            >
              <div style={{ fontSize: "0.95rem" }}>
                serlesbake@gmail.com
              </div>
            </ContactCard>
            
            <ContactCard
              icon={<FaPhone size={28} />}
              title="Call Us"
              link="tel:+916383070725"
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              iconBg="rgba(255,255,255,0.25)"
            >
              <div style={{ fontSize: "0.95rem" }}>
                +91 63830 70725
              </div>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* Social Media & Community Section */}
      <section style={{ 
        background: "linear-gradient(135deg, #fef7f8 0%, #fff5f6 100%)", 
        padding: "60px 0",
        position: "relative"
      }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h2 fw-bold mb-3" style={{ color: "#231f20" }}>Connect With Us</h2>
            <p className="text-muted mb-4" style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
              Follow us for daily updates, special offers, and behind-the-scenes content!
            </p>
            <div style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #e4718a, #f8a6b6)",
              margin: "0 auto",
              borderRadius: "2px"
            }}></div>
          </div>
          
          <div className="row justify-content-center">
            <ContactCard
              icon={<FaInstagram size={28} />}
              title="Instagram"
              link="https://www.instagram.com/serles_bake"
              gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              iconBg="rgba(255,255,255,0.25)"
            >
              <div style={{ fontSize: "0.95rem" }}>
                @serlesbake
              </div>
              <small style={{ fontSize: '0.8rem', opacity: 0.9, display: 'block', marginTop: '5px' }}>
                Daily cake inspirations & offers
              </small>
            </ContactCard>
            
            <ContactCard
              icon={<FaFacebook size={28} />}
              title="Facebook"
              link="https://www.facebook.com/serlesbake"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              iconBg="rgba(255,255,255,0.25)"
            >
              <div style={{ fontSize: "0.95rem" }}>
                Serle's Bake
              </div>
              <small style={{ fontSize: '0.8rem', opacity: 0.9, display: 'block', marginTop: '5px' }}>
                Community updates & events
              </small>
            </ContactCard>
            
            <ContactCard
              icon={<FaWhatsapp size={28} />}
              title="WhatsApp Community"
              link="https://wa.me/916383070725?text=Hi! I'd like to join your WhatsApp community for special offers and updates!"
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              iconBg="rgba(255,255,255,0.25)"
            >
              <div style={{ fontSize: "0.95rem" }}>
                Join Our Community
              </div>
              <small style={{ fontSize: '0.8rem', opacity: 0.9, display: 'block', marginTop: '5px' }}>
                Exclusive offers & quick orders
              </small>
            </ContactCard>
            
            <ContactCard
              icon={<FaUsers size={28} />}
              title="Special Offers"
              link="https://wa.me/916383070725?text=Hi! I'm interested in your special offers and discounts!"
              gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
              iconBg="rgba(255,255,255,0.25)"
            >
              <div style={{ fontSize: "0.95rem" }}>
                Get Latest Offers
              </div>
              <small style={{ fontSize: '0.8rem', opacity: 0.9, display: 'block', marginTop: '5px' }}>
                Birthday discounts & seasonal deals
              </small>
            </ContactCard>
          </div>
        </div>
      </section>

      {/* Decorative footer */}
      <div style={{ 
        background: "linear-gradient(135deg, #231f20 0%, #2c2c2c 100%)", 
        height: "80px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #e4718a, transparent)"
        }}></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </>
  );
} 