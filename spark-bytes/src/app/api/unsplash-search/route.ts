// src/app/api/unsplash-search/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const per_page = searchParams.get("per_page") || "30";

  if (!query) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  try {
    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${per_page}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!unsplashRes.ok) {
      const text = await unsplashRes.text();
      return NextResponse.json(
        { error: text || unsplashRes.statusText },
        { status: unsplashRes.status }
      );
    }

    const data = await unsplashRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Unsplash API error:", err);
    return NextResponse.json(
      { error: "Unsplash search failed" },
      { status: 500 }
    );
  }
}
