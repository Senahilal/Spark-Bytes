/**
 * Unsplash Search API Route
 * 
 * This file implements a serverless API endpoint that proxies search requests to the Unsplash API.
 * It allows client-side applications to search for images without exposing the Unsplash API key.
 * 
 * Endpoint: /api/unsplash-search
 * Method: GET
 * 
 * @module api/unsplash-search
 * @requires next/server
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to the Unsplash search API endpoint
 * 
 * @param {NextRequest} request - The incoming Next.js request object
 * @returns {Promise<NextResponse>} JSON response with either Unsplash search results or error information
 * 
 * @example
 * // Example request:
 * // GET /api/unsplash-search?query=mountains&per_page=10
 */
export async function GET(request: NextRequest) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  
  // Get the search query parameter - this is required
  const query = searchParams.get("query");
  
  // Get the per_page parameter with a default of 30 results if not specified
  const per_page = searchParams.get("per_page") || "30";

  // Validate that a search query was provided
  if (!query) {
    // Return a 400 Bad Request response if the query parameter is missing
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  try {
    // Construct and execute the request to the Unsplash API
    // The query is URL-encoded to ensure special characters are properly handled
    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${per_page}`,
      {
        headers: {
          // Authorization header using the Unsplash API key from environment variables
          // The environment variable must be set in the project configuration
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    // Check if the Unsplash API request was successful
    if (!unsplashRes.ok) {
      // If not successful, extract the error text from the response
      const text = await unsplashRes.text();
      
      // Return an error response with the status code from Unsplash
      // and either the error text or the status text as the error message
      return NextResponse.json(
        { error: text || unsplashRes.statusText },
        { status: unsplashRes.status }
      );
    }

    // Parse the successful response as JSON
    const data = await unsplashRes.json();
    
    // Return the Unsplash data directly to the client
    // This will include photo results, pagination info, and metadata
    return NextResponse.json(data);
  } catch (err) {
    // Log any unexpected errors that occur during the API request
    console.error("Unsplash API error:", err);
    
    // Return a 500 Internal Server Error response for any uncaught exceptions
    // This provides a fallback for unexpected failures
    return NextResponse.json(
      { error: "Unsplash search failed" },
      { status: 500 }
    );
  }
}