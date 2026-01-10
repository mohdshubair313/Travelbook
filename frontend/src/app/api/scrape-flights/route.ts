// API Route: /api/scrape-flights
// Scrapes flight data and saves to database

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapeFlights } from '@/lib/scrapers/flightScraper';
import { getAirportCode } from '@/lib/scrapers/constants';

export async function POST(request: Request) {
  try {
    const { fromCity, toCity, date, maxFlights = 20 } = await request.json();

    // Validate input
    if (!fromCity || !toCity || !date) {
      return NextResponse.json(
        { success: false, error: 'fromCity, toCity, and date are required' },
        { status: 400 }
      );
    }

    // Validate airport codes exist
    const fromAirport = getAirportCode(fromCity);
    const toAirport = getAirportCode(toCity);

    if (!fromAirport) {
      return NextResponse.json(
        { success: false, error: `Invalid source city: ${fromCity}` },
        { status: 400 }
      );
    }

    if (!toAirport) {
      return NextResponse.json(
        { success: false, error: `Invalid destination city: ${toCity}` },
        { status: 400 }
      );
    }

    console.log(`\n✈️ Starting flight scrape: ${fromCity} → ${toCity} on ${date}`);

    // Scrape flights
    const flights = await scrapeFlights(fromCity, toCity, date, { maxFlights });

    console.log(`📦 Scraped ${flights.length} flights`);

    // Save to database
    let savedCount = 0;

    // Delete old flights for this route and date first
    await prisma.flightRoute.deleteMany({
      where: {
        fromCity: fromAirport.city,
        toCity: toAirport.city,
        flightDate: new Date(date),
      },
    });

    for (const flight of flights) {
      try {
        await prisma.flightRoute.create({
          data: {
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            airlineCode: flight.airlineCode,
            fromAirport: flight.fromAirport,
            fromCity: flight.fromCity,
            toAirport: flight.toAirport,
            toCity: flight.toCity,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            duration: flight.duration,
            stops: flight.stops,
            priceEconomy: flight.priceEconomy,
            priceBusiness: flight.priceBusiness,
            flightDate: new Date(flight.flightDate),
            source: flight.source,
            sourceUrl: flight.sourceUrl,
          },
        });
        savedCount++;
      } catch (dbError: unknown) {
        const errMsg = dbError instanceof Error ? dbError.message : 'Unknown DB error';
        console.error(`❌ DB Error for flight ${flight.flightNumber}:`, errMsg);
      }
    }

    // Update search cache
    await prisma.flightSearchCache.upsert({
      where: {
        fromCity_toCity_searchDate: {
          fromCity: fromAirport.city,
          toCity: toAirport.city,
          searchDate: new Date(date),
        },
      },
      update: {
        resultsCount: flights.length,
        lastSearched: new Date(),
        isStale: false,
      },
      create: {
        fromCity: fromAirport.city,
        toCity: toAirport.city,
        searchDate: new Date(date),
        resultsCount: flights.length,
        lastSearched: new Date(),
      },
    });

    console.log(`\n💾 Database: ${savedCount} flights saved`);

    return NextResponse.json({
      success: true,
      data: flights,
      count: flights.length,
      saved: savedCount,
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

// GET: Return available cities/airports
export async function GET() {
  const cities = [
    { name: 'New Delhi', code: 'DEL' },
    { name: 'Mumbai', code: 'BOM' },
    { name: 'Bangalore', code: 'BLR' },
    { name: 'Chennai', code: 'MAA' },
    { name: 'Kolkata', code: 'CCU' },
    { name: 'Hyderabad', code: 'HYD' },
    { name: 'Pune', code: 'PNQ' },
    { name: 'Ahmedabad', code: 'AMD' },
    { name: 'Goa', code: 'GOI' },
    { name: 'Jaipur', code: 'JAI' },
    { name: 'Lucknow', code: 'LKO' },
    { name: 'Kochi', code: 'COK' },
    { name: 'Guwahati', code: 'GAU' },
    { name: 'Patna', code: 'PAT' },
    { name: 'Varanasi', code: 'VNS' },
    { name: 'Chandigarh', code: 'IXC' },
    { name: 'Amritsar', code: 'ATQ' },
    { name: 'Bhopal', code: 'BHO' },
    { name: 'Indore', code: 'IDR' },
    { name: 'Nagpur', code: 'NAG' },
  ];

  return NextResponse.json({
    success: true,
    cities,
  });
}
