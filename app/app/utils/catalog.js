/** Fetch catalog data without converting transport failures into empty inventory. */
export async function fetchCatalogJson(url) {
  const headers = { Accept: 'application/json' };
  if (typeof window === 'undefined') {
    headers['User-Agent'] = 'SerlesBake-Frontend/1.0';
  }

  const response = await fetch(url, {
    headers,
    ...(typeof window === 'undefined' ? { next: { revalidate: 60 } } : {}),
  });

  if (!response.ok) {
    throw new Error(`Catalog request failed (${response.status})`);
  }

  return response.json();
}

export function catalogList(payload) {
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload)) return payload;
  throw new Error('Catalog response did not contain a product or category list');
}
