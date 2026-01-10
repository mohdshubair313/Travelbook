// API Route: /api/scrape-trains
// Scrapes train data and saves to database

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeTrains } from '@/lib/scrapers/trainScraper';
import { getStationCode } from '@/lib/scrapers/constants';

export async function POST(request: Request) {
  try {
    const { fromCity, toCity, maxTrains = 30 } = await request.json();

    // Validate input
    if (!fromCity || !toCity) {
      return NextResponse.json(
        { success: false, error: 'fromCity and toCity are required' },
        { status: 400 }
      );
    }

    // Validate station codes exist
    const fromStation = getStationCode(fromCity);
    const toStation = getStationCode(toCity);

    if (!fromStation) {
      return NextResponse.json(
        { success: false, error: `Invalid source city: ${fromCity}` },
        { status: 400 }
      );
    }

    if (!toStation) {
      return NextResponse.json(
        { success: false, error: `Invalid destination city: ${toCity}` },
        { status: 400 }
      );
    }

    console.log(`\n🚂 Starting train scrape: ${fromCity} → ${toCity}`);

    // Scrape trains
    const trains = await scrapeTrains(fromCity, toCity, { maxTrains });

    console.log(`📦 Scraped ${trains.length} trains`);

    // Save to database
    let savedCount = 0;
    let updatedCount = 0;

    for (const train of trains) {
      try {
        // Upsert train route
        const existing = await prisma.trainRoute.findUnique({
          where: {
            trainNumber_fromStation_toStation: {
              trainNumber: train.trainNumber,
              fromStation: train.fromStation,
              toStation: train.toStation,
            },
          },
        });

        await prisma.trainRoute.upsert({
          where: {
            trainNumber_fromStation_toStation: {
              trainNumber: train.trainNumber,
              fromStation: train.fromStation,
              toStation: train.toStation,
            },
          },
          update: {
            trainName: train.trainName,
            trainType: train.trainType,
            fromCity: train.fromCity,
            toCity: train.toCity,
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            duration: train.duration,
            runningDays: train.runningDays,
            priceSleeper: train.priceSleeper,
            priceAC3: train.priceAC3,
            priceAC2: train.priceAC2,
            priceAC1: train.priceAC1,
            priceGeneral: train.priceGeneral,
            source: train.source,
            sourceUrl: train.sourceUrl,
            isActive: true,
            updatedAt: new Date(),
          },
          create: {
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            trainType: train.trainType,
            fromStation: train.fromStation,
            fromCity: train.fromCity,
            toStation: train.toStation,
            toCity: train.toCity,
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            duration: train.duration,
            runningDays: train.runningDays,
            priceSleeper: train.priceSleeper,
            priceAC3: train.priceAC3,
            priceAC2: train.priceAC2,
            priceAC1: train.priceAC1,
            priceGeneral: train.priceGeneral,
            source: train.source,
            sourceUrl: train.sourceUrl,
          },
        });

        if (existing) {
          updatedCount++;
        } else {
          savedCount++;
        }
      } catch (dbError: unknown) {
        const errMsg = dbError instanceof Error ? dbError.message : 'Unknown DB error';
        console.error(`❌ DB Error for train ${train.trainNumber}:`, errMsg);
      }
    }

    // Update search cache
    await prisma.trainSearchCache.upsert({
      where: {
        fromCity_toCity: {
          fromCity: fromStation.city,
          toCity: toStation.city,
        },
      },
      update: {
        resultsCount: trains.length,
        lastSearched: new Date(),
        isStale: false,
      },
      create: {
        fromCity: fromStation.city,
        toCity: toStation.city,
        resultsCount: trains.length,
        lastSearched: new Date(),
      },
    });

    console.log(`\n💾 Database: ${savedCount} new, ${updatedCount} updated`);

    return NextResponse.json({
      success: true,
      data: trains,
      count: trains.length,
      saved: savedCount,
      updated: updatedCount,
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
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Scraping Error:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

// GET: Return available cities/stations
export async function GET() {
  const cities = [
    { name: 'New Delhi', code: 'NDLS' },
    { name: 'Mumbai', code: 'CSTM' },
    { name: 'Kolkata', code: 'HWH' },
    { name: 'Chennai', code: 'MAS' },
    { name: 'Bangalore', code: 'SBC' },
    { name: 'Hyderabad', code: 'SC' },
    { name: 'Pune', code: 'PUNE' },
    { name: 'Ahmedabad', code: 'ADI' },
    { name: 'Jaipur', code: 'JP' },
    { name: 'Lucknow', code: 'LKO' },
    { name: 'Patna', code: 'PNBE' },
    { name: 'Varanasi', code: 'BSB' },
    { name: 'Goa', code: 'MAO' },
    { name: 'Bhopal', code: 'BPL' },
    { name: 'Chandigarh', code: 'CDG' },
    { name: 'Amritsar', code: 'ASR' },
    { name: 'Kochi', code: 'ERS' },
    { name: 'Coimbatore', code: 'CBE' },
    { name: 'Nagpur', code: 'NGP' },
    { name: 'Agra', code: 'AGC' },
  ];

  return NextResponse.json({
    success: true,
    cities,
  });
}
