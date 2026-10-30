/** Send a small conversion event to the analytics tools already loaded globally. */
export function trackStoreEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, params);
  }
}
