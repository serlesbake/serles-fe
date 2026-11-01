'use client';
import { useEffect } from 'react';
import { trackStoreEvent } from '../utils/analytics';
import { contactEventName } from '../utils/contactTracking';

/** Ordinary links, including CMS HTML. Product button events remain separate. */
export default function ContactClickTracking() {
  useEffect(() => {
    const handleClick = (event) => {
      if (event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1)) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link || link.closest('[data-contact-tracking="manual"]')) return;
      const name = contactEventName(link.getAttribute('href'), window.location.origin);
      if (!name) return;
      const source = link.closest('[data-contact-source]')?.getAttribute('data-contact-source')
        || (link.closest('footer') ? 'footer' : link.closest('header') ? 'header' : 'site_link');
      trackStoreEvent(name, { source, page_path: window.location.pathname });
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('auxclick', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('auxclick', handleClick);
    };
  }, []);
  return null;
}
