'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Train, MapPin, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import TrainCard from './TrainCard';

// Available cities for search
const CITIES = [
  'New Delhi',
  'Mumbai',
  'Kolkata',
  'Chennai',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Patna',
  'Varanasi',
  'Goa',
  'Bhopal',
  'Chandigarh',
  'Amritsar',
  'Kochi',
  'Coimbatore',
  'Nagpur',
  'Agra',
];

interface TrainResult {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: string;
  from: { station: string; city: string };
  to: { station: string; city: string };
  schedule: {
    departure: string;
    arrival: string;
    duration: string;
    runningDays: string[];
  };
  pricing: {
    general?: number;
    sleeper?: number;
    ac3?: number;
    ac2?: number;
    ac1?: number;
  };
}

export default function TrainSearch() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [trains, setTrains] = useState<TrainResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [searched, setSearched] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  // Search trains from cache
  const searchTrains = async () => {
    if (!fromCity || !toCity) {
      toast.error('Please select both cities');
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
      });

      const response = await fetch(`/api/search-trains?${params}`);
      const data = await response.json();

      if (data.success) {
        setTrains(data.data);
        setFromCache(data.fromCache);

        if (data.data.length === 0) {
          toast.info('No trains found. Try scraping fresh data.');
        } else {
          toast.success(`Found ${data.count} trains`);
        }

        // Auto-scrape if data is stale or empty
        if (data.needsScraping || data.data.length === 0) {
          toast.info('Data might be outdated. Click "Scrape Fresh Data" for latest info.');
        }
      } else {
        toast.error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search trains');
    } finally {
      setIsLoading(false);
    }
  };

  // Scrape fresh train data
  const scrapeTrains = async () => {
    if (!fromCity || !toCity) {
      toast.error('Please select both cities');
      return;
    }

    setIsScraping(true);
    toast.info('Scraping train data... This may take a moment.');

    try {
      const response = await fetch('/api/scrape-trains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCity: fromCity.toLowerCase(),
          toCity: toCity.toLowerCase(),
          maxTrains: 30,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Scraped ${data.count} trains! (${data.saved} new, ${data.updated} updated)`);
        // Refresh search results
        await searchTrains();
      } else {
        toast.error(data.error || 'Scraping failed');
      }
    } catch (error) {
      console.error('Scrape error:', error);
      toast.error('Failed to scrape trains');
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
          <Train className="w-8 h-8 text-blue-400" />
          Train Search
        </h2>
        <p className="text-gray-400">Find trains between any two cities in India</p>
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
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
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
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
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
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
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

          {/* Date (Optional) */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">Date (Optional)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={searchTrains}
            disabled={isLoading || !fromCity || !toCity}
            className="flex-1 md:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Trains
              </>
            )}
          </button>

          <button
            onClick={scrapeTrains}
            disabled={isScraping || !fromCity || !toCity}
            className="flex-1 md:flex-none px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isScraping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scraping...
              </>
            ) : (
              <>
                <Train className="w-5 h-5" />
                Scrape Fresh Data
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
              {trains.length > 0
                ? `${trains.length} Trains Found`
                : 'No Trains Found'}
            </h3>
            {fromCache && trains.length > 0 && (
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                From Cache
              </span>
            )}
          </div>

          {/* Train Cards */}
          {trains.length > 0 ? (
            <div className="grid gap-4">
              {trains.map((train, index) => (
                <motion.div
                  key={train.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TrainCard train={train} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700">
              <Train className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                No trains found for this route in our database.
              </p>
              <button
                onClick={scrapeTrains}
                disabled={isScraping}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
              >
                {isScraping ? 'Scraping...' : 'Scrape Train Data'}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
