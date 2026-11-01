import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildProductMetadata } from '../app/utils/productMetadata.js';

test('editorial search and social fields win over product body copy', () => {
  const result = buildProductMetadata({
    name: 'Black Forest', description: 'Long body copy that must not become the search summary.',
    meta_data: {
      meta_title: 'Black Forest cake in Tenkasi', meta_description: 'A separately edited search summary.',
      og_title: 'Share a Black Forest', og_description: 'A social-specific description.',
      og_image_url: 'https://cdn.serlesbake.in/social.jpg',
      twitter_title: 'A distinct Twitter title', twitter_description: 'A distinct Twitter summary.',
      twitter_image_url: 'https://cdn.serlesbake.in/twitter.jpg',
    },
  }, 'premium-cake', 'black-forest');
  assert.equal(result.title, 'Black Forest cake in Tenkasi');
  assert.equal(result.description, 'A separately edited search summary.');
  assert.equal(result.openGraph.description, 'A social-specific description.');
  assert.equal(result.twitter.title, 'A distinct Twitter title');
  assert.equal(result.twitter.description, 'A distinct Twitter summary.');
  assert.deepEqual(result.twitter.images, ['https://cdn.serlesbake.in/twitter.jpg']);
  assert.equal(result.alternates.canonical, 'https://www.serlesbake.in/cakes/premium-cake/black-forest');
});

test('blank CMS fields use readable short copy and ignore unusable image URLs', () => {
  const result = buildProductMetadata({
    name: 'Photo Cake', short_description: '<p>Choose a photo &amp; message.</p>',
    description: 'This full description must not override the short one.',
    featured_image: { url: '/img/cake.jpg' },
    meta_data: { meta_title: '  ', meta_description: '<p> </p>', og_image_url: 'javascript:alert(1)' },
  }, 'custom-cake', 'photo-cake');
  assert.equal(result.title, "Photo Cake in Tenkasi | Serle's Bake");
  assert.equal(result.description, 'Choose a photo & message.');
  assert.deepEqual(result.openGraph.images, ['https://www.serlesbake.in/img/cake.jpg']);
  assert.equal(result.twitter.description, result.description);
});

test('missing detail or only long body copy produces usable bounded fallback metadata', () => {
  const fallback = buildProductMetadata({}, 'premium-cake', 'black-forest');
  assert.equal(fallback.title, "Black Forest in Tenkasi | Serle's Bake");
  assert.ok(fallback.description.includes('WhatsApp'));
  assert.ok(!fallback.title.includes('undefined'));
  const result = buildProductMetadata({ name: 'Cake', description: `<p>${'Fresh cake '.repeat(80)}</p>` }, 'custom-cake', 'cake');
  assert.ok(result.description.length <= 160);
  assert.ok(!result.description.includes('<p>'));
  assert.ok(result.description.endsWith('…'));
});
