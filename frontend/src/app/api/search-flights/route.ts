// API Route: /api/search-flights
// Searches flights from database cache

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAirportCode } from '@/lib/scrapers/constants';
import { FlightRoute } from '@/generated/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCity = searchParams.get('from');
    const toCity = searchParams.get('to');
    const date = searchParams.get('date');
    const sortBy = searchParams.get('sortBy') || 'price'; // price, duration, departure
    const airline = searchParams.get('airline');
    const maxPrice = searchParams.get('maxPrice');
    const stops = searchParams.get('stops'); // 0, 1, 2

    // Validate input
    if (!fromCity || !toCity || !date) {
      return NextResponse.json(
        { success: false, error: 'from, to, and date parameters are required' },
        { status: 400 }
      );
    }

    // Get airport codes
    const fromAirport = getAirportCode(fromCity);
    const toAirport = getAirportCode(toCity);

    if (!fromAirport || !toAirport) {
      return NextResponse.json(
        { success: false, error: 'Invalid city name' },
        { status: 400 }
      );
    }

    // Build query filters
    const where: {
      fromCity: string;
      toCity: string;
      flightDate: Date;
      isActive: boolean;
      airline?: string;
      stops?: number;
    } = {
      fromCity: fromAirport.city,
      toCity: toAirport.city,
      flightDate: new Date(date),
      isActive: true,
    };

    if (airline) {
      where.airline = airline;
    }

    if (stops !== null && stops !== undefined) {
      where.stops = parseInt(stops);
    }

    // Search in database
    const flights = await prisma.flightRoute.findMany({
      where,
      orderBy: getOrderBy(sortBy),
    });

    // Filter by max price if specified
    let filteredFlights = flights;
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice);
      filteredFlights = flights.filter((flight) => flight.priceEconomy <= maxPriceNum);
    }

    // Check cache freshness
    const cacheEntry = await prisma.flightSearchCache.findUnique({
      where: {
        fromCity_toCity_searchDate: {
          fromCity: fromAirport.city,
          toCity: toAirport.city,
          searchDate: new Date(date),
        },
      },
    });

    const cacheAge = cacheEntry
      ? Math.floor((Date.now() - cacheEntry.lastSearched.getTime()) / (1000 * 60 * 60))
      : null;

    const isStale = cacheAge === null || cacheAge > 6; // Flights stale after 6 hours

    return NextResponse.json({
      success: true,
      data: filteredFlights.map(formatFlightForResponse),
      count: filteredFlights.length,
      fromCache: true,
      cacheAge: cacheAge !== null ? `${cacheAge} hours` : null,
      isStale,
      needsScraping: isStale || filteredFlights.length === 0,
      route: {
        from: {
          city: fromAirport.city,
          code: fromAirport.code,
        },
        to: {
          city: toAirport.city,
          code: toAirport.code,
        },
        date,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Search Error:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// POST: Search with more options
export async function POST(request: Request) {
  try {
    const {
      fromCity,
      toCity,
      date,
      sortBy = 'price',
      filters = {},
    } = await request.json();

    // Validate input
    if (!fromCity || !toCity || !date) {
      return NextResponse.json(
        { success: false, error: 'fromCity, toCity, and date are required' },
        { status: 400 }
      );
    }

    // Get airport codes
    const fromAirport = getAirportCode(fromCity);
    const toAirport = getAirportCode(toCity);

    if (!fromAirport || !toAirport) {
      return NextResponse.json(
        { success: false, error: 'Invalid city name' },
        { status: 400 }
      );
    }

    // Build query
    const where: {
      fromCity: string;
      toCity: string;
      flightDate: Date;
      isActive: boolean;
      airline?: string;
      stops?: number;
    } = {
      fromCity: fromAirport.city,
      toCity: toAirport.city,
      flightDate: new Date(date),
      isActive: true,
    };

    // Apply filters
    if (filters.airline) {
      where.airline = filters.airline;
    }

    if (filters.stops !== undefined) {
      where.stops = filters.stops;
    }

    // Search in database
    const flights = await prisma.flightRoute.findMany({
      where,
      orderBy: getOrderBy(sortBy),
    });

    // Apply price filter
    let filteredFlights = flights;
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      filteredFlights = filteredFlights.filter((flight) => flight.priceEconomy <= maxPrice);
    }

    // Apply time filter
    if (filters.departureAfter) {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.departureTime >= filters.departureAfter
      );
    }

    if (filters.departureBefore) {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.departureTime <= filters.departureBefore
      );
    }

    // Check if we need to scrape fresh data
    const cacheEntry = await prisma.flightSearchCache.findUnique({
      where: {
        fromCity_toCity_searchDate: {
          fromCity: fromAirport.city,
          toCity: toAirport.city,
          searchDate: new Date(date),
        },
      },
    });

    const needsScraping = !cacheEntry ||
      (Date.now() - cacheEntry.lastSearched.getTime()) > 6 * 60 * 60 * 1000;

    return NextResponse.json({
      success: true,
      data: filteredFlights.map(formatFlightForResponse),
      count: filteredFlights.length,
      fromCache: true,
      needsScraping,
      route: {
        from: {
          city: fromAirport.city,
          code: fromAirport.code,
        },
        to: {
          city: toAirport.city,
          code: toAirport.code,
        },
        date,
      },
      appliedFilters: filters,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Search Error:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// Helper: Get sort order
function getOrderBy(sortBy: string) {
  switch (sortBy) {
    case 'duration':
      return { duration: 'asc' as const };
    case 'departure':
      return { departureTime: 'asc' as const };
    case 'price':
    default:
      return { priceEconomy: 'asc' as const };
  }
}

// Helper: Format flight data for API response
function formatFlightForResponse(flight: FlightRoute) {
  return {
    id: flight.id,
    flightNumber: flight.flightNumber,
    airline: flight.airline,
    airlineCode: flight.airlineCode,
    from: {
      airport: flight.fromAirport,
      city: flight.fromCity,
    },
    to: {
      airport: flight.toAirport,
      city: flight.toCity,
    },
    schedule: {
      departure: flight.departureTime,
      arrival: flight.arrivalTime,
      duration: flight.duration,
      date: flight.flightDate,
    },
    stops: flight.stops,
    pricing: {
      economy: flight.priceEconomy,
      business: flight.priceBusiness,
    },
    meta: {
      source: flight.source,
      sourceUrl: flight.sourceUrl,
      lastUpdated: flight.updatedAt,
    },
  };
}
