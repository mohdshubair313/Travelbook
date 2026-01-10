'use client';

import { motion } from 'framer-motion';
import { Train, Clock, Calendar, ArrowRight, IndianRupee } from 'lucide-react';

interface TrainCardProps {
  train: {
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
  };
}

// Train type badge colors
const trainTypeColors: Record<string, string> = {
  'Rajdhani': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Shatabdi': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Duronto': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Vande Bharat': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Garib Rath': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Humsafar': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Tejas': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Superfast': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Express': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function TrainCard({ train }: TrainCardProps) {
  const { schedule, pricing, from, to } = train;

  // Get badge color based on train type
  const badgeColor = trainTypeColors[train.trainType] || trainTypeColors['Express'];

  // Format price with INR symbol
  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Get lowest available price
  const getLowestPrice = () => {
    const prices = [
      pricing.general,
      pricing.sleeper,
      pricing.ac3,
      pricing.ac2,
      pricing.ac1,
    ].filter((p): p is number => p !== undefined && p !== null);

    if (prices.length === 0) return null;
    return Math.min(...prices);
  };

  const lowestPrice = getLowestPrice();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-blue-500/5">
      <div className="p-4 md:p-6">
        {/* Header: Train Number, Name, Type */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Train className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-semibold text-white">
                {train.trainNumber}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {train.trainType}
              </span>
            </div>
            <h3 className="text-gray-300 font-medium">{train.trainName}</h3>
          </div>

          {/* Lowest Price Badge */}
          {lowestPrice && (
            <div className="text-right">
              <span className="text-xs text-gray-500">Starting from</span>
              <div className="text-xl font-bold text-green-400 flex items-center">
                <IndianRupee className="w-4 h-4" />
                {lowestPrice.toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>

        {/* Route & Time */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Departure */}
          <div>
            <div className="text-2xl font-bold text-white">
              {schedule.departure || '--:--'}
            </div>
            <div className="text-sm text-gray-400">{from.station}</div>
            <div className="text-xs text-gray-500">{from.city}</div>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="h-px w-8 bg-gray-600" />
              <Clock className="w-4 h-4" />
              <div className="h-px w-8 bg-gray-600" />
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {schedule.duration || 'N/A'}
            </div>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {schedule.arrival || '--:--'}
            </div>
            <div className="text-sm text-gray-400">{to.station}</div>
            <div className="text-xs text-gray-500">{to.city}</div>
          </div>
        </div>

        {/* Running Days */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="flex gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span
                key={day}
                className={`text-xs px-2 py-1 rounded ${
                  schedule.runningDays.includes(day)
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700/50 text-gray-600'
                }`}
              >
                {day.charAt(0)}
              </span>
            ))}
          </div>
        </div>

        {/* Class-wise Pricing */}
        <div className="grid grid-cols-5 gap-2 pt-4 border-t border-gray-700">
          <PriceBox label="GN" price={pricing.general} />
          <PriceBox label="SL" price={pricing.sleeper} />
          <PriceBox label="3A" price={pricing.ac3} highlight />
          <PriceBox label="2A" price={pricing.ac2} />
          <PriceBox label="1A" price={pricing.ac1} />
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 md:px-6 py-3 bg-gray-900/50 rounded-b-xl flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Data from ConfirmTkt
        </span>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-1">
          Check Availability
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Price box component
function PriceBox({
  label,
  price,
  highlight = false,
}: {
  label: string;
  price?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`text-center p-2 rounded-lg ${
        highlight ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-900/30'
      }`}
    >
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-sm font-medium ${price ? 'text-white' : 'text-gray-600'}`}>
        {price ? `₹${price.toLocaleString('en-IN')}` : '-'}
      </div>
    </div>
  );
}
