const API_BASE = 'https://maps.googleapis.com/maps/api/place';

function getApiKey() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_MAPS_API_KEY in environment variables.');
  }
  return apiKey;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_message || 'Google Places request failed.');
  }

  if (data.status && !['OK', 'ZERO_RESULTS'].includes(data.status)) {
    throw new Error(data.error_message || `Google Places status: ${data.status}`);
  }

  return data;
}

export async function textSearchPlaces({ query }) {
  const apiKey = getApiKey();
  const url = `${API_BASE}/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  const data = await fetchJson(url);
  return data.results || [];
}

export async function getPlaceDetails(placeId) {
  const apiKey = getApiKey();
  const fields = [
    'name',
    'formatted_address',
    'formatted_phone_number',
    'international_phone_number',
    'website',
    'url',
    'business_status',
    'types',
    'rating',
    'user_ratings_total'
  ].join(',');

  const url = `${API_BASE}/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(fields)}&key=${apiKey}`;
  const data = await fetchJson(url);
  return data.result || null;
}
