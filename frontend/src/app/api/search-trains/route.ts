// API Route: /api/search-trains
// Searches trains from database cache

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStationCode } from '@/lib/scrapers/constants';
import { TrainRoute } from '@/generated/prisma';

interface TrainWhereInput {
  fromCity: string;
  toCity: string;
  isActive: boolean;
  trainType?: string;
  departureTime?: { gte?: string; lte?: string };
}

interface TrainFilters {
  trainType?: string;
  departureAfter?: string;
  departureBefore?: string;
  maxPrice?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCity = searchParams.get('from');
    const toCity = searchParams.get('to');
    const sortBy = searchParams.get('sortBy') || 'departureTime'; // departureTime, price, duration
    const trainType = searchParams.get('type'); // Rajdhani, Shatabdi, etc.
    const maxPrice = searchParams.get('maxPrice');

    // Validate input
    if (!fromCity || !toCity) {
      return NextResponse.json(
        { success: false, error: 'from and to parameters are required' },
        { status: 400 }
      );
    }

    // Get station codes
    const fromStation = getStationCode(fromCity);
    const toStation = getStationCode(toCity);

    if (!fromStation || !toStation) {
      return NextResponse.json(
        { success: false, error: 'Invalid city name' },
        { status: 400 }
      );
    }

    // Build query filters
    const where: any = {
      fromCity: fromStation.city,
      toCity: toStation.city,
      isActive: true,
    };

    if (trainType) {
      where.trainType = trainType;
    }

    // Search in database
    const trains = await prisma.trainRoute.findMany({
      where,
      orderBy: getOrderBy(sortBy),
    });

    // Filter by max price if specified
    let filteredTrains = trains;
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice);
      filteredTrains = trains.filter((train) => {
        // Check if any available class is within budget
        const prices = [
          train.priceGeneral,
          train.priceSleeper,
          train.priceAC3,
          train.priceAC2,
          train.priceAC1,
        ].filter((p) => p !== null);

        return prices.some((p) => p !== null && p <= maxPriceNum);
      });
    }

    // Check cache freshness
    const cacheEntry = await prisma.trainSearchCache.findUnique({
      where: {
        fromCity_toCity: {
          fromCity: fromStation.city,
          toCity: toStation.city,
        },
      },
    });

    const cacheAge = cacheEntry
      ? Math.floor((Date.now() - cacheEntry.lastSearched.getTime()) / (1000 * 60 * 60))
      : null;

    const isStale = cacheAge === null || cacheAge > 12; // Stale after 12 hours

    return NextResponse.json({
      success: true,
      data: filteredTrains.map(formatTrainForResponse),
      count: filteredTrains.length,
      fromCache: true,
      cacheAge: cacheAge ? `${cacheAge} hours` : null,
      isStale,
      route: {
        from: {
          city: fromStation.city,
          code: fromStation.code,
        },
        to: {
          city: toStation.city,
          code: toStation.code,
        },
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
      sortBy = 'departureTime',
      filters = {},
    } = await request.json();

    // Validate input
    if (!fromCity || !toCity) {
      return NextResponse.json(
        { success: false, error: 'fromCity and toCity are required' },
        { status: 400 }
      );
    }

    // Get station codes
    const fromStation = getStationCode(fromCity);
    const toStation = getStationCode(toCity);

    if (!fromStation || !toStation) {
      return NextResponse.json(
        { success: false, error: 'Invalid city name' },
        { status: 400 }
      );
    }

    // Build query
    const where: any = {
      fromCity: fromStation.city,
      toCity: toStation.city,
      isActive: true,
    };

    // Apply filters
    if (filters.trainType) {
      where.trainType = filters.trainType;
    }

    if (filters.departureAfter) {
      where.departureTime = {
        gte: filters.departureAfter,
      };
    }

    if (filters.departureBefore) {
      where.departureTime = {
        ...where.departureTime,
        lte: filters.departureBefore,
      };
    }

    // Search in database
    const trains = await prisma.trainRoute.findMany({
      where,
      orderBy: getOrderBy(sortBy),
    });

    // Filter by day of week if date specified
    let filteredTrains = trains;
    if (date) {
      const dayOfWeek = getDayOfWeek(date);
      filteredTrains = trains.filter((train) =>
        train.runningDays.includes(dayOfWeek)
      );
    }

    // Apply price filter
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      filteredTrains = filteredTrains.filter((train) => {
        const prices = [
          train.priceGeneral,
          train.priceSleeper,
          train.priceAC3,
          train.priceAC2,
          train.priceAC1,
        ].filter((p) => p !== null);

        return prices.length === 0 || prices.some((p) => p !== null && p <= maxPrice);
      });
    }

    // Check if we need to scrape fresh data
    const cacheEntry = await prisma.trainSearchCache.findUnique({
      where: {
        fromCity_toCity: {
          fromCity: fromStation.city,
          toCity: toStation.city,
        },
      },
    });

    const needsScraping = !cacheEntry ||
      (Date.now() - cacheEntry.lastSearched.getTime()) > 12 * 60 * 60 * 1000;

    return NextResponse.json({
      success: true,
      data: filteredTrains.map(formatTrainForResponse),
      count: filteredTrains.length,
      fromCache: true,
      needsScraping,
      route: {
        from: {
          city: fromStation.city,
          code: fromStation.code,
        },
        to: {
          city: toStation.city,
          code: toStation.code,
        },
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

// Helper: Get sort order based on sortBy parameter
function getOrderBy(sortBy: string) {
  switch (sortBy) {
    case 'price':
      return { priceAC3: 'asc' as const };
    case 'duration':
      return { duration: 'asc' as const };
    case 'departureTime':
    default:
      return { departureTime: 'asc' as const };
  }
}

// Helper: Get day of week from date string
function getDayOfWeek(dateStr: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

// Helper: Format train data for API response
function formatTrainForResponse(train: any) {
  return {
    id: train.id,
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    trainType: train.trainType,
    from: {
      station: train.fromStation,
      city: train.fromCity,
    },
    to: {
      station: train.toStation,
      city: train.toCity,
    },
    schedule: {
      departure: train.departureTime,
      arrival: train.arrivalTime,
      duration: train.duration,
      runningDays: train.runningDays,
    },
    pricing: {
      general: train.priceGeneral,
      sleeper: train.priceSleeper,
      ac3: train.priceAC3,
      ac2: train.priceAC2,
      ac1: train.priceAC1,
    },
    meta: {
      source: train.source,
      sourceUrl: train.sourceUrl,
      lastUpdated: train.updatedAt,
    },
  };
}
