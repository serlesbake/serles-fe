import Breadcrumb from "../components/Breadcrumb";

export const metadata = {
  title: "Privacy Policy | Serle’s Bake, Tenkasi",
  description: "Read our privacy policy for ordering cakes with Serle’s Bake – Tenkasi’s trusted cake shop for birthday cakes, brownies & custom creations with same-day delivery.",
  keywords: "cake shop privacy tenkasi, serles bake privacy, order privacy, best cake shop tenkasi",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumb title="Privacy Policy" headingLevel="h2" />
      
      <section style={{ 
        background: "linear-gradient(135deg, #fef7f8 0%, #fff5f6 100%)", 
        padding: "80px 0 60px",
        minHeight: "100vh"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 8px 32px rgba(228, 113, 138, 0.1)",
                lineHeight: "1.8"
              }}>
                <h1 className="text-center mb-5" style={{ 
                  color: "#e4718a",
                  fontWeight: "700",
                  fontSize: "2.5rem"
                }}>
                  Privacy Policy
                </h1>
                
                <div style={{ fontSize: "1rem", color: "#333" }}>
                  <p className="text-muted mb-4">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>1. Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as when you:
                  </p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Place an order on our website</li>
                    <li>Contact us through phone, email, or WhatsApp</li>
                    <li>Subscribe to our newsletter or updates</li>
                    <li>Participate in surveys or promotions</li>
                    <li>Visit our website (cookies and usage data)</li>
                  </ul>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>2. Types of Information</h2>
                  <p><strong>Personal Information:</strong></p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Name and contact details (phone, email, address)</li>
                    <li>Order history and preferences</li>
                    <li>Payment information (processed securely)</li>
                    <li>Delivery instructions and special requirements</li>
                  </ul>
                  
                  <p><strong>Usage Information:</strong></p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>IP address and browser type</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information and location data</li>
                    <li>Cookies and similar technologies</li>
                  </ul>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>3. How We Use Your Information</h2>
                  <p>We use the collected information to:</p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Process and fulfill your orders</li>
                    <li>Communicate about orders, delivery, and customer service</li>
                    <li>Send promotional offers and updates (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Ensure food safety and allergen information</li>
                    <li>Comply with legal obligations</li>
                  </ul>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>4. Information Sharing</h2>
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share information with:
                  </p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Delivery partners (only necessary information for delivery)</li>
                    <li>Payment processors (for secure payment processing)</li>
                    <li>Legal authorities (when required by law)</li>
                    <li>Service providers (website hosting, analytics)</li>
                  </ul>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>5. Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Encryption of sensitive data</li>
                    <li>Secure payment processing</li>
                    <li>Regular security assessments</li>
                    <li>Limited access to personal information</li>
                    <li>Secure data storage and transmission</li>
                  </ul>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>6. Cookies and Tracking</h2>
                  <p>
                    We use cookies and similar technologies to:
                  </p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website usage and performance</li>
                    <li>Provide personalized content and offers</li>
                    <li>Improve user experience</li>
                  </ul>
                  <p>
                    You can control cookie settings through your browser preferences.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>7. Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Lodge a complaint with authorities</li>
                  </ul>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>8. Data Retention</h2>
                  <p>
                    We retain your personal information for as long as necessary to:
                  </p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Provide our services</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Enforce agreements</li>
                  </ul>
                  <p>
                    Order information is typically retained for 7 years for tax and legal purposes.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>9. Children's Privacy</h2>
                  <p>
                    Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>10. Third-Party Links</h2>
                  <p>
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>11. Changes to Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>12. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div style={{ 
                    background: "#f8f9fa", 
                    padding: "1rem", 
                    borderRadius: "10px",
                    marginTop: "1rem"
                  }}>
                    <p style={{ margin: "0" }}>
                      <strong>Serles Bake</strong><br />
                      Tenkasi - Sengottai Main Road, Ilanji, Tenkasi, Tamil Nadu<br />
                      Phone: +91 63830 70725<br />
                      Email: serlesbake@gmail.com<br />
                      Website: serlesbake.in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 