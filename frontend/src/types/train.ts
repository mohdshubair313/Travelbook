// TypeScript interfaces for Train data

export interface TrainResult {
  trainNumber: string;
  trainName: string;
  trainType: string;
  fromStation: string;
  fromCity: string;
  toStation: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance?: number;
  runningDays: string[];
  // Pricing
  priceSleeper?: number;
  priceAC3?: number;
  priceAC2?: number;
  priceAC1?: number;
  priceGeneral?: number;
  // Metadata
  source: string;
  sourceUrl?: string;
}

export interface TrainSearchParams {
  fromCity: string;
  toCity: string;
  date?: string; // Format: YYYY-MM-DD
}

export interface TrainSearchResponse {
  success: boolean;
  data: TrainResult[];
  count: number;
  fromCache: boolean;
  scrapedAt?: string;
  error?: string;
}

export interface ScrapingProgress {
  status: 'idle' | 'scraping' | 'completed' | 'error';
  message: string;
  progress?: number;
}

// Station code mappings
export interface StationInfo {
  code: string;
  name: string;
  city: string;
  state: string;
}
