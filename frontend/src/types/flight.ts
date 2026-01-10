// TypeScript interfaces for Flight data

export interface FlightResult {
  flightNumber?: string;
  airline: string;
  airlineCode?: string;
  fromAirport: string;
  fromCity: string;
  toAirport: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  priceEconomy: number;
  priceBusiness?: number;
  flightDate: string;
  source: string;
  sourceUrl?: string;
}

export interface FlightSearchParams {
  fromCity: string;
  toCity: string;
  date: string; // Format: YYYY-MM-DD
  passengers?: number;
}

export interface FlightSearchResponse {
  success: boolean;
  data: FlightResult[];
  count: number;
  fromCache: boolean;
  scrapedAt?: string;
  error?: string;
}

// Airport info
export interface AirportInfo {
  code: string;
  name: string;
  city: string;
}

// Airline info
export interface AirlineInfo {
  code: string;
  name: string;
  logo?: string;
}
