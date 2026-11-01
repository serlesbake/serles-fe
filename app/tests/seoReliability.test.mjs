import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchBlog } from '../app/utils/blog.js';
import { generateXMLSitemap } from '../app/utils/sitemap.mjs';

test('missing article stays a 404 candidate while outages and invalid JSON propagate', async () => {
  const previous = global.fetch;
  try {
    global.fetch = async () => new Response('{}', { status: 404 });
    assert.equal(await fetchBlog('https://example.test/missing', { required: true }), null);
    await assert.rejects(fetchBlog('https://example.test/sitemap', { required: true, allowNotFound: false }), /404/);
    global.fetch = async () => new Response('unavailable', { status: 503 });
    await assert.rejects(fetchBlog('https://example.test/known', { required: true }), /503/);
    global.fetch = async () => new Response('not-json', { status: 200 });
    await assert.rejects(fetchBlog('https://example.test/known', { required: true }), SyntaxError);
    global.fetch = async () => { throw new Error('timeout'); };
    await assert.rejects(fetchBlog('https://example.test/known', { required: true }), /timeout/);
  } finally { global.fetch = previous; }
});

test('sitemap is stable without edits and does not silently drop the blog during an outage', async () => {
  const previous = global.fetch;
  try {
    const mock = async (input) => {
      const path = new URL(input).pathname;
      let data = [];
      if (path === '/api/products/') data = [{ slug: 'cake', category: { slug: 'custom-cake' }, tags: [] }];
      else if (path === '/api/categories/') data = [{ slug: 'custom-cake' }];
      else if (path.includes('/blog/posts/sitemap')) data = [{ slug: 'guide', lastmod: '2026-10-01T10:00:00Z' }];
      return Response.json(data);
    };
    global.fetch = mock;
    const first = await generateXMLSitemap();
    const second = await generateXMLSitemap();
    assert.equal(first, second);
    assert.match(first, /2026-10-01T10:00:00\.000Z/);
    assert.equal((first.match(/<lastmod>/g) || []).length, 1);
    assert.match(first, /cake-delivery\/mekkarai/);
    global.fetch = async (input) => new URL(input).pathname.includes('/blog/')
      ? new Response('unavailable', { status: 503 }) : mock(input);
    await assert.rejects(generateXMLSitemap(), /503/);
  } finally { global.fetch = previous; }
});
