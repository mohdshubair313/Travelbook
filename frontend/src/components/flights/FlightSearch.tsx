'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plane, MapPin, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import FlightCard from './FlightCard';

// Available cities for search
const CITIES = [
  'New Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Goa',
  'Jaipur',
  'Lucknow',
  'Kochi',
  'Guwahati',
  'Patna',
  'Varanasi',
  'Chandigarh',
  'Amritsar',
  'Bhopal',
  'Indore',
  'Nagpur',
];

interface FlightResult {
  id: string;
  flightNumber?: string;
  airline: string;
  airlineCode?: string;
  from: { airport: string; city: string };
  to: { airport: string; city: string };
  schedule: {
    departure: string;
    arrival: string;
    duration: string;
    date: string;
  };
  stops: number;
  pricing: {
    economy: number;
    business?: number;
  };
}

export default function FlightSearch() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [searched, setSearched] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  // Get tomorrow's date as minimum
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Search flights from cache
  const searchFlights = async () => {
    if (!fromCity || !toCity || !date) {
      toast.error('Please select cities and date');
      return;
    }

    if (fromCity === toCity) {
      toast.error('Source and destination cannot be same');
      return;
    }

    setIsLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({
        from: fromCity.toLowerCase(),
        to: toCity.toLowerCase(),
        date: date,
      });

      const response = await fetch(`/api/search-flights?${params}`);
      const data = await response.json();

      if (data.success) {
        setFlights(data.data);
        setFromCache(data.fromCache);

        if (data.data.length === 0) {
          toast.info('No flights found. Click "Search Flights" to fetch data.');
        } else {
          toast.success(`Found ${data.count} flights`);
        }

        if (data.needsScraping) {
          toast.info('Data might be outdated. Click "Search Flights" for latest prices.');
        }
      } else {
        toast.error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search flights');
    } finally {
      setIsLoading(false);
    }
  };

  // Scrape fresh flight data
  const scrapeFlights = async () => {
    if (!fromCity || !toCity || !date) {
      toast.error('Please select cities and date');
      return;
    }

    setIsScraping(true);
    toast.info('Fetching flight data... This may take a moment.');

    try {
      const response = await fetch('/api/scrape-flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCity: fromCity.toLowerCase(),
          toCity: toCity.toLowerCase(),
          date: date,
          maxFlights: 20,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Found ${data.count} flights!`);
        setFlights(data.data.map((f: any) => ({
          id: f.id || Math.random().toString(),
          flightNumber: f.flightNumber,
          airline: f.airline,
          airlineCode: f.airlineCode,
          from: { airport: f.fromAirport, city: f.fromCity },
          to: { airport: f.toAirport, city: f.toCity },
          schedule: {
            departure: f.departureTime,
            arrival: f.arrivalTime,
            duration: f.duration,
            date: f.flightDate,
          },
          stops: f.stops,
          pricing: {
            economy: f.priceEconomy,
            business: f.priceBusiness,
          },
        })));
        setSearched(true);
        setFromCache(false);
      } else {
        toast.error(data.error || 'Failed to fetch flights');
      }
    } catch (error) {
      console.error('Scrape error:', error);
      toast.error('Failed to fetch flights');
    } finally {
      setIsScraping(false);
    }
  };

  // Swap cities
  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Plane className="w-8 h-8 text-purple-400" />
          Flight Search
        </h2>
        <p className="text-gray-400">Find the best flight deals across India</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* From City */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Select City</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center md:justify-start">
            <button
              onClick={swapCities}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
              title="Swap cities"
            >
              <ArrowRight className="w-5 h-5 text-white rotate-90 md:rotate-0" />
            </button>
          </div>

          {/* To City */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Select City</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">Travel Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={date}
                min={getMinDate()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={searchFlights}
            disabled={isLoading || !fromCity || !toCity || !date}
            className="flex-1 md:flex-none px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search (Cache)
              </>
            )}
          </button>

          <button
            onClick={scrapeFlights}
            disabled={isScraping || !fromCity || !toCity || !date}
            className="flex-1 md:flex-none px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isScraping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Plane className="w-5 h-5" />
                Search Flights
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      {searched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              {flights.length > 0
                ? `${flights.length} Flights Found`
                : 'No Flights Found'}
            </h3>
            {fromCache && flights.length > 0 && (
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                From Cache
              </span>
            )}
          </div>

          {/* Flight Cards */}
          {flights.length > 0 ? (
            <div className="grid gap-4">
              {flights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FlightCard flight={flight} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
              <Plane className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                No flights found for this route.
              </p>
              <button
                onClick={scrapeFlights}
                disabled={isScraping}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
              >
                {isScraping ? 'Fetching...' : 'Search Flights'}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
