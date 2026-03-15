import { getPlaceDetails, textSearchPlaces } from '@/lib/googlePlaces';

function normalizeLead(details, keyword, city, country) {
  const hasWebsite = Boolean(details.website);

  return {
    businessName: details.name || '',
    keyword,
    city,
    country,
    address: details.formatted_address || '',
    phoneNumber: details.formatted_phone_number || details.international_phone_number || '',
    website: details.website || '',
    hasWebsite: hasWebsite ? 'Yes' : 'No',
    mapsUrl: details.url || '',
    businessStatus: details.business_status || '',
    rating: details.rating ?? '',
    totalReviews: details.user_ratings_total ?? '',
    types: Array.isArray(details.types) ? details.types.join(', ') : ''
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      city = '',
      country = '',
      keyword = 'brand shops',
      maxResults = 20,
      filterNoWebsiteOnly = true
    } = body || {};

    if (!city || !country || !keyword) {
      return Response.json(
        { error: 'city, country, and keyword are required.' },
        { status: 400 }
      );
    }

    const query = `${keyword} in ${city}, ${country}`;
    const searchResults = await textSearchPlaces({ query });
    const limited = searchResults.slice(0, Math.min(Number(maxResults) || 20, 60));

    const detailsResults = [];
    for (const place of limited) {
      if (!place.place_id) continue;
      try {
        const details = await getPlaceDetails(place.place_id);
        if (details) {
          detailsResults.push(normalizeLead(details, keyword, city, country));
        }
      } catch (error) {
        detailsResults.push({
          businessName: place.name || 'Unknown',
          keyword,
          city,
          country,
          address: place.formatted_address || '',
          phoneNumber: '',
          website: '',
          hasWebsite: 'No',
          mapsUrl: '',
          businessStatus: '',
          rating: place.rating ?? '',
          totalReviews: place.user_ratings_total ?? '',
          types: Array.isArray(place.types) ? place.types.join(', ') : '',
          note: `Partial result: ${error.message}`
        });
      }
    }

    const deduped = Array.from(
      new Map(detailsResults.map((item) => [`${item.businessName}|${item.address}`, item])).values()
    );

    const filtered = filterNoWebsiteOnly
      ? deduped.filter((item) => item.hasWebsite === 'No')
      : deduped;

    return Response.json({
      query,
      totalFound: deduped.length,
      totalReturned: filtered.length,
      items: filtered
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
