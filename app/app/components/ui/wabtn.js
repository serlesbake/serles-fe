import "@/app/components/ui/wabtn.css";
import { FaWhatsapp } from "react-icons/fa";
import { usePathname } from "next/navigation";
export default function Wabtn() {
    const pathname = usePathname();
    const isProductPage = /^\/cakes\/(?!tags(?:\/|$))[^/]+\/[^/]+\/?$/.test(pathname || '');
    const isDeliveryPage = /^\/cake-delivery(?:\/|$)/.test(pathname || '');
    return (
        <div>
          {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"> */}
<div data-contact-source="floating_whatsapp" className={`floating_btn${isProductPage ? ' floating_btn--product' : ''}${isDeliveryPage ? ' floating_btn--delivery' : ''}`}>
    <a target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp" href="https://api.whatsapp.com/send/?phone=916383070725&text=Hi!+I'm+interested+in+ordering+the+cakes">
      <div className="contact_icon">
        <FaWhatsapp />
      </div>
    </a>
    <p className="text_icon">Talk to us?</p>
  </div>
        </div>
    )
}
