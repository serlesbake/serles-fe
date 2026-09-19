import Breadcrumb from "../components/Breadcrumb";

export const metadata = {
  title: "Terms & Conditions | Serle’s Bake, Tenkasi",
  description: "Read our terms and conditions for ordering cakes with Serle’s Bake – Tenkasi’s trusted cake shop for birthday cakes, brownies & custom creations with same-day delivery.",
  keywords: "cake shop terms tenkasi, serles bake terms, order terms, best cake shop tenkasi",
};

export default function TermsConditionsPage() {
  return (
    <>
      <Breadcrumb title="Terms & Conditions" headingLevel="h2" />
      
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
                  Terms & Conditions
                </h1>
                
                <div style={{ fontSize: "1rem", color: "#333" }}>
                  <p className="text-muted mb-4">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using serlesbake.in ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>2. Use License</h2>
                  <p>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Serles Bake's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul style={{ marginLeft: "2rem", marginBottom: "1rem" }}>
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>3. Ordering & Payment</h2>
                  <p>
                    All orders are subject to acceptance and availability. Prices are subject to change without notice. Payment must be made in full at the time of ordering. We accept cash on delivery and online payments through secure payment gateways.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>4. Delivery Terms</h2>
                  <p>
                    Delivery is available within Tenkasi and surrounding areas. Delivery times are estimates and may vary based on location and order volume. We are not responsible for delays due to circumstances beyond our control.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>5. Cancellation Policy</h2>
                  <p>
                    Orders can be cancelled up to 24 hours before the scheduled delivery time. Cancellations made within 24 hours may incur a cancellation fee. Custom orders may have different cancellation terms.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>6. Refund Policy</h2>
                  <p>
                    Refunds are provided in case of quality issues or if the product is significantly different from what was ordered. Refund requests must be made within 24 hours of delivery. Refunds will be processed within 5-7 business days.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>7. Allergen Information</h2>
                  <p>
                    While we take care to avoid cross-contamination, our products may contain allergens including gluten, dairy, eggs, and nuts. Customers with allergies should inform us before placing orders.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>8. Intellectual Property</h2>
                  <p>
                    All content on this website, including text, graphics, logos, images, and software, is the property of Serles Bake and is protected by copyright laws.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>9. Limitation of Liability</h2>
                  <p>
                    Serles Bake shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service or any products purchased.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>10. Governing Law</h2>
                  <p>
                    These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>11. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website constitutes acceptance of the modified terms.
                  </p>

                  <h2 style={{ color: "#e4718a", marginTop: "2rem", marginBottom: "1rem" }}>12. Contact Information</h2>
                  <p>
                    For questions about these Terms & Conditions, please contact us at:
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
                      Email: serlesbake@gmail.com
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