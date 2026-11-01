/** Classify contact destinations without collecting message text or phone numbers. */
export function contactEventName(href, origin) {
  try {
    const url = new URL(href, origin);
    if (url.protocol === 'tel:') return 'phone_click';
    if (url.protocol !== 'https:') return null;
    if (url.hostname === 'wa.me') return 'whatsapp_enquiry_click';
    if (['api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname) && /^\/send\/?$/.test(url.pathname)) {
      return 'whatsapp_enquiry_click';
    }
  } catch { /* Malformed links must never interrupt navigation. */ }
  return null;
}
