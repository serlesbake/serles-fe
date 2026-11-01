import assert from 'node:assert/strict';
import test from 'node:test';
import { contactEventName } from '../app/utils/contactTracking.js';

const origin = 'https://www.serlesbake.in';

test('classifies supported contact links without exposing their private query strings', () => {
  for (const href of [
    'https://wa.me/916383070725?text=PRIVATE_MESSAGE',
    'https://api.whatsapp.com/send/?phone=916383070725&text=PRIVATE_MESSAGE',
    'https://web.whatsapp.com/send?text=PRIVATE_MESSAGE',
  ]) assert.equal(contactEventName(href, origin), 'whatsapp_enquiry_click');
  assert.equal(contactEventName('tel:+916383070725', origin), 'phone_click');
});

test('does not count normal navigation, misleading hosts or unsafe protocols as enquiries', () => {
  for (const href of ['/cake-delivery', '/menu', 'https://wa.me.example.org/123',
    'https://whatsapp.com/channel/example', 'https://api.whatsapp.com/privacy',
    'javascript:alert(1)', 'http://wa.me/123', 'https://[malformed']) {
    assert.equal(contactEventName(href, origin), null, href);
  }
});
