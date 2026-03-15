import { NextResponse } from "next/server";
import { searchBusinesses } from "@/lib/googlePlaces";

export async function POST(req) {
  try {
    const body = await req.json();
    const city = body?.city || "";
    const country = body?.country || "";
    const keyword = body?.keyword || "";
    const noWebsiteOnly = Boolean(body?.noWebsiteOnly);

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
      { error: "Failed to search businesses." },
      { status: 500 }
    );
  }
}
