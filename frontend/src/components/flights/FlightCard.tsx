'use client';

import { Plane, Clock, IndianRupee } from 'lucide-react';

interface FlightCardProps {
  flight: {
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
  };
}

// Airline colors
const airlineColors: Record<string, string> = {
  'IndiGo': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Air India': 'bg-red-500/20 text-red-400 border-red-500/30',
  'SpiceJet': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Vistara': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Akasa Air': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Air India Express': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Go First': 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function FlightCard({ flight }: FlightCardProps) {
  const { schedule, pricing, from, to } = flight;

  // Get badge color based on airline
  const badgeColor = airlineColors[flight.airline] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  // Format stops text
  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Non-stop';
    if (stops === 1) return '1 Stop';
    return `${stops} Stops`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-purple-500/5">
      <div className="p-4 md:p-6">
        {/* Header: Airline & Flight Number */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plane className="w-5 h-5 text-purple-400" />
              <span className={`text-sm px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {flight.airline}
              </span>
              {flight.flightNumber && (
                <span className="text-sm text-gray-500">
                  {flight.flightNumber}
                </span>
              )}
            </div>
          </div>

          {/* Price Badge */}
          <div className="text-right">
            <span className="text-xs text-gray-500">Economy</span>
            <div className="text-2xl font-bold text-green-400 flex items-center">
              <IndianRupee className="w-5 h-5" />
              {pricing.economy.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Route & Time */}
        <div className="grid grid-cols-7 gap-2 items-center mb-4">
          {/* Departure */}
          <div className="col-span-2">
            <div className="text-2xl font-bold text-white">
              {schedule.departure || '--:--'}
            </div>
            <div className="text-sm font-medium text-gray-300">{from.airport}</div>
            <div className="text-xs text-gray-500">{from.city}</div>
          </div>

          {/* Flight Path Visual */}
          <div className="col-span-3 flex flex-col items-center justify-center px-2">
            <div className="text-xs text-gray-500 mb-1">{schedule.duration}</div>
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500 via-gray-600 to-purple-500 relative">
                <Plane className="w-4 h-4 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-90" />
              </div>
              <div className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
            <div className={`text-xs mt-1 ${flight.stops === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
              {getStopsText(flight.stops)}
            </div>
          </div>

          {/* Arrival */}
          <div className="col-span-2 text-right">
            <div className="text-2xl font-bold text-white">
              {schedule.arrival || '--:--'}
            </div>
            <div className="text-sm font-medium text-gray-300">{to.airport}</div>
            <div className="text-xs text-gray-500">{to.city}</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{schedule.duration}</span>
            </div>
            {pricing.business && (
              <div className="text-sm text-gray-500">
                Business: <span className="text-gray-300">₹{pricing.business.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm text-white font-medium transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
