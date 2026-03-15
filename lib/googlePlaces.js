const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function ensureApiKey() {
  if (!GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY in environment variables.");
  }
}

async function fetchJson(url) {
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Google API HTTP error: ${res.status}`);
  }

  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(
      `Google API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ""}`
    );
  }

  return data;
}

async function getPlaceDetails(placeId) {
  const fields = [
    "name",
    "formatted_address",
    "formatted_phone_number",
    "website",
    "business_status",
    "url",
    "types",
    "rating",
    "user_ratings_total",
  ].join(",");

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json?` +
    `place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&key=${encodeURIComponent(GOOGLE_API_KEY)}`;

  const data = await fetchJson(url);
  return data.result || {};
}

export async function searchBusinesses({
  city,
  country,
  keyword,
  maxResults = 1,
}) {
  ensureApiKey();

  const query = `${keyword} in ${city}, ${country}`.trim();

  const textSearchUrl =
    `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
    `query=${encodeURIComponent(query)}` +
    `&key=${encodeURIComponent(GOOGLE_API_KEY)}`;

  const data = await fetchJson(textSearchUrl);

  const places = Array.isArray(data.results) ? data.results.slice(0, maxResults) : [];

  const detailedResults = await Promise.all(
    places.map(async (place) => {
      const details = await getPlaceDetails(place.place_id);

      return {
        placeId: place.place_id || "",
        name: details.name || place.name || "",
        address: details.formatted_address || place.formatted_address || "",
        phone: details.formatted_phone_number || "",
        website: details.website || "",
        hasWebsite: Boolean(details.website),
        googleMapsUrl: details.url || "",
        category: Array.isArray(details.types)
          ? details.types.join(", ")
          : Array.isArray(place.types)
          ? place.types.join(", ")
          : "",
        rating: details.rating || place.rating || "",
        userRatingsTotal:
          details.user_ratings_total || place.user_ratings_total || "",
        businessStatus: details.business_status || place.business_status || "",
      };
    })
  );

  return detailedResults;
}
