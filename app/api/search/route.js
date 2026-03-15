import { NextResponse } from "next/server";
import { searchBusinesses } from "@/lib/googlePlaces";

export async function POST(req) {
  try {
    const body = await req.json();

    const city = body?.city?.trim() || "";
    const country = body?.country?.trim() || "";
    const keyword = body?.keyword?.trim() || "";
    const noWebsiteOnly = Boolean(body?.noWebsiteOnly);
    const maxResults = Number(body?.maxResults) || 1;

    if (!city || !country || !keyword) {
      return NextResponse.json(
        { error: "City, country, and keyword are required." },
        { status: 400 }
      );
    }

    const results = await searchBusinesses({
      city,
      country,
      keyword,
      maxResults: 1,
    });

    let filtered = results;

    if (noWebsiteOnly) {
      filtered = results.filter((item) => !item.website);
    }

    return NextResponse.json({
      results: filtered.slice(0, 1),
    });
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to search businesses.",
      },
      { status: 500 }
    );
  }
}
